import React, { useState } from "react";
import Sidebar from "../components/sidebar.jsx"; // Asegúrate de la mayúscula si el archivo la tiene
import CitasEnEspera from "../components/CitasEnEspera.jsx";
import Stats from "../components/Stats.jsx"; // <--- Importar Stats
import Resenas from "../components/Resenas.jsx";
import PublishService from "../components/PublicarServicio.jsx";
import CompleteAppointment from "./CompleteAppointment.jsx";
import UserProfile from "./UserProfile.jsx";
import './Styles/ProveedorDashBoard.css';

export default function ProveedorDashBoard() {

  const [selected, setSelected] = useState("citas");

  const renderContent = () => {
    switch (selected) {
      case "publicar":
        return <PublishService />;
      case "citas":
        return <CitasEnEspera />;
      case "Complete-citas":
        return <CompleteAppointment/>;
      case "stats":
        return <Stats />;
      case "resenas":
        return <Resenas />;
      case "Perfil":
        return <UserProfile />;
      default:
        return <CitasEnEspera />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Pasamos 'selected' para que el sidebar sepa cuál pintar de azul 
         y 'setSelected' para cambiar la opción 
      */}
      <Sidebar onSelect={setSelected} selectedOption={selected} />
      
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}