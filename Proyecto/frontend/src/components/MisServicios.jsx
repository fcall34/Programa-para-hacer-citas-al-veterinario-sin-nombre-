import React, { useEffect, useState } from "react";
import "./Styles/MisServicios.css";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIES = [
  { id: 1, label: "Belleza" },
  { id: 2, label: "Salud" },
  { id: 3, label: "Entretenimiento" },
  { id: 4, label: "Servicios del hogar" },
  { id: 5, label: "Tecnología" }
];

function formatTime(timeValue) {
  if (!timeValue) return "";

  // Si viene como Date ISO (1970-01-01T01:22:00.000Z)
  const date = new Date(timeValue);

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function MisServicios() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [categories, setCategories] = useState([]);


  const token = localStorage.getItem("token");

  const fetchMyServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/provider/misservicios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;

  try {
    const res = await fetch(`${API_URL}/api/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message); 
      return;
    }

    fetchMyServices(); 

  } catch (error) {
    alert("Error al conectar con el servidor");
  }
};


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_URL}/api/services/${editingService.service_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editingService)
        }
      );

      const data = await res.json();

      if (data.success) {
        setEditingService(null);
        fetchMyServices();
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loading-screen">Cargando...</div>;

  if (editingService) {
    return (
      <div className="publish-wrapper">
        <div className="publish-card">
          <h2>Editar Servicio</h2>

          <form onSubmit={handleUpdate}>

            {/* TÍTULO */}
            <div className="form-group">
                <label>Título</label>
                <input
                className="form-input"
                value={editingService.title}
                onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                }
                required
                />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="form-group">
                <label>Descripción</label>
                <textarea
                className="form-textarea"
                value={editingService.description}
                onChange={(e) =>
                    setEditingService({
                    ...editingService,
                    description: e.target.value
                    })
                }
                required
                />
            </div>

            {/* COSTO */}
            <div className="form-group">
                <label>Costo</label>
                <input
                type="number"
                className="form-input"
                value={editingService.cost}
                onChange={(e) =>
                    setEditingService({ ...editingService, cost: e.target.value })
                }
                required
                />
            </div>

                    {/* CATEGORÍA */}
                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                        className="form-select"
                        value={editingService.category_id}
                        onChange={(e) =>
                            setEditingService({
                            ...editingService,
                            category_id: Number(e.target.value)
                            })
                        }
                        required
                        >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                            {c.label}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* DISPONIBLE */}
                    <div className="checkbox-group">
                        <input
                        type="checkbox"
                        checked={editingService.available}
                        onChange={(e) =>
                            setEditingService({
                            ...editingService,
                            available: e.target.checked
                            })
                        }
                        />
                        <label>Servicio disponible</label>
                    </div>

                    {/* HORARIOS */}
                    <div className="form-row">
                        <div className="form-group">
                        <label>Hora de inicio</label>
                        <input
                            className="form-input"
                            type="time"
                            value={editingService.start_time}
                            onChange={(e) =>
                            setEditingService({
                                ...editingService,
                                start_time: e.target.value
                            })
                            }
                            required
                        />
                        </div>

                        <div className="form-group">
                        <label>Hora de fin</label>
                        <input
                            className="form-input"
                            type="time"
                            value={editingService.end_time}
                            onChange={(e) =>
                            setEditingService({
                                ...editingService,
                                end_time: e.target.value
                            })
                            }
                            required
                        />
                        </div>
                    </div>

                    <button className="publish-btn">Guardar Cambios</button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setEditingService(null)}
                    >
                        Cancelar
                    </button>
                    </form>

        </div>
      </div>
    );
  }

  return (
    <div className="mis-servicios-container">
      <h2 className="mis-servicios-title">Mis Servicios</h2>

      {services.length === 0 ? (
        <p className="no-services">No tienes servicios publicados</p>
      ) : (
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.service_id} className="service-card">
              <h3>{s.title}</h3>
              <p className="service-desc">{s.description}</p>

              <div className="service-info">
                <span><strong>Costo:</strong> ${s.cost}</span>
                <span><strong>Horario:</strong> {s.start_time} - {s.end_time}</span>
                <span>
                  <strong>Estado:</strong>{" "}
                  {s.available ? "Disponible" : "No disponible"}
                </span>
              </div>

              <div className="service-actions">
                <button
                    className="edit-btn"
                    onClick={() =>
                        setEditingService({
                        ...s,
                        start_time: formatTime(s.start_time),
                        end_time: formatTime(s.end_time),
                        available: Boolean(s.available)
                        })
                    }
                    >
                    ✏️ Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(s.service_id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
