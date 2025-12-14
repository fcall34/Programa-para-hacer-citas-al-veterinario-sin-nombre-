import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    user_type: 1
  });

  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Asegúrate de que la URL coincida con el puerto de tu backend (ej. 3000)
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.message || 'Error al registrar');
      }

    } catch (err) {
      console.error(err);
      alert('Error al registrar. Revisa la conexión con el servidor.');
    }
  };

  return (
    // Contenedor principal (Fondo gris)
    <div className="register-wrapper">
      
      {/* Tarjeta blanca centrada */}
      <div className="register-card">
        <h2>Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            className="register-input" // <-- Clase añadida
            name="full_name" 
            placeholder="Nombre completo" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="register-input" // <-- Clase añadida
            name="email" 
            type="email"
            placeholder="Correo electrónico" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="register-input" // <-- Clase añadida
            name="phone" 
            placeholder="Teléfono" 
            onChange={handleChange} 
          />
          <input 
            className="register-input" // <-- Clase añadida
            name="location" 
            placeholder="Ubicación (Ciudad)" 
            onChange={handleChange} 
          />
          <input 
            className="register-input" // <-- Clase añadida
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            onChange={handleChange} 
            required 
          />

          {/* El select también usa la misma clase de input */}
          <select 
            className="register-input" // <-- Clase añadida
            name="user_type" 
            onChange={handleChange} 
            value={form.user_type}
            style={{cursor: 'pointer'}}
          >
            <option value={1}>Soy Cliente (Busco servicios)</option>
            <option value={2}>Soy Proveedor (Ofrezco servicios)</option>
          </select>

          <button type="submit" className="register-btn">Registrarse</button>
        </form>

        <p className="register-footer">
          ¿Ya tienes una cuenta? 
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}