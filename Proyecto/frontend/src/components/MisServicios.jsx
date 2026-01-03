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

  const date = new Date(timeValue);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function MisServicios() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);


  const token = localStorage.getItem("token");

  const fetchMyServices = async () => {
    try {
      
      const res = await fetch(`${API_URL}/api/provider/misservicios`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        const parsed = data.data.map(s => ({
          ...s,
          categories: s.categories ? JSON.parse(s.categories) : [],
          images: s.images ? JSON.parse(s.images) : []
        }));

        setServices(parsed);
      }
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

  const formData = new FormData();

  formData.append("title", editingService.title);
  formData.append("description", editingService.description);
  formData.append("cost", editingService.cost);
  formData.append("start_date", editingService.start_date);
  formData.append("start_time", editingService.start_time);
  formData.append("end_time", editingService.end_time);
  formData.append("available", editingService.available);

  // categorías
  editingService.categories.forEach((c) =>
    formData.append("categories[]", c.category_description)
  );

  // imágenes nuevas
  newImages.forEach((img) => {
    formData.append("images", img);
  });

  // imágenes eliminadas
  deletedImages.forEach((img) => {
    formData.append("deletedImages[]", img);
  });

  try {
    const res = await fetch(
      `${API_URL}/api/services/${editingService.service_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!res.ok) {
      alert(data.message || "Error al actualizar");
      return;
    }

    alert("✅ Servicio actualizado correctamente");
          setEditingService(null);
      setNewImages([]);
      setDeletedImages([]);
      fetchMyServices();
  } catch (err) {
    console.error(err);
  }
};

  /* ===========================
     VISTA DE EDICIÓN
     =========================== */


  if (loading){
    return <p className="loading">Cargando servicios...</p>;
  }
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

            {/* FECHA INICIO */}
            <div className="form-group">
              <label>Fecha de inicio</label>
              <input
                type="date"
                className="form-input"
                value={editingService.start_date || ""}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    start_date: e.target.value
                  })
                }
                required
              />
            </div>

            {/* CATEGORÍAS */}
            <div className="form-group">
              <label>Categorías</label>
              <select
                className="form-select"
                multiple
                value={editingService.categories.map(
                  (c) => c.category_description
                )}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions
                  ).map((opt) => ({
                    category_description: opt.value
                  }));

                  setEditingService({
                    ...editingService,
                    categories: selected
                  });
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.label}>
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
                  type="time"
                  className="form-input"
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
                  type="time"
                  className="form-input"
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

            {/* IMÁGENES */}
            {/* IMÁGENES ACTUALES */}
            <div className="form-group">
              <label>Imágenes actuales</label>

              <div className="image-preview-row">
                {editingService.images.map((img, i) => (
                  <div key={i} className="image-wrapper">
                    <img
                      src={`${API_URL}${img.image_url}`}
                      alt="service"
                      className="preview-img"
                    />

                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => {
                        setDeletedImages([...deletedImages, img.image_url]);
                        setEditingService({
                          ...editingService,
                          images: editingService.images.filter((_, idx) => idx !== i)
                        });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AGREGAR NUEVAS IMÁGENES */}
          <div className="form-group">
            <label>Agregar nuevas imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages([...e.target.files])}
            />
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

/*
     LISTADO DE SERVICIOS
*/
  return (
    <div className="mis-servicios-container">
      <h2 className="mis-servicios-title">Mis Servicios</h2>

      {services.length === 0 ? (
        <p className="no-services">No tienes servicios publicados</p>
      ) : (
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.service_id} className="service-card">

              {s.images.length > 0 && (
                <img
                  src={`${API_URL}${s.images[0].image_url}`}
                  alt={s.title}
                  className="service-thumb"
                />
              )}

              <h3>{s.title}</h3>

              <p className="service-desc">{s.description}</p>

              <div className="service-categories">
                {s.categories.map((c, i) => (
                  <span key={i} className="category-tag">
                    {c.category_description}
                  </span>
                ))}
              </div>

              <div className="service-info">
                <span><strong>Costo:</strong> ${s.cost}</span>

                <span>
                  <strong>Horario:</strong>{" "}
                  {formatTime(s.start_time)} - {formatTime(s.end_time)}
                </span>

                <span>
                  <strong>Inicio:</strong>{" "}
                  {s.start_date
                    ? new Date(s.start_date).toLocaleDateString()
                    : "No definido"}
                </span>

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
                      start_date: s.start_date
                        ? s.start_date.split("T")[0]
                        : "",
                      categories: s.categories || [],
                      images: s.images || [],
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
                  🗑️Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
