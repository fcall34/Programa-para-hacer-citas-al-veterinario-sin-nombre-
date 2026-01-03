import {sql, poolPromise} from "../database.js"

export const publishService = async (req, res) => {
    try {
    const provider_id = req.user.id;   

    console.log(req.body);


    const {
      title,
      description,
      cost,
      location,
      available,
      start_date,
      expiration_date,
      start_time,
      end_time
    } = req.body;

    let { category_ids } = req.body;

    if (!title || !description || !cost || !location || !category_ids || !expiration_date || !start_time || !end_time) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (!category_ids || category_ids.length === 0) {
      return res.status(400).json({ error: "Selecciona al menos una categoría" });
    }

    if (!start_date || start_date > expiration_date) {
      return res.status(400).json({
        error: "La fecha de inicio debe ser menor a la de expiración"
      });
    }

    if (start_time >= end_time) {
        return res.status(400).json({
          error: "La hora de cierre debe ser mayor que la hora de inicio"
        });
      }

      
      if (typeof category_ids === "string") {
        category_ids = [category_ids];
      }
      category_ids = category_ids
        .filter(id => id && id.trim() !== "")
        .map(id => parseInt(id, 10));
      if (!category_ids.length) {
        return res.status(400).json({
          error: "Debes seleccionar al menos una categoría"
        });
      }


    const pool = await poolPromise;

     const result = await pool.request()
      .input("provider_id", sql.Int, provider_id)
      .input("title", sql.VarChar(100), title)
      .input("description", sql.VarChar(sql.MAX), description)
      .input("cost", sql.Decimal(10, 2), cost)
      .input("location", sql.VarChar(150), location)
      .input("available", sql.Bit, available)
      .input("expiration_date", sql.Date, expiration_date)
      .input("start_date", sql.Date, start_date)
      .input("start_time", sql.VarChar, start_time)
      .input("end_time", sql.VarChar, end_time)
      .query(`
        INSERT INTO Services (
          provider_id, title, description, cost, location,
          available, created_at, expiration_date, start_time, end_time, start_date
        )
        OUTPUT INSERTED.service_id
        VALUES (
          @provider_id, @title, @description, @cost, @location,
          @available, GETDATE(), @expiration_date, @start_time, @end_time, @start_date
        )
      `);

       const service_id = result.recordset[0].service_id;

       for (const categoryId of category_ids) {
          await pool.request()
            .input("service_id", sql.Int, service_id)
            .input("category_id", sql.Int, categoryId)
            .query(`
              INSERT INTO ServiceCategories (service_id, category_id)
              VALUES (@service_id, @category_id)
            `);
        }
        console.log("FILES:", req.files.length);


       if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.request()
          .input("service_id", sql.Int, service_id)
          .input("image_url", sql.VarChar, `/uploads/services/${file.filename}`)
          .query(`
            INSERT INTO ServiceImages (service_id, image_url)
            VALUES (@service_id, @image_url)
          `);
      }
    }

    res.json({ message: "Servicio publicado correctamente" });

    const serviceid=result.recordset[0].service_id;

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

    // STATS GENERALES
    const statsResult = await pool.request()
      .input("provider_id", sql.Int, providerId)
      .query(`
        SELECT
          u.full_name,
          COUNT(DISTINCT a.appointment_id) AS completedAppointments,
          ISNULL(SUM(s.cost), 0) AS totalEarnings,
          ROUND(AVG(CAST(r.rating AS FLOAT)), 1) AS avgRating
        FROM Users u
        LEFT JOIN Appointments a
          ON a.provider_id = u.user_id
          AND a.is_complete = 1
        LEFT JOIN Services s ON a.service_id = s.service_id
        LEFT JOIN Reviews r
          ON r.appointment_id = a.appointment_id
          AND r.review_target = 'provider'
        WHERE u.user_id = @provider_id
        GROUP BY u.full_name
      `);

    // TOP POR CITAS
    const byAppointments = await pool.request()
      .input("provider_id", sql.Int, providerId)
      .query(`
        SELECT
          s.service_id,
          s.title,
          COUNT(a.appointment_id) AS totalAppointments
        FROM Services s
        LEFT JOIN Appointments a
          ON a.service_id = s.service_id
          AND a.is_complete = 1
        WHERE s.provider_id = @provider_id
        GROUP BY s.service_id, s.title
        ORDER BY totalAppointments DESC
      `);

    // TOP POR RATING
    const byRating = await pool.request()
      .input("provider_id", sql.Int, providerId)
      .query(`
        SELECT
          s.service_id,
          s.title,
          ROUND(AVG(CAST(r.rating AS FLOAT)), 1) AS avgRating,
          COUNT(r.review_id) AS totalReviews
        FROM Services s
        LEFT JOIN Appointments a ON a.service_id = s.service_id
        LEFT JOIN Reviews r
          ON r.appointment_id = a.appointment_id
          AND r.review_target = 'service'
        WHERE s.provider_id = @provider_id
        GROUP BY s.service_id, s.title
        HAVING COUNT(r.review_id) > 0
        ORDER BY avgRating DESC
      `);

    res.json({
      success: true,
      stats: statsResult.recordset[0],
      topByAppointments: byAppointments.recordset,
      topByRating: byRating.recordset
    });

  } catch (error) {
    console.error("Error obteniendo stats:", error);
    res.status(500).json({ success: false });
  }
};


export const getMyServices = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("provider_id", sql.Int, provider_id)
      .query(`SELECT 
            s.service_id,
            s.title,
            s.description,
            s.cost,
            s.location,
            s.available,
            s.start_time,
            s.end_time,
            s.start_date,
            s.expiration_date,


            (
              SELECT c.category_description
              FROM ServiceCategories sc
              JOIN Category c ON sc.category_id = c.category_id
              WHERE sc.service_id = s.service_id
              FOR JSON PATH
            ) AS categories,


            (
              SELECT si.image_url
              FROM ServiceImages si
              WHERE si.service_id = s.service_id
              FOR JSON PATH
            ) AS images

          FROM Services s
          WHERE s.provider_id = @provider_id
          ORDER BY s.created_at DESC;
          `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error("Error getMyServices:", err);
    res.status(500).json({ success: false });
  }
};


import fs from "fs";
import path from "path";

export const updateService = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      cost,
      start_date,
      start_time,
      end_time,
      available,
      deletedImages
    } = req.body;

    const parsedCost = cost ? Number(cost) : null;
  const parsedAvailable = available === "true" || available === true || available === "on";
  const categories = req.body["categories[]"] || req.body.categories;
  const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];




    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Título y descripción son obligatorios"
      });
    }

    if (start_time >= end_time) {
      return res.status(400).json({
        success: false,
        message: "La hora de cierre debe ser mayor a la de inicio"
      });
    }

    const pool = await poolPromise;

    /* 🔐 Verificar dueño */
    const check = await pool.request()
      .input("service_id", sql.Int, id)
      .input("provider_id", sql.Int, provider_id)
      .query(`
        SELECT service_id
        FROM Services
        WHERE service_id = @service_id
          AND provider_id = @provider_id
      `);

    if (check.recordset.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para editar este servicio"
      });
    }

    /* 📝 Actualizar servicio */
    await pool.request()
      .input("service_id", sql.Int, id)
      .input("title", sql.VarChar(100), title)
      .input("description", sql.VarChar(sql.MAX), description)
      .input("cost", sql.Decimal(10, 2), cost)
      .input("start_date", sql.Date, start_date || null)
      .input("available", sql.Bit, available === "true" || available === true)
      .input("start_time", sql.VarChar(5), start_time)
      .input("end_time", sql.VarChar(5), end_time)
      .query(`
        UPDATE Services
        SET
          title = @title,
          description = @description,
          cost = @cost,
          start_date = @start_date,
          available = @available,
          start_time = @start_time,
          end_time = @end_time
        WHERE service_id = @service_id
      `);

    /* 🏷️ Actualizar categorías */
    await pool.request()
      .input("service_id", sql.Int, id)
      .query(`DELETE FROM ServiceCategories WHERE service_id = @service_id`);

    if (categories) {
      const cats = Array.isArray(categories) ? categories : [categories];

      for (const cat of cats) {
        await pool.request()
          .input("service_id", sql.Int, id)
          .input("category_description", sql.VarChar(100), cat)
          .query(`
            INSERT INTO ServiceCategories (service_id, category_id)
            SELECT @service_id, category_id
            FROM Category
            WHERE category_description = @category_description
          `);
      }
    }

    /* ❌ Eliminar imágenes */
    if (deletedImages) {
      const imgs = Array.isArray(deletedImages) ? deletedImages : [deletedImages];

      for (const img of imgs) {
        const filePath = path.join("Uploads/services", path.basename(img));

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        await pool.request()
          .input("service_id", sql.Int, id)
          .input("image_url", sql.VarChar(255), img)
          .query(`
            DELETE FROM ServiceImages
            WHERE service_id = @service_id
              AND image_url = @image_url
          `);
      }
    }

    /* ➕ Agregar nuevas imágenes */
    if (req.files?.length) {
      for (const file of req.files) {
        await pool.request()
          .input("service_id", sql.Int, id)
          .input("image_url", sql.VarChar(255), `/Uploads/services/${file.filename}`)
          .query(`
            INSERT INTO ServiceImages (service_id, image_url)
            VALUES (@service_id, @image_url)
          `);
      }
    }

    res.json({
      success: true,
      message: "Servicio actualizado correctamente"
    });

  } catch (error) {
    console.error("Error updateService:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};



export const deleteService = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const { id } = req.params;
    const pool = await poolPromise;

    /* 🔐 Validar que el servicio pertenece al proveedor */
    const checkService = await pool.request()
      .input("service_id", sql.Int, id)
      .input("provider_id", sql.Int, provider_id)
      .query(`
        SELECT service_id
        FROM Services
        WHERE service_id = @service_id
          AND provider_id = @provider_id
      `);

    if (checkService.recordset.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este servicio"
      });
    }

    /* 🚫 Verificar si existen citas asociadas */
    const checkAppointments = await pool.request()
      .input("service_id", sql.Int, id)
      .query(`
        SELECT COUNT(*) AS total
        FROM Appointments
        WHERE service_id = @service_id
      `);

    if (checkAppointments.recordset[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el servicio porque tiene citas asociadas"
      });
    }

    /* ✅ Eliminar servicio */
    await pool.request()
      .input("service_id", sql.Int, id)
      .query(`
        DELETE FROM Services
        WHERE service_id = @service_id
      `);

    res.json({
      success: true,
      message: "Servicio eliminado correctamente"
    });

  } catch (error) {
    console.error("Error deleteService:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};
