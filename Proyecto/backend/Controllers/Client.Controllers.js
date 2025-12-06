import { poolPromise, sql } from "../database.js";

export const getAllServices = async (req, res) => {
  try {
    const pool = await poolPromise;

    const query = `
      SELECT 
        s.service_id,
        s.title,
        s.description,
        s.cost,
        s.location,
        s.available,
        s.created_at,
        s.expiration_date,
        c.category_description,
        u.full_name AS provider_name
      FROM Services s
      LEFT JOIN category c ON s.category_id = c.category_id
      LEFT JOIN Users u ON s.provider_id = u.user_id
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
        s.*,
        c.category_name,
        u.name AS provider_name
      FROM Services s
      LEFT JOIN Category c ON s.category_id = c.category_id
      LEFT JOIN Users u ON s.provider_id = u.user_id
      WHERE s.service_id = @service_id
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
