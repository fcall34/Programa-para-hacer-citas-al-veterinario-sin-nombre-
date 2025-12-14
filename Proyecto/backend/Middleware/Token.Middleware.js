import jwt from "jsonwebtoken";
import { poolPromise, sql } from "../database.js";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Token faltante en headers");
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, decoded.id)
      .query(`
        SELECT SessionToken
        FROM Users
        WHERE user_id = @id
      `);

    const dbToken = result.recordset[0]?.SessionToken;

    if (dbToken !== token) {
      return res.status(403).json({ error: "Sesión inválida" });
    }

    req.user = decoded;
    next();
  });
}
