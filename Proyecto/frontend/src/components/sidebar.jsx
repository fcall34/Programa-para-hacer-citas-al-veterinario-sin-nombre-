import React from "react";

export default function Sidebar({ onSelect }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>A point date!</h2>
      <button style={styles.btn} onClick={() => onSelect("publicar")}>
        Publicar Servicio
      </button>

      <button style={styles.btn} onClick={() => onSelect("citas")}>
        Citas en espera
      </button>

      <button style={styles.btn} onClick={() => onSelect("cancelaciones")}>
        Cancelaciones
      </button>

      <button style={styles.btn} onClick={() => onSelect("resenas")}>
        Reseñas
      </button>

      <a href="/login" style={styles.logout}>Cerrar sesión</a>
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
