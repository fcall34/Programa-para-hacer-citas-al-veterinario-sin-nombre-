import React from "react";
import LogoutButton from "./logout";
import "./Styles/sidebar.css";

export default function Sidebar({ onSelect, selectedOption }) {

  const getButtonClass = (optionName) => {
    return `sidebar-btn ${selectedOption === optionName ? "active" : ""}`;
  };

  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">A Point Date</h2>

      <button
        className={getButtonClass("publicar")}
        onClick={() => onSelect("publicar")}
      >
        Publicar Servicio
      </button>

      <button
        className={getButtonClass("misservicios")}
        onClick={() => onSelect("misservicios")}
      >
        Mis Servicios
      </button>

      <button
        className={getButtonClass("citas")}
        onClick={() => onSelect("citas")}
      >
        Citas en espera
      </button>

      <button
        className={getButtonClass("Complete-citas")}
        onClick={() => onSelect("Complete-citas")}
      >
        Completar citas
      </button>

      <button
        className={getButtonClass("stats")}
        onClick={() => onSelect("stats")}
      >
        Estadísticas
      </button>

      <button
        className={getButtonClass("resenas")}
        onClick={() => onSelect("resenas")}
      >
        Reseñas
      </button>

      <button
        className={getButtonClass("Perfil")}
        onClick={() => onSelect("Perfil")}
      >
        Mi perfil
      </button>

      <div className="sidebar-footer">
        <LogoutButton />
      </div>
    </div>
  );
}
