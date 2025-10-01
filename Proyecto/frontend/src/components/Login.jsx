import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:3000/api/login', form);

    if (res.data.success) {
      alert('Login exitoso');
      
      // Guardar el usuario en localStorage (para usar después)
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirigir según tipo
      if (res.data.user.user_type === 1) {
        navigate('/services'); // Cliente
      } else if (res.data.user.user_type === 2) {
        navigate('/proveedor'); // Proveedor
      } else if (res.data.user.user_type === 3) {
        navigate('/admin'); // Admin
      } else {
        navigate('/');
      }
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Error al iniciar sesión');
  }
};

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
