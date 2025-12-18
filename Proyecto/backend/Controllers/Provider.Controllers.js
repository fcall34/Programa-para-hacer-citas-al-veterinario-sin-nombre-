import {sql, poolPromise} from "../database.js"

export const publishService = async (req, res) => {
    try {
    const provider_id = req.user.id;   

    const {
      title,
      description,
      cost,
      location,
      available,
      category_id,
      expiration_date,
      start_time,
      end_time
    } = req.body;

    if (!title || !description || !cost || !location || !category_id || !expiration_date || !start_time || !end_time) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (start_time >= end_time) {
        return res.status(400).json({
          error: "La hora de cierre debe ser mayor que la hora de inicio"
        });
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
      .input("start_time", sql.VarChar, start_time)
      .input("end_time", sql.VarChar, end_time)

      .query(`
        INSERT INTO Services (
          provider_id, title, description, cost, location,
          available, created_at, category_id, expiration_date, start_time, end_time
        )
        VALUES (
          @provider_id, @title, @description, @cost, @location,
          @available, GETDATE(), @category_id, @expiration_date, @start_time, @end_time
        )
      `);

    res.json({ message: "Servicio publicado correctamente" });

  } catch (error) {
    console.error("Error al publicar servicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

};

export const ViewAllAppointments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const provider_id = req.user.id;

    const query = `
      SELECT 
        a.Appointment_id,
        s.title,
        s.cost,
        a.Appointment_status, 
        CONVERT(varchar(10), a.Appointment_date, 120) AS appointment_date,
        a.Appointment_time AS appointment_time,
        a.client_id,
        u.full_name AS client_name,     
        u.email AS client_email, 
        u.phone as client_phone    
      FROM dbo.Services AS s
      JOIN dbo.Appointments AS a ON s.provider_id = a.provider_id
      JOIN dbo.Users AS u ON a.client_id = u.user_id 
      WHERE s.provider_id = @provider_id
      ORDER BY a.Appointment_date DESC
    `;

    const result = await pool.request()
      .input("provider_id", sql.Int, provider_id)
      .query(query);

    return res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error("Error getAppointments:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const UpdateAppointmentStatus = async (req, res) => {
  try {
    const pool = await poolPromise;

    const { id } = req.params;
    const { status } = req.body; 

    console.log("ID recibido:", req.params.id);


    if (![1, 2].includes(status)) {
      return res.status(400).json({ success: false, message: "Estado inválido" });
    }

    await pool.request()
      .input("id", sql.Int, id)
      .input("status", sql.Int, status)
      .query(`
        UPDATE Appointments
        SET Appointment_status = @status
        WHERE Appointment_id = @id
      `);

    res.json({ success: true, message: "Estado actualizado" });

  } catch (err) {
    console.error("Error UpdateAppointmentStatus:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getProviderStats = async (req, res) => {
  try {
    const providerId = req.user.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("provider_id", sql.Int, providerId)
      .query(`
        SELECT
          u.full_name,

          -- citas completadas
          COUNT(DISTINCT a.Appointment_id) AS completedAppointments,

          -- ganancias
          ISNULL(SUM(s.cost), 0) AS totalEarnings,

          -- rating promedio del proveedor
          ROUND(AVG(CAST(r.rating AS FLOAT)), 1) AS avgRating

        FROM Users u
        LEFT JOIN Appointments a
          ON a.provider_id = u.user_id
          AND a.is_complete = 1

        LEFT JOIN Services s 
          ON a.service_id = s.service_id

        LEFT JOIN Reviews r
          ON r.appointment_id = a.appointment_id
          AND r.review_target = 'provider'

        WHERE u.user_id = @provider_id
        GROUP BY u.full_name
      `);

    res.json({
      success: true,
      stats: result.recordset[0]
    });

  } catch (error) {
    console.error("Error obteniendo stats del proveedor:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};


export const getMyServices = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("provider_id", sql.Int, provider_id)
      .query(`
        SELECT
          s.service_id,
          s.title,
          s.description,
          s.cost,
          s.location,
          s.available,
          s.category_id,
          c.category_description,
          CONVERT(varchar(10), s.created_at, 120) AS created_at,
          CONVERT(varchar(10), s.expiration_date, 120) AS expiration_date,
          s.start_time,
          s.end_time
        FROM Services s
        LEFT JOIN Category c ON s.category_id = c.category_id
        WHERE s.provider_id = @provider_id
        ORDER BY s.created_at DESC
      `);

    return res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error("Error getMyServices:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};