export const requireRole = (role) => {
  return (req, res, next) => {
    console.log("ROLE REQUERIDO:", role);
    console.log("ROLE USUARIO:", req.user.user_type);
    if (Number(req.user.user_type) !== Number(role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};


