import { poolPromise, sql } from "../database.js";

// Crear una cita
export const createAppointment = async (req, res) => {
  try {
    const { service_id, appointment_date } = req.body;
    const client_id = req.user.id;

    if (!service_id || !appointment_date) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos necesarios"
      });
    }

    const pool = await poolPromise;

    // Obtener datos del servicio
    const serviceRes = await pool.request()
      .input("service_id", sql.Int, service_id)
      .query(`
        SELECT provider_id, expiration_date, start_time, end_time
        FROM dbo.Services
        WHERE service_id = @service_id
      `);

    if (serviceRes.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    }

    const { provider_id, expiration_date, start_time, end_time } =
      serviceRes.recordset[0];

    // Validar fecha límite
    const dateOnly = appointment_date.split("T")[0];

    if (dateOnly > expiration_date.toISOString().split("T")[0]) {
      return res.status(400).json({
        success: false,
        message: "La fecha seleccionada rebasa la fecha límite del servicio"
      });
    }

    // Extraer hora seleccionada por el usuario: "HH:mm"
    const appointment_time = appointment_date.split("T")[1].substring(0, 5);

    // Validar horario
    if (appointment_time < start_time || appointment_time > end_time) {
      return res.status(400).json({
        success: false,
        message: `El horario debe estar entre ${start_time} y ${end_time}`
      });
    }

    // Crear cita
    await pool.request()
      .input("Appointment_date", sql.DateTime, appointment_date)
      .input("provider_id", sql.Int, provider_id)
      .input("client_id", sql.Int, client_id)
      .input("service_id", sql.Int, service_id)
      .input("Appointment_time", sql.VarChar, appointment_time)
      .query(`
        INSERT INTO dbo.Appointments (
          provider_id,
          client_id,
          Appointment_date,
          Appointment_status,
          service_id,
          Appointment_time
        )
        VALUES (
          @provider_id,
          @client_id,
          @Appointment_date,
          0,
          @service_id,
          @Appointment_time
        )
      `);

    return res.json({ success: true, message: "Cita creada correctamente" });

  } catch (error) {
    console.error("Error createAppointment:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
