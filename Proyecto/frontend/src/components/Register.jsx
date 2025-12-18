import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/Register.css';

const API_URL = import.meta.env.VITE_API_URL;

const CIUDADES_MEXICO = [
  "Aguascalientes", "Cancún", "Celaya", "Chihuahua", "Ciudad de México",
  "Ciudad Juárez", "Cuernavaca", "Guadalajara", "Hermosillo", "León",
  "Mérida", "Monterrey", "Morelia", "Pachuca", "Puebla", "Querétaro",
  "Saltillo", "San Luis Potosí", "Tijuana", "Toluca", "Torreón",
  "Tuxtla Gutiérrez", "Veracruz", "Villahermosa", "Xalapa", "Zacatecas"
];

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


  /* 📱 Validar teléfono */
  const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    /* 🔴 Validaciones */
    if (!isValidPhone(form.phone)) {
      alert("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }



    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Crear Cuenta</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="register-input"
            name="full_name"
            placeholder="Nombre completo"
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            name="phone"
            placeholder="Teléfono (10 dígitos)"
            onChange={handleChange}
            required
          />

          <select
            className="register-input"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tu ciudad</option>
            {CIUDADES_MEXICO.map(ciudad => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>

          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          <select
            className="register-input"
            name="user_type"
            onChange={handleChange}
            value={form.user_type}
            style={{ cursor: 'pointer' }}
          >
            <option value={1}>Soy Cliente (Busco servicios)</option>
            <option value={2}>Soy Proveedor (Ofrezco servicios)</option>
          </select>

          <button type="submit" className="register-btn">
            Registrarse
          </button>
        </form>

        <p className="register-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
