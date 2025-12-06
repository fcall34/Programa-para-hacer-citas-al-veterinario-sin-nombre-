import React from "react";
import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Busca un servicio" 
        className="search-input"
      />

      <div className="search-divider">|</div>

      <input 
        type="text" 
        placeholder="Selecciona tu ubicación" 
        className="search-input"
      />

      <button className="search-btn">Buscar</button>
    </div>
  );
}
