import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate, Link } from 'react-router-dom'; // <--- 1. AQUÍ AGREGUÉ 'Link'
import './Styles/Login.css'

export default function Login() {

  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        mode: "cors"
      });

      const data = await res.json();
      console.log("DATA:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        const type = data.user.user_type;
        if (type === 1) navigate("/ClientHome");
        else if (type === 2) navigate("/ProveedorDashBoard");
        else if (type === 3) navigate("/AdminDashboard");
        else navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("ERROR en login:", err);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <form onSubmit={handleSubmit}>
          <h2>¡Hola de nuevo!</h2>
          <p style={{marginBottom: '25px', color: '#666'}}>Ingresa tus datos para continuar</p>

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="login-btn" type="submit">
            Entrar
          </button>
        </form>

        {/* 2. AQUÍ ESTÁ EL CAMBIO IMPORTANTE: */}
        <div className="login-footer">
          ¿No tienes cuenta? 
          <Link 
            to="/register" 
            style={{
              color: '#0066ff', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              marginLeft: '5px'
            }}
          >
            Regístrate aquí
          </Link>
        </div>

      </div>
    </div>
  );
}