const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../database.js')
const bcrypt = require('bcrypt');

// POST /api/register
router.post('/register', async (req, res) => {
  const { full_name, email, phone, location, password, user_type } = req.body;

  if (!full_name || !email || !password || !user_type) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  try {
    const pool = await poolPromise;

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.request()
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

    res.status(201).send({ message: 'Usuario registrado' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});


// POST /api/login
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

    // Login exitoso
    res.json({
      success: true,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
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


module.exports = router;


