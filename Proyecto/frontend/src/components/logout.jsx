import React from "react";
import { useNavigate } from "react-router-dom";
import './Styles/logout.css'

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }

    // Borrar del navegador (siempre)
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
