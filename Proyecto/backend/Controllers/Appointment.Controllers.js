import { poolPromise, sql } from "../database.js";
import {generateTicketPDF}  from "../Utils/TicketCita.js"
import { getResendClient } from "../Utils/Mailer.js"


// Crear una cita
export const createAppointment = async (req, res) => {
  try {
    const { service_id, appointment_date } = req.body;
    const client_id = req.user.id;

    const pool = await poolPromise;

    const userRes = await pool.request()
    .input("user_id", sql.Int,client_id)
    .query("SELECT full_name, email from dbo.Users WHERE user_id =@user_id");

    if(userRes.recordset.length == 0){
      return res.status(404).json({
      success: false,
      message: "Usuario no encontrado"
      });
    }

    const {full_name, email} = userRes.recordset[0];

    if (!service_id || !appointment_date) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos necesarios"
      });
    }

    // Obtener datos del servicio
    const serviceRes = await pool.request()
      .input("service_id", sql.Int, service_id)
      .query(`
        SELECT provider_id, title, expiration_date, start_time, end_time
        FROM dbo.Services
        WHERE service_id = @service_id
      `);



    if (serviceRes.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    }

    const { provider_id, title, expiration_date, start_time, end_time } =
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
    const insertRes = await pool.request()
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
          OUTPUT INSERTED.Appointment_id
        VALUES (
          @provider_id,
          @client_id,
          @Appointment_date,
          0,
          @service_id,
          @Appointment_time
        )
      `);

    const appointmentId = insertRes.recordset[0].Appointment_id;

    const pdfBuffer = await generateTicketPDF({
      appointmentId,
      serviceName: title,
      appointmentDate: expiration_date
    });

    const resend = getResendClient();

      try {
        const response = await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Ticket de tu cita",
          html: `
            <h2>Tu cita fue agendada correctamente</h2>
            <p>Adjuntamos el ticket de tu cita.</p>
            <p><strong>Folio:</strong> ${appointmentId}</p>
          `,
          attachments: [
            {
              filename: `ticket-${appointmentId}.pdf`,
              content: pdfBuffer
            }
          ],
        });

        console.log("Respuesta de Resend:", response);

    } catch (mailError) {
      console.error("Error enviando correo:", mailError);
    }

    return res.json({ success: true, message: "Cita creada correctamente" });

  } catch (error) {
    console.error("Error createAppointment:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const client_id = req.user.id;

    const query = `
      SELECT 
        a.Appointment_id AS appointment_id,
        CONVERT(varchar(19), a.Appointment_date, 120) AS appointment_date, -- "YYYY-MM-DD HH:MM:SS"
        a.Appointment_status AS appointment_status,
        a.Appointment_time AS appointment_time,
        s.title AS title,
        s.location AS location,
        FORMAT(s.start_time, 'HH:mm') AS service_start_time,
        FORMAT(s.end_time, 'HH:mm') AS service_end_time,
        c.category_description AS category
      FROM dbo.Appointments a
      JOIN dbo.Services s ON a.service_id = s.service_id
      LEFT JOIN dbo.Category c ON s.category_id = c.category_id
      WHERE a.client_id = @client_id
      ORDER BY a.Appointment_date DESC
    `;

    const result = await pool.request()
      .input("client_id", sql.Int, client_id)
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

export const getAcceptedAppointmentsByProvider = async (req, res) => {
  try {
    const providerId = req.user.id;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("provider_id", sql.Int, providerId)
      .query(`
        SELECT 
          a.Appointment_id,
          a.Appointment_date,
          a.Appointment_status,
          a.is_complete,
          s.title AS service_name,
          u.full_name AS client_name,
          u.phone AS client_phone,
          u.email AS client_email
        FROM Appointments a
        JOIN Services s ON a.service_id = s.service_id
        JOIN Users u ON a.client_id = u.user_id
        WHERE 
          a.provider_id = @provider_id
          AND a.Appointment_status = 1
        ORDER BY a.Appointment_date ASC

      `);

    res.json({
      success: true,
      appointments: result.recordset
    });

  } catch (error) {
    console.error("Error obteniendo citas aceptadas:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

export const completeAppointment = async (req, res) => {
  const { folio } = req.body;
  const providerId = req.user.id;

  if (!folio) {
    return res.status(400).json({
      success: false,
      message: "Folio requerido"
    });
  }

  try {
    const pool = await poolPromise;

    // 1️⃣ Validar cita
    const appointmentRes = await pool.request()
      .input("appointment_id", sql.Int, folio)
      .input("provider_id", sql.Int, providerId)
      .query(`
        SELECT *
        FROM Appointments
        WHERE appointment_id = @appointment_id
          AND provider_id = @provider_id
          AND appointment_status = 1
          AND is_complete = 0
      `);

    if (appointmentRes.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Folio inválido, cita no aceptada o ya completada"
      });
    }

    // 2️⃣ Marcar como completada
    await pool.request()
      .input("appointment_id", sql.Int, folio)
      .query(`
        UPDATE Appointments
        SET is_complete = 1
        WHERE appointment_id = @appointment_id
      `);

    return res.json({
      success: true,
      message: "Cita completada correctamente"
    });

  } catch (error) {
    console.error("Error completando cita:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};



