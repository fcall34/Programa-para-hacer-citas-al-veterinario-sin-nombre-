import React, { useEffect, useState } from "react";

export default function AdminViewServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) setServices(data.data);

    } catch (err) {
      console.error("Error fetchServices:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/api/admin/delete-service/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setServices((prev) => prev.filter((s) => s.service_id !== id));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <p>Cargando servicios...</p>;

  return (
  <div className="admin-card">
  <h2 className="admin-title">Servicios</h2>

  <table className="admin-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Proveedor</th>
        <th>Título</th>
        <th>Costo</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      {services.map((s) => (
        <tr key={s.service_id}>
          <td>{s.service_id}</td>
          <td>{s.provider_name}</td>
          <td>{s.title}</td>
          <td>${s.cost}</td>
          <td>
            <button className="btn-danger" onClick={() => deleteService(s.service_id)}>
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
