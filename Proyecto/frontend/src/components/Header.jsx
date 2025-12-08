import React from "react";
import "./Header.css";

export default function Header({ onViewAppointments }) {
  return (
    <header className="header-container">
      <h1 className="header-title">A Point Date</h1>

      <button 
        className="citas-btn"
        onClick={onViewAppointments}
      >
        Mis Citas
      </button>

      <button className="profile-button">
        Mi Perfil
      </button>
    </header>
  );
}
