import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';


export default function Landing() {
  return (
    <div>
      <header>
        <h1>Mi Proyecto de Servicios</h1>
        <Link to="/register">Registrarse</Link>
      </header>
      <main>
        <h2>Quiénes somos</h2>
        <p>Queremos conectar clientes con proveedores de servicios de manera rápida y confiable.</p>
      </main>
    </div>
  );
}
