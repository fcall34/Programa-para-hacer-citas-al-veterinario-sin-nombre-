import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // <--- No olvides importar el CSS

// Si quieres usar iconos reales, tendrías que instalar 'react-icons'
// Por ahora usaré texto simulando iconos para que no te de error.

export default function Landing() {
  return (
    <div className="landing-wrapper">
      
      {/* Barra superior transparente */}
      <header className="landing-header">
        <div className="logo-text">APOINTDATE</div>
        <nav className="nav-links">
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
          <Link to="/register" className="nav-link" style={{fontWeight: 'bold'}}>Registrarse</Link>
        </nav>
      </header>

      {/* Contenido Central */}
      <main className="hero-section">
        
        {/* Título Grande y Elegante */}
        <h1 className="hero-title">A point date!</h1>
        
        {/* Subtítulo explicativo */}
        <p className="hero-subtitle">
          Tu cita a un punto de distancia. Conectamos clientes con proveedores 
          de manera rápida, confiable y segura.
        </p>

        {/* Botón de Acción (Píldora) */}
        <Link to="/register" className="cta-button">
          Empezar a Agendar
        </Link>

      </main>

      {/* Pie de página con "iconos" */}
      <footer className="landing-footer">
        {/* Estos son caracteres unicode para simular los iconos de la foto */}
        <span style={{cursor:'pointer'}}>📷</span> 
        <span style={{cursor:'pointer'}}>📘</span> 
        <span style={{cursor:'pointer'}}>🐦</span>
      </footer>

    </div>
  );
}