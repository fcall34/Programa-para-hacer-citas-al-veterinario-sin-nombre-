import { sql, poolPromise } from "../database.js";
import bcrypt from "bcrypt";

// ============================================
// 1. VER TODOS LOS USUARIOS
// ============================================

export const adminGetAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        user_id AS id,
        full_name,
        email,
        phone,
        user_type AS tipo_usuario,
        created_at
      FROM Users
      ORDER BY created_at DESC
    `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    console.error("Error adminGetAllUsers:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ============================================
// 2. VER TODOS LOS SERVICIOS
// ============================================

export const adminGetAllServices = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        s.service_id,
        s.title,
        s.cost,
        s.available,
        s.created_at,
        s.location,
        u.full_name AS provider_name,
        u.email AS provider_email,
        u.user_id AS provider_id
      FROM Services s
      JOIN Users u ON s.provider_id = u.user_id
      ORDER BY s.created_at DESC
    `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    console.error("Error adminGetAllServices:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ============================================
// 3. ELIMINAR UN USUARIO (Y TODOS SUS DATOS)
// ============================================

export const adminDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // Usamos transaction o queries secuenciales. 
    // Aquí secuencial para asegurar el orden de borrado.

    // 1. Borrar Tokens de verificación de email (Si existen)
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Email_Verification_Tokens WHERE user_id = @id`);

    // 2. Borrar CITAS relacionadas
    // Caso A: Citas donde el usuario es el CLIENTE
    // Caso B: Citas donde el usuario es el PROVEEDOR
    // Caso C: Citas vinculadas a los SERVICIOS de este usuario
    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        DELETE FROM Appointments 
        WHERE client_id = @id 
           OR provider_id = @id
           OR service_id IN (SELECT service_id FROM Services WHERE provider_id = @id)
      `);

    // 3. Borrar SERVICIOS (Solo si es proveedor)
    // Ya es seguro borrarlos porque borramos las citas arriba
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Services WHERE provider_id = @id`);

    // 4. Finalmente, BORRAR EL USUARIO
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Users WHERE user_id = @id`);

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Usuario y todos sus datos eliminados correctamente" });

  } catch (err) {
    console.error("Error adminDeleteUser:", err);
    res.status(500).json({ success: false, message: "Error al eliminar usuario: " + err.message });
  }
};


// ============================================
// 4. ELIMINAR UN SERVICIO
// ============================================

export const adminDeleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM Services WHERE service_id = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    }

    res.json({ success: true, message: "Servicio eliminado correctamente" });

  } catch (err) {
    console.error("Error adminDeleteService:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ============================================
// 5. CREAR NUEVO USUARIO ADMIN
// ============================================

export const adminCreateUser = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email y contraseña son obligatorios" });
    }

    const pool = await poolPromise;

    // Verificar si el correo ya existe
    const check = await pool.request()
      .input("email", sql.VarChar(100), email)
      .query(`SELECT user_id FROM Users WHERE email = @email`);

    if (check.recordset.length > 0) {
      return res.status(409).json({ success: false, message: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo admin
    await pool.request()
      .input("full_name", sql.VarChar(100), full_name || null)
      .input("email", sql.VarChar(100), email)
      .input("password", sql.VarChar(200), hashedPassword)
      .input("phone", sql.VarChar(20), phone || null)
      .query(`
        INSERT INTO Users (full_name, email, password_hash, phone, user_type, created_at)
        VALUES (@full_name, @email, @password, @phone, 3, GETDATE())
      `);

    res.json({ success: true, message: "Nuevo administrador creado" });

  } catch (err) {
    console.error("Error adminCreateUser:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
