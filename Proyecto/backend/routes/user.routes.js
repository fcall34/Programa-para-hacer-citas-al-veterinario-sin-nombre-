import express from "express";
import { poolPromise, sql } from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAllServices, getServiceById } from "../Controllers/Client.Controllers.js"


const JWT_SECRET = "super";
const router = express.Router();

function verifyToken(req, res, next) {
  console.log("HEADERS RECIBIDOS:", req.headers);
  console.log("Authorization header:", req.headers["authorization"]);

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Token faltante en headers");
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, decoded.id)
      .query("SELECT SessionToken FROM Users WHERE user_id = @id");

    const dbToken = result.recordset[0]?.SessionToken;

    if (dbToken !== token) {
      return res.status(403).json({ error: "Sesión inválida" });
    }

    req.user = decoded;
    next();
  });
}

//get ALL SERVICES PAGINA CLIENTE
router.get("/services", verifyToken, getAllServices);
router.get("/services/:id", verifyToken, getServiceById);

// POST /register
router.post('/register', async (req, res) => {
  const { full_name, email, phone, location, password, user_type } = req.body;

  if (!full_name || !email || !password || !user_type) {
    return res.status(400).send({ success: false, message: 'Faltan datos obligatorios' });
  }

  try {
    const pool = await poolPromise;

    const password_hash = await bcrypt.hash(password, 10);

    await pool.request()
      .input('full_name', sql.NVarChar(100), full_name)
      .input('email', sql.NVarChar(100), email)
      .input('phone', sql.NVarChar(20), phone)
      .input('location', sql.NVarChar(200), location)
      .input('password_hash', sql.NVarChar(255), password_hash)
      .input('user_type', sql.Int, user_type)
      .query(`
        INSERT INTO Users (full_name, email, phone, location, password_hash, user_type)
        VALUES (@full_name, @email, @phone, @location, @password_hash, @user_type)
      `);

    res.status(201).send({
      success: true,
      message: 'Usuario registrado'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Error en el servidor' });
  }
});



// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise

    const result = await pool.request()
      .input('email', sql.NVarChar(100), email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = result.recordset[0];

    
     const passwordMatch = await bcrypt.compare(password, user.password_hash);
      

    if (!passwordMatch) {
      return res.json({ success: false, message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({
      id: user.user_id,
      tipo: user.user_type

    }, JWT_SECRET, {expiresIn: "1h"});

    await pool.request()
      .input("token", sql.VarChar, token)
      .input("id", sql.Int, user.user_id)
      .query("UPDATE [dbo].[Users] SET SessionToken = @token WHERE user_id = @id");

    const redirect = user.user_type

    // Login exitoso
    res.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.user_id,
        user_type: user.user_type
      },
      redirect,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
});

//proveedores
router.post("/publish", verifyToken, async (req, res) => {
  try {
    const provider_id = req.user.id;   

    const {
      title,
      description,
      cost,
      location,
      available,
      category_id,
      expiration_date
    } = req.body;

    if (!title || !description || !cost || !location || !category_id || !expiration_date) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const pool = await poolPromise;

    await pool.request()
      .input("provider_id", sql.Int, provider_id)
      .input("title", sql.VarChar(100), title)
      .input("description", sql.VarChar(sql.MAX), description)
      .input("cost", sql.Decimal(10, 2), cost)
      .input("location", sql.VarChar(150), location)
      .input("available", sql.Bit, available)
      .input("category_id", sql.Int, category_id)
      .input("expiration_date", sql.Date, expiration_date)
      .query(`
        INSERT INTO Services (
          provider_id, title, description, cost, location,
          available, created_at, category_id, expiration_date
        )
        VALUES (
          @provider_id, @title, @description, @cost, @location,
          @available, GETDATE(), @category_id, @expiration_date
        )
      `);

    res.json({ message: "Servicio publicado correctamente" });

  } catch (error) {
    console.error("Error al publicar servicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


//pantalla clientes

// Obtener todos los servicios (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    let query = "SELECT service_id, title, category, cost, location FROM Services WHERE available = 1";

    if (req.query.location) {
      query += ` AND location LIKE '%${req.query.location}%'`;
    }
    if (req.query.maxPrice) {
      query += ` AND cost <= ${req.query.maxPrice}`;
    }

    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener detalles de un servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Services WHERE service_id = @id");

    if (result.recordset.length === 0) return res.status(404).send("Servicio no encontrado");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener todos los usuarios
router.get('/admin', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT user_id, full_name, email, phone, location, user_type FROM Users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


export default router;


