import {sql, poolPromise} from "../database.js"

export const createReview = async (req, res) => {
  const {
  appointment_id,
  rating,
  provider_rating,
  service_rating,
  comment,
  review_target
} = req.body;
  const reviewer_id = req.user.id;

  try {
    const pool = await poolPromise;

    // 1️⃣ Cita válida y completada
    const result = await pool.request()
      .input("id", sql.Int, appointment_id)
      .query(`
        SELECT * FROM Appointments
        WHERE Appointment_id = @id AND is_complete = 1
      `);

    if (!result.recordset.length)
      return res.status(400).json({ message: "Cita inválida" });

    const a = result.recordset[0];
    let reviewee_id = null;

    if (reviewer_id === a.client_id) {

  // Proveedor
  if (provider_rating) {
    await pool.request()
      .input("appointment_id", sql.Int, appointment_id)
      .input("reviewer_id", sql.Int, reviewer_id)
      .input("reviewee_id", sql.Int, a.provider_id)
      .input("review_target", sql.VarChar, "provider")
      .input("rating", sql.Int, provider_rating)
      .input("comment", sql.NVarChar, comment || null)
      .query(`
        INSERT INTO Reviews
        (appointment_id, reviewer_id, reviewee_id, review_target, rating, comment)
        VALUES
        (@appointment_id, @reviewer_id, @reviewee_id, @review_target, @rating, @comment)
      `);
  }

  // Servicio (sin comentario)
  if (service_rating) {
    await pool.request()
      .input("appointment_id", sql.Int, appointment_id)
      .input("reviewer_id", sql.Int, reviewer_id)
      .input("reviewee_id", sql.Int, a.provider_id)
      .input("review_target", sql.VarChar, "service")
      .input("rating", sql.Int, service_rating)
      .query(`
        INSERT INTO Reviews
        (appointment_id, reviewer_id, reviewee_id, review_target, rating)
        VALUES
        (@appointment_id, @reviewer_id, @reviewee_id, @review_target, @rating)
      `);
  }

  return res.json({ success: true });
}


    

    // 3️⃣ PROVEEDOR
    else if (reviewer_id === a.provider_id) {
      if (review_target === "client") {
        reviewee_id = a.client_id;
      } else {
        return res.status(403).json({ message: "Proveedor no puede calificar eso" });
      }
    }

            const exists = await pool.request()
        .input("appointment_id", sql.Int, appointment_id)
        .input("reviewer_id", sql.Int, reviewer_id)
        .input("review_target", sql.VarChar, review_target)
        .query(`
            SELECT 1 FROM Reviews
            WHERE appointment_id = @appointment_id
            AND reviewer_id = @reviewer_id
            AND review_target = @review_target
        `);

        if (exists.recordset.length) {
        return res.status(409).json({
            message: "Ya calificaste esta cita"
        });
        }


    // 4️⃣ Comentarios solo del cliente
    if (reviewer_id === a.provider_id && comment)
      return res.status(403).json({ message: "No puedes dejar comentario" });

    // 5️⃣ Guardar
    await pool.request()
      .input("appointment_id", sql.Int, appointment_id)
      .input("reviewer_id", sql.Int, reviewer_id)
      .input("reviewee_id", sql.Int, reviewee_id)
      .input("review_target", sql.VarChar, review_target)
      .input("rating", sql.Int, rating)
      .input("comment", sql.NVarChar, comment || null)
      .query(`
        INSERT INTO Reviews
        (appointment_id, reviewer_id, reviewee_id, review_target, rating, comment)
        VALUES
        (@appointment_id, @reviewer_id, @reviewee_id, @review_target, @rating, @comment)
      `);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};


export const getProviderReviews = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const pool = await poolPromise;

    const query = `
      SELECT
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,
        u.full_name AS reviewer_name
      FROM Reviews r
      INNER JOIN Users u
        ON r.reviewer_id = u.user_id
      WHERE r.review_target = 'provider'
        AND r.reviewee_id = @provider_id
      ORDER BY r.created_at DESC
    `;

    const result = await pool
      .request()
      .input("provider_id", sql.Int, provider_id)
      .query(query);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error("Error getProviderReviews:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
