import React from "react";
import LogoutButton from "./logout";
import './Styles/Admin.css'; // Asegúrate de importar el CSS

export default function Sidebar({ onSelect }) {
  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>

      <button className="sidebar-btn" onClick={() => onSelect("users")}>
        👥 Ver Usuarios
      </button>

      <button className="sidebar-btn" onClick={() => onSelect("services")}>
        🛠️ Ver Servicios
      </button>

      <button className="sidebar-btn" onClick={() => onSelect("addAdmin")}>
        ➕ Crear Admin
      </button>

      {/* El botón de logout usualmente trae su propio estilo, 
          pero lo envolvemos por si acaso */}
      <div style={{ marginTop: 'auto' }}>
        <LogoutButton/>
      </div>
      
    </div>
  );
}