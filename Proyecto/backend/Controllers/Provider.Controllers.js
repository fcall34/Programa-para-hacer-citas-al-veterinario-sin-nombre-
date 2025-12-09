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



