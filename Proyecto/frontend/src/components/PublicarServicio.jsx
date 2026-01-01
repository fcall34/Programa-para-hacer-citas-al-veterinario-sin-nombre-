import React, { useState } from "react";
import './Styles/PublicarServicio.css';
const API_URL = import.meta.env.VITE_API_URL;

export default function PublicarServicio() {
  const [images, setImages] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    location: "",
    available: true, 
    category_ids: [],
    start_date: "",
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
      console.log("SUBMIT");

      const token = localStorage.getItem("token");
      if (!token) return alert("No hay token");

      const data = new FormData();

      // Campos normales
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      //categorias
      selectedCategories.forEach((catId) => {
        data.append("category_ids[]", catId);
      });

      // Imágenes
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      const res = await fetch(`${API_URL}/api/provider/publish`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        alert("Servicio publicado correctamente");
      } else {
        alert(result.error || result.message);
      }

    } catch (error) {
      console.error(error);
      alert("Error al publicar servicio");
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
              <label>Categorías</label>
              <div className="category-tags">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    className={
                      selectedCategories.includes(cat.id)
                        ? "category-tag active"
                        : "category-tag"
                    }
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id)
                          ? prev.filter((id) => id !== cat.id)
                          : [...prev, cat.id]
                      );
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
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
              <label>Fecha de Inicio</label>
              <input 
                className="form-input"
                type="date" 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

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

            <div className="form-group">
            <label>Imágenes del servicio</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
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