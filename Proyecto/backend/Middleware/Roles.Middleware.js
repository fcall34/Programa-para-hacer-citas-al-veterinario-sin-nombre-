export const requireRole = (role) => {
  return (req, res, next) => {
    if (Number(req.user.user_type) !== Number(role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};


