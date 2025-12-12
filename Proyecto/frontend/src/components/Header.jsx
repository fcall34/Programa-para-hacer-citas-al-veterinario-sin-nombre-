import React from "react";
import { useNavigate } from "react-router-dom"; // <--- 1. ¡IMPORTANTE!
import "./Header.css";
import LogoutButton from "./logout"; // Asegúrate que el nombre del archivo sea correcto (logout o LogoutButton)

export default function Header({ onViewAppointments }) {
  
  const navigate = useNavigate(); // <--- 2. ¡OBLIGATORIO! Sin esto, 'navigate' no existe

  return (
    <header className="header-container">
      {/* Al dar clic al título, nos lleva al inicio */}
      <h1 
        className="header-title" 
        onClick={() => navigate('/ClientHome')} 
        style={{cursor: 'pointer'}}
      >
        A Point Date
      </h1>

      <button 
        className="citas-btn"
        onClick={onViewAppointments}
      >
        Mis Citas
      </button>

      {/* Botón que lleva al perfil */}
      <button 
        className="profile-button"
        onClick={() => navigate("/profile")}
      >
        Mi Perfil
      </button>

      <LogoutButton/>
    </header>
  );
}