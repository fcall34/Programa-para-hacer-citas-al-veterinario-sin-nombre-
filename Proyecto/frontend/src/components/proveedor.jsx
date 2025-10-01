import { useState } from "react";

export default function Proveedor() {
  const [active, setActive] = useState("publicar"); // vista por defecto

  const renderContent = () => {
    switch (active) {
      case "perfil":
        return <h2>Perfil del proveedor</h2>;
      case "publicar":
        return <h2>Publicar servicio</h2>;
      case "agenda":
        return <h2>Agenda</h2>;
      case "peticiones":
        return <h2>Peticiones de clientes</h2>;
      default:
        return <h2>Bienvenido</h2>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#e8f5e9", padding: "20px" }}>
        <h3>Proveedor</h3>
        <button style={btnStyle} onClick={() => setActive("perfil")}>
          Perfil
        </button>
        <button style={btnStyle} onClick={() => setActive("publicar")}>
          Publicar servicio
        </button>
        <button style={btnStyle} onClick={() => setActive("agenda")}>
          Agenda
        </button>
        <button style={btnStyle} onClick={() => setActive("peticiones")}>
          Peticiones
        </button>
      </div>

      {/* Panel principal */}
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <select>
            <option value="config">Configuración</option>
            <option value="logout">Cerrar sesión</option>
          </select>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

const btnStyle = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  border: "1px solid #2e7d32",
  background: "#fff",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left"
};
