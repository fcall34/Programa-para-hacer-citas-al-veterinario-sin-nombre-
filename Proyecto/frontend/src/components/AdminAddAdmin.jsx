import  React, { useEffect, useState } from "react";

export default function AdminAddAdmin() {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const createAdmin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ full_name, email, password, phone }),
    });

    const data = await res.json();
    setMsg(data.message);
    if (data.success) {
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
    }
  };

  return (
    <div className="admin-card">
  <h2 className="admin-title">Crear Administrador</h2>

  <form onSubmit={createAdmin} className="form">
    <input
      type="text"
      placeholder="Nombre completo"
      className="admin-input"
      value={full_name}
      onChange={(e) => setFullName(e.target.value)}
    />

    <input
      type="email"
      placeholder="Correo"
      className="admin-input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="text"
      placeholder="Teléfono"
      className="admin-input"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

    <input
      type="password"
      placeholder="Contraseña"
      className="admin-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button className="btn-primary">Crear Admin</button>
  </form>

  {msg && <p className="msg">{msg}</p>}
</div>

  );
}
