import {sql, poolPromise} from "../database.js"


export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const pool = await poolPromise;

    await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("UPDATE dbo.Users SET SessionToken = NULL WHERE User_id = @userId;");

    return res.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      message: "Error al cerrar sesión",
    });
  }
};
