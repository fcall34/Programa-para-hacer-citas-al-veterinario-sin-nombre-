import React, { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import CitasEnEspera from "../components/CitasEnEspera.jsx";
import Cancelaciones from "../components/Cancelaciones.jsx";
import Resenas from "../components/Resenas.jsx";
import PublishService from "../components/PublicarServicio.jsx";

export default function ProveedorDashBoard() {
  const [selected, setSelected] = useState("citas");

  const renderContent = () => {
    switch (selected) {
      case "publicar":
        return <PublishService />;
      case "citas":
        return <CitasEnEspera />;
      case "cancelaciones":
        return <Cancelaciones />;
      case "resenas":
        return <Resenas />;
      default:
        return <CitasEnEspera />;
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar onSelect={setSelected} />
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    backgroundColor: "#f7f3ee",
    height: "100vh"
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "20px"
  }
};
