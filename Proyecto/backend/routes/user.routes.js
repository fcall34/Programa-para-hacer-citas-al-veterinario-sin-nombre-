import express from "express";
import { poolPromise, sql } from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAllServices, getServiceById } from "../Controllers/Client.Controllers.js"
import { createAppointment, getAppointments } from "../Controllers/Appointment.Controllers.js"
import {publishService, ViewAllAppointments, UpdateAppointmentStatus} from "../Controllers/Provider.Controllers.js"
import {adminGetAllUsers, adminGetAllServices, adminDeleteUser, adminDeleteService, adminCreateUser} from "../Controllers/Admin.Controllers.js"
import { register, login, logoutUser, verifyEmail } from "../Controllers/Auth.Controllers.js";

const JWT_SECRET = "super";
const router = express.Router();

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Token faltante en headers");
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, decoded.id)
      .query("SELECT SessionToken FROM Users WHERE user_id = @id");

    const dbToken = result.recordset[0]?.SessionToken;

    if (dbToken !== token) {
      return res.status(403).json({ error: "Sesión inválida" });
    }

    req.user = decoded;
    next();
  });
}

//get ALL SERVICES PAGINA CLIENTE
router.get("/services", verifyToken, getAllServices);
router.get("/services/:id", verifyToken, getServiceById);

// POST /register
router.post('/register', register);

// POST /login
router.post('/login', login);


//post crear servicio
router.post("/provider/publish", verifyToken, publishService);

//get obtener citas segun provider_id
router.get("/provider/miscitas", verifyToken, ViewAllAppointments);

//cambiar estado cita
router.put("/provider/status/:id", verifyToken, UpdateAppointmentStatus);



// POST crear cita
router.post("/appointments", verifyToken, createAppointment);

//ver citas segun id
router.get("/appointments/miscitas", verifyToken, getAppointments);


//admin
router.get("/admin/users", verifyToken, adminGetAllUsers);
router.get("/admin/services", verifyToken, adminGetAllServices);
router.delete("/admin/delete-user/:id", verifyToken, adminDeleteUser);
router.delete("/admin/delete-service/:id", verifyToken, adminDeleteService);
router.post("/admin/create-user", verifyToken, adminCreateUser);

//logout
router.post("/logout", verifyToken, logoutUser);

//verifyemail
router.get("/verify-email/:token", verifyEmail);




export default router;


