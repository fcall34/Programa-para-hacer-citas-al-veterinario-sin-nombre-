import {sql, poolPromise} from "../database.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getResendClient } from "../Utils/Mailer.js";



export const register = async (req, res)=>{
  const { full_name, email, phone, location, password, user_type } = req.body;

  if (!full_name || !email || !password || !user_type) {
    return res.status(400).send({ success: false, message: 'Faltan datos obligatorios' });
  }

  try {
    const pool = await poolPromise;

    const password_hash = await bcrypt.hash(password, 10);

    const userRes = await pool.request()
      .input('full_name', sql.NVarChar(100), full_name)
      .input('email', sql.NVarChar(100), email)
      .input('phone', sql.NVarChar(20), phone)
      .input('location', sql.NVarChar(200), location)
      .input('password_hash', sql.NVarChar(255), password_hash)
      .input('user_type', sql.Int, user_type)
      .query(`
        INSERT INTO Users (full_name, email, phone, location, password_hash, user_type)
        OUTPUT INSERTED.user_id
        VALUES (@full_name, @email, @phone, @location, @password_hash, @user_type)
      `);

      const userId = userRes.recordset[0].user_id;
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await pool.request()
      .input("user_id", sql.Int, userId)
      .input("token", sql.VarChar, token)
      .input("expires_at", sql.DateTime, expiresAt)
      .query(`
        INSERT INTO Email_Verification_Tokens (user_id, token, expires_at)
        VALUES (@user_id, @token, @expires_at)
      `);

      const resend = getResendClient();
      const verifyUrl = `${process.env.BACKEND_URL}/api/verify-email/${token}`;

      const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: "calleja.jimenez.fernando.yahir@gmail.com",
      subject: "Verifica tu correo",
      html: `
        <h2>Bienvenido</h2>
        <p>Da clic para verificar tu cuenta:</p>
        <a href="${verifyUrl}">Verificar correo</a>
        <p>Este enlace expira en 24 horas</p>
      `
    });
    console.log("respuesta:", response);

    res.status(201).send({
      success: true,
      message: 'Usuario registrado'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Error en el servidor' });
  }
};

export const login = async(req, res) =>{
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

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    if (!user.email_verified) {
    return res.status(403).json({
      success: false,
      message: "Debes verificar tu correo antes de iniciar sesión"
    });
  }

    const token = jwt.sign({
      id: user.user_id,
      user_type: user.user_type,
      email_verified: user.email_verified

    }, process.env.JWT_SECRET, {expiresIn: "1h"});

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
}


export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const pool = await poolPromise;

    await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("UPDATE dbo.Users SET SessionToken = NULL WHERE User_id = @userId;");

    return res.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      message: "Error al cerrar sesión",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token requerido"
    });
  }

  try {
    const pool = await poolPromise;


    const tokenRes = await pool.request()
      .input("token", sql.VarChar, token)
      .query(`
        SELECT * FROM Email_Verification_Tokens
        WHERE token = @token AND expires_at > GETDATE()
      `);

    if (tokenRes.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Token inválido o expirado"
      });
    }

    const { user_id } = tokenRes.recordset[0];

    await pool.request()
      .input("user_id", sql.Int, user_id)
      .query(`
        UPDATE Users
        SET email_verified = 1
        WHERE user_id = @user_id
      `);
    await pool.request()
      .input("token", sql.VarChar, token)
      .query(`
        DELETE FROM Email_Verification_Tokens
        WHERE token = @token
      `);

    return res.json({
      success: true,
      message: "Correo verificado correctamente"
    });

  } catch (error) {
    console.error("Error verificando correo:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT user_id, full_name, email, phone, location, user_type FROM Users WHERE user_id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      user: result.recordset[0]
    });

  } catch (error) {
    console.error("Error en profile:", error);
    res.status(500).json({ success: false, message: "Error al obtener perfil" });
  }
};


export const updateLocation = async (req, res) => {
  const { location } = req.body;
  
  // El ID del usuario viene del token
  const userId = req.user.id; 

  try {
    const pool = await poolPromise;
    
    await pool.request()
      .input("location", sql.NVarChar(200), location)
      .input("id", sql.Int, userId)
      .query("UPDATE Users SET location = @location WHERE user_id = @id");

    res.json({ success: true, message: "Ubicación actualizada correctamente" });

  } catch (error) {
    console.error("Error en updateLocation:", error);
    res.status(500).json({ success: false, message: "Error al actualizar ubicación" });
  }
};