import React from "react";
import LogoutButton from "./logout";

export default function Sidebar({ onSelect }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Admin Panel</h2>

      <button style={styles.btn} onClick={() => onSelect("users")}>
        Ver Usuarios
      </button>

      <button style={styles.btn} onClick={() => onSelect("services")}>
        Ver Servicios
      </button>

      <button style={styles.btn} onClick={() => onSelect("addAdmin")}>
        Crear Admin
      </button>

      <LogoutButton/>
      
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    padding: "20px",
    backgroundColor: "#ece5dd",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px"
  },
  btn: {
    backgroundColor: "#b9a89c",
    border: "none",
    padding: "15px",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer"
  },
  logout: {
    marginTop: "20px",
    color: "#0077cc",
    textDecoration: "none"
  }
};
