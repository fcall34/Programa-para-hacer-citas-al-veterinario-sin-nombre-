import React from "react";
import LogoutButton from "./logout";
import './Styles/sidebar.css';

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
        className={getButtonClass("citas")} 
        onClick={() => onSelect("citas")}
      >
        Citas en espera
      </button>

      {/* AQUÍ CAMBIAMOS CANCELACIONES POR STATS */}
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

      <div className="sidebar-footer">
        <LogoutButton />
      </div>
    </div>
  );
}