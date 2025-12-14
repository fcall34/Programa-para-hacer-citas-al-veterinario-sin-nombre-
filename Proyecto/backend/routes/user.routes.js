import express from "express";
import { getAllServices, getServiceById } from "../Controllers/Client.Controllers.js"
import { createAppointment, getAppointments } from "../Controllers/Appointment.Controllers.js"
import {publishService, ViewAllAppointments, UpdateAppointmentStatus} from "../Controllers/Provider.Controllers.js"
import {adminGetAllUsers, adminGetAllServices, adminDeleteUser, adminDeleteService, adminCreateUser} from "../Controllers/Admin.Controllers.js"
import { register, login, logoutUser, verifyEmail } from "../Controllers/Auth.Controllers.js";
import {requireRole} from "../Middleware/Roles.Middleware.js"
import { ROLES } from "../Constants/Roles.js";
import { verifyToken } from "../Middleware/Token.Middleware.js";


const router = express.Router();

//get ALL SERVICES PAGINA CLIENTE
router.get("/services", verifyToken,requireRole(ROLES.CLIENT),getAllServices);
router.get("/services/:id", verifyToken, requireRole(ROLES.CLIENT), getServiceById);

// POST /register
router.post('/register', register);

// POST /login
router.post('/login', login);


//post crear servicio
router.post("/provider/publish", verifyToken,requireRole(ROLES.PROVIDER),publishService);

//get obtener citas segun provider_id
router.get("/provider/miscitas", verifyToken, requireRole(ROLES.PROVIDER), ViewAllAppointments);

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


