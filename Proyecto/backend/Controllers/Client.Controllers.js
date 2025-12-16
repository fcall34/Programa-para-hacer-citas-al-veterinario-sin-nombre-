import { poolPromise, sql } from "../database.js";


export const getAllServices = async (req, res) => {
  try {
    const pool = await poolPromise;

    const query = `
      SELECT 
        s.service_id,
        s.provider_id,
        s.title,
        s.description,
        s.cost,
        s.location,
        s.available,
        s.start_time,
        s.end_time,
        s.created_at,
        c.category_description,
        u.full_name AS provider_name,

        -- ⭐ promedio real
        ISNULL(AVG(CAST(r.rating AS FLOAT)), 0) AS avg_rating,
        COUNT(r.review_id) AS review_count

      FROM Services s
      LEFT JOIN Category c 
        ON s.category_id = c.category_id
      LEFT JOIN Users u 
        ON s.provider_id = u.user_id
      LEFT JOIN Appointments a
        ON a.service_id = s.service_id
      LEFT JOIN Reviews r 
        ON r.appointment_id = a.appointment_id
        AND r.review_target = 'service'

      GROUP BY 
        s.service_id,
        s.provider_id,
        s.title,
        s.description,
        s.cost,
        s.location,
        s.available,
        s.start_time,
        s.end_time,
        s.created_at,
        c.category_description,
        u.full_name

      ORDER BY s.created_at DESC
    `;

    const result = await pool.request().query(query);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error("Error getAllServices:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};




export const getServiceById = async (req, res) => {
  try {
    const service_id = req.params.id;
    const pool = await poolPromise;

    const query = `
      SELECT 
        s.service_id,
        s.provider_id,
        s.title,
        s.description,
        s.cost,
        s.location,
        s.start_time,
        s.end_time,
        c.category_description,
        u.full_name AS provider_name,

        ISNULL(AVG(CAST(r.rating AS FLOAT)), 0) AS avg_rating,
        COUNT(r.review_id) AS review_count

      FROM Services s
      LEFT JOIN Category c 
        ON s.category_id = c.category_id
      LEFT JOIN Users u 
        ON s.provider_id = u.user_id
      LEFT JOIN Appointments a
        ON a.service_id = s.service_id
      LEFT JOIN Reviews r 
        ON r.appointment_id = a.appointment_id
        AND r.review_target = 'service'

      WHERE s.service_id = @service_id

      GROUP BY
        s.service_id,
        s.provider_id,
        s.title,
        s.description,
        s.cost,
        s.location,
        s.start_time,
        s.end_time,
        c.category_description,
        u.full_name
    `;

    const result = await pool
      .request()
      .input("service_id", sql.Int, service_id)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error("Error getServiceById:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
