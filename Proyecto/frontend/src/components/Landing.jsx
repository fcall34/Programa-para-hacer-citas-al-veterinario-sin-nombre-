import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing-wrapper">
      
      {/* HEADER */}
      <header className="landing-header">
        <div className="logo-text">
          APOINTDATE
        </div>

        <nav className="nav-links">
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
          <Link to="/register" className="nav-link" style={{ fontWeight: "bold" }}>
            Registrarse
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <main className="hero-section">
        <h1 className="hero-title">APOINTDATE</h1>

        <p className="hero-subtitle">
          Ofrecemos una plataforma diseñada para conectar de manera eficiente 
          a clientes con proveedores de servicios, facilitando acuerdos claros, 
          seguros y confiables.
          <br /><br />
          Nuestra misión es mejorar y optimizar la relación entre clientes y 
          proveedores, ayudando a expandir el alcance de negocios de cualquier 
          índole, manteniendo siempre un alto estándar de seguridad y 
          confidencialidad para nuestros usuarios.
        </p>

        <Link to="/register" className="cta-button">
          Comenzar ahora
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div style={{ textAlign: "center", maxWidth: "800px" }}>
          
          <div style={{ marginBottom: "15px" }}>
            <span style={{ cursor: "pointer" }}>📷</span>{" "}
            <span style={{ cursor: "pointer" }}>📘</span>{" "}
            <span style={{ cursor: "pointer" }}>🐦</span>
          </div>

          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#777" }}>
            <strong>Política de Privacidad</strong><br />
            En APOINTDATE protegemos la información de nuestros usuarios. 
            Todos los datos proporcionados son tratados con estricta 
            confidencialidad y utilizados únicamente para mejorar la experiencia 
            dentro de la plataforma. No compartimos información personal con 
            terceros sin consentimiento previo.
          </p>

          <p style={{ fontSize: "12px", marginTop: "10px", color: "#999" }}>
            © {new Date().getFullYear()} APOINTDATE. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
