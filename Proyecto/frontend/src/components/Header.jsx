import React from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/Header.css";
import LogoutButton from "./logout";

export default function Header({ onViewAppointments, onHome }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/ClientHome");
    if (onHome) onHome();
  };

  return (
    <header className="header-container">

      {/* IZQUIERDA */}
      <h1 className="header-title" onClick={handleGoHome}>
        A Point Date
      </h1>

      {/* CENTRO */}
      <div className="header-center">
        <button
          className="nav-btn"
          onClick={onViewAppointments}
        >
          Mis Citas
        </button>

        <button
          className="nav-btn"
          onClick={() => navigate("/profile")}
        >
          Mi Perfil
        </button>
      </div>

      {/* DERECHA */}
      <div className="header-right">
      <LogoutButton />
      </div>


    </header>
  );
}
