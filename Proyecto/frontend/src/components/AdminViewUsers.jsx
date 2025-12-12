import React, { useEffect, useState } from "react";

export default function AdminViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) setUsers(data.data);

    } catch (err) {
      console.error("Error fetchUsers:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/api/admin/delete-user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
  <div className="admin-card">
  <h2 className="admin-title">Usuarios</h2>

  <table className="admin-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Tipo</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      {users.map((u) => (
        <tr key={u.id}>
          <td>{u.id}</td>
          <td>{u.full_name}</td>
          <td>{u.email}</td>
          <td>{u.tipo_usuario}</td>
          <td>
            <button className="btn-danger" onClick={() => deleteUser(u.id)}>
              Borrar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

);

}
