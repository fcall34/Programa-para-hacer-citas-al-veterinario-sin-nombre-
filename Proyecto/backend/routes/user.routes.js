import express from "express";

/* ================================
   CONTROLADORES CLIENTE
   ================================ */
import { getAllServices, getServiceById } 
from "../Controllers/Client.Controllers.js";

/* ================================
   CONTROLADORES CITAS
   ================================ */
import { createAppointment, getAppointments, getAcceptedAppointmentsByProvider, completeAppointment } 
from "../Controllers/Appointment.Controllers.js";

/* ================================
   CONTROLADORES PROVEEDOR
   ================================ */
import { publishService, ViewAllAppointments, UpdateAppointmentStatus, getProviderStats } 
from "../Controllers/Provider.Controllers.js";

/* ================================
   CONTROLADORES ADMIN
   ================================ */
import { 
  adminGetAllUsers,
  adminGetAllServices,
  adminDeleteUser,
  adminDeleteService,
  adminCreateUser
} from "../Controllers/Admin.Controllers.js";

/* ================================
   CONTROLADORES AUTH / PERFIL
   ================================ */
import {
  register,
  login,
  logoutUser,
  verifyEmail,
  profile,
  updateLocation
} from "../Controllers/Auth.Controllers.js";

/* ================================
   MIDDLEWARES Y CONSTANTES
   ================================ */
import { requireRole } from "../Middleware/Roles.Middleware.js";
import { ROLES } from "../Constants/Roles.js";
import { verifyToken } from "../Middleware/Token.Middleware.js";

import {createReview, getProviderReviews} from "../Controllers/Review.Controllers.js"

const router = express.Router();

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


router.get("/provider/misreviews",verifyToken, requireRole(ROLES.PROVIDER), getProviderReviews);
router.get("/provider/stats",verifyToken,requireRole(ROLES.PROVIDER),getProviderStats);


/* ================================
   AUTH
   ================================ */

// POST /register
router.post("/register", register);

// POST /login
router.post("/login", login);

// POST /logout
router.post("/logout", verifyToken, logoutUser);

// GET /verify-email
router.get("/verify-email/:token", verifyEmail);


/* ================================
   PERFIL USUARIO
   ================================ */

// GET perfil del usuario (email, phone, location, nombre)
router.get("/profile", verifyToken, profile);

// PUT actualizar SOLO ubicación
router.put("/profile/update-location", verifyToken, updateLocation);


/* ================================
   CLIENTE
   ================================ */

// get ALL SERVICES PAGINA CLIENTE
router.get(
  "/services",
  verifyToken,
  requireRole(ROLES.CLIENT),
  getAllServices
);

// get service por ID
router.get(
  "/services/:id",
  verifyToken,
  requireRole(ROLES.CLIENT),
  getServiceById
);

// POST crear cita
router.post("/appointments", verifyToken, createAppointment);

// ver citas del cliente
router.get("/appointments/miscitas", verifyToken, getAppointments);


/* ================================
   PROVIDER
   ================================ */

// post crear servicio
router.post(
  "/provider/publish",
  verifyToken,
  requireRole(ROLES.PROVIDER),
  publishService
);

// get obtener citas segun provider_id
router.get(
  "/provider/miscitas",
  verifyToken,
  requireRole(ROLES.PROVIDER),
  ViewAllAppointments
);

// cambiar estado cita
router.put("/provider/status/:id", verifyToken, UpdateAppointmentStatus);

//ver citas aceptadas
router.get("/provider/accepted",verifyToken,requireRole(ROLES.PROVIDER),getAcceptedAppointmentsByProvider);
//completar citas 
router.put("/provider/complete",verifyToken,requireRole(ROLES.PROVIDER),completeAppointment);




/* ================================
   ADMIN
   ================================ */

router.get("/admin/users", verifyToken, adminGetAllUsers);
router.get("/admin/services", verifyToken, adminGetAllServices);
router.delete("/admin/delete-user/:id", verifyToken, adminDeleteUser);
router.delete("/admin/delete-service/:id", verifyToken, adminDeleteService);
router.post("/admin/create-user", verifyToken, adminCreateUser);


router.post("/reviews", verifyToken, createReview);
export default router;
