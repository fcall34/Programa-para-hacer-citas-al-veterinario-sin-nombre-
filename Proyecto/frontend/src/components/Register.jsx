import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      alert('Error al registrar');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Nombre completo" onChange={handleChange} required />
        <input name="email" placeholder="Correo electrónico" onChange={handleChange} required />
        <input name="phone" placeholder="Teléfono" onChange={handleChange} />
        <input name="location" placeholder="Ubicación" onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />

        <select name="user_type" onChange={handleChange} value={form.user_type}>
          <option value={1}>Cliente</option>
          <option value={2}>Proveedor</option>
        </select>

        <button type="submit">Registrarse</button>
      </form>

      <p style={{ marginTop: '20px' }}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}
