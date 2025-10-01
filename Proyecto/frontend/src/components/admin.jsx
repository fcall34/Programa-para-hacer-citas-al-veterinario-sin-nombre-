import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  // Cargar usuarios al montar
  useEffect(() => {
    axios.get("http://localhost:3000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel de Administración</h2>
      
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Ubicación</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td style={tdStyle}>{user.user_id}</td>
              <td style={tdStyle}>{user.full_name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.phone}</td>
              <td style={tdStyle}>{user.location}</td>
              <td style={tdStyle}>
                {user.user_type === 1 ? "Cliente" : user.user_type === 2 ? "Proveedor" : "Admin"}
              </td>
              <td style={tdStyle}>
                <button style={btnEdit}>Editar</button>
                <button style={btnDelete}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 🔹 Estilos inline para simplicidad
const thStyle = { border: "1px solid #ddd", padding: "8px", textAlign: "left" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };

const btnEdit = {
  marginRight: "5px",
  padding: "5px 10px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const btnDelete = {
  padding: "5px 10px",
  background: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
