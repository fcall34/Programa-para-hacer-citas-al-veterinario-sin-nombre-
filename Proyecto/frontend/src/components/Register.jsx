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
    confirmPassword: '', // Corregido el nombre para consistencia
    user_type: 1
  });

  // Estado para los mensajes de error en tiempo real
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = (name, value) => {
    let errorMsg = '';

    

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) errorMsg = 'Correo electrónico no válido';
    }

    if (name === 'phone') {
      if (value.length !== 10) errorMsg = 'El teléfono debe tener 10 dígitos';
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(value)) {
        errorMsg = 'Mínimo 8 caracteres, una mayúscula y una minúscula';
      }
    }

    if (name === 'password' || name === 'confirmPassword') {
      const passToCompare = name === 'password' ? form.confirmPassword : form.password;
      if (value !== passToCompare && passToCompare !== '') {
        errorMsg = 'Las contraseñas no coinciden';
      } else {
        // Si coinciden, limpiamos el error del campo opuesto también
        setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = e => {
    const { name, value } = e.target;

    // Lógica para el teléfono: No permitir letras mientras escribe
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, ''); // Elimina cualquier cosa que no sea número
      if (onlyNums.length <= 10) {
        setForm({ ...form, [name]: onlyNums });
        validate(name, onlyNums);
      }
      return; // Salimos temprano para no ejecutar el setForm de abajo
    }

    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validación final antes de enviar
    const hasErrors = Object.values(errors).some(msg => msg !== '');
    const isMatching = form.password === form.confirmPassword;

    if (hasErrors || !isMatching || form.phone.length !== 10) {
      alert("Por favor, corrige los errores en el formulario.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            full_name: form.full_name,
            email: form.email,
            phone: form.phone,
            location: form.location,
            password: form.password,
            user_type: form.user_type
        })
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
            className={`register-input ${errors.email ? 'input-error' : ''}`}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <input
            className={`register-input ${errors.phone ? 'input-error' : ''}`}
            name="phone"
            placeholder="Teléfono (10 dígitos)"
            value={form.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}

          <select
            className="register-input"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tu ciudad</option>
            {CIUDADES_MEXICO.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>

          <input
            className={`register-input ${errors.password ? 'input-error' : ''}`}
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error-text">{errors.password}</span>}

          <input
            className={`register-input ${errors.confirmPassword ? 'input-error' : ''}`}
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

          <select
            className="register-input"
            name="user_type"
            onChange={handleChange}
            value={form.user_type}
          >
            <option value={1}>Soy Cliente (Busco servicios)</option>
            <option value={2}>Soy Proveedor (Ofrezco servicios)</option>
          </select>

          <button type="submit" className="register-btn"> Registrarse </button>
        </form>

        <p className="register-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}