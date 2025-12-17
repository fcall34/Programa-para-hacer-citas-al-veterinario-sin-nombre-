import React, { useState } from "react";
import './Styles/PublicarServicio.css';
const API_URL = import.meta.env.VITE_API_URL;

export default function PublicarServicio() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    location: "",
    available: true, 
    category_id: "",
    expiration_date: "",
    start_time: "",
    end_time: ""
  });

  const categories = [
    { id: 1, name: "Belleza" },
    { id: 2, name: "Salud" },
    { id: 3, name: "Entretenimiento" },
    { id: 4, name: "Servicios del hogar" },
    { id: 5, name: "Tecnología" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No hay token, inicia sesión primero");
        return;
      }

      const res = await fetch(`${API_URL}/api/provider/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Servicio publicado correctamente");
        // Opcional: Limpiar el formulario después de éxito
        setFormData({ ...formData, title: "", description: "", cost: "" }); 
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error(error);
      alert("Error al publicar el servicio");
    }
  };

  return (
    <div className="publish-wrapper">
      <div className="publish-card">
        <h2>Publicar Nuevo Servicio</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Título del servicio</label>
            <input 
              className="form-input"
              type="text" 
              name="title" 
              placeholder="Ej. Corte de cabello a domicilio"
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              className="form-textarea"
              name="description" 
              placeholder="Describe detalladamente qué incluye tu servicio..."
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Costo ($ MXN)</label>
              <input 
                className="form-input"
                type="number" 
                name="cost" 
                placeholder="0.00"
                value={formData.cost} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Categoría</label>
              <select 
                className="form-select"
                name="category_id" 
                value={formData.category_id} 
                onChange={handleChange} 
                required
              >
                <option value="">Selecciona una opción</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Ubicación</label>
            <input 
              className="form-input"
              type="text" 
              name="location" 
              placeholder="Ej. Ciudad de México, Colonia Roma..."
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Fila para fechas y horas */}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha límite (Expiración)</label>
              <input 
                className="form-input"
                type="date" 
                name="expiration_date" 
                value={formData.expiration_date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora de inicio</label>
              <input
                className="form-input"
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora de cierre</label>
              <input
                className="form-input"
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              name="available" 
              id="availableCheck"
              checked={formData.available} 
              onChange={handleChange} 
            />
            <label htmlFor="availableCheck">Marcar servicio como disponible inmediatamente</label>
          </div>

          <button type="submit" className="publish-btn">
            Publicar servicio
          </button>
          
        </form>
      </div>
    </div>
  );
}