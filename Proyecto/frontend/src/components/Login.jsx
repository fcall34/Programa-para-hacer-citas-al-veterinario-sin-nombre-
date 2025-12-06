import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  useEffect(() => {
    // Limpiar usuario previo para evitar redirecciones automáticas
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
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
      mode: "cors"
    });

    const data = await res.json();
    console.log("DATA:", data);

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login exitoso");
      const type = data.user.user_type;

      if (type === 1) navigate("/ClientHome");
      else if (type === 2) navigate("/ProveedorDashBoard");
      else if (type === 3) navigate("/admin");
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
