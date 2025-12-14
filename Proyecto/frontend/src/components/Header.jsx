import React from "react";
import { useNavigate } from "react-router-dom"; 
import './Styles/Header.css';
import LogoutButton from "./logout"; 

export default function Header({ onViewAppointments }) {
  
  const navigate = useNavigate(); 

  return (
    <header className="header-container">
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