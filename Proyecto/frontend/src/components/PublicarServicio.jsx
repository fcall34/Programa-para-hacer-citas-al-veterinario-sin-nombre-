import { useState } from "react";

export default function PublishService() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    location: "",
    available: false,
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
      console.log("Token:", token);

      if (!token) {
        alert("No hay token, inicia sesión primero");
        return;
      }

      console.log(formData);
  
      const res = await fetch("http://localhost:3000/api/provider/publish", {
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
      } else {
        alert("Error: " + (data.error || data.message));
      }

    } catch (error) {
      console.error(error);
      alert("Error al publicar el servicio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Publicar Servicio</h2>

      <label>Título del servicio</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label>Descripción</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <label>Costo</label>
      <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />

      <label>Ubicación</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required />

      <label>Disponible</label>
      <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />

      <label>Categoría</label>
      <select name="category_id" value={formData.category_id} onChange={handleChange} required>
        <option value="">Selecciona una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label>Fecha de expiración</label>
      <input type="date" name="expiration_date" value={formData.expiration_date} onChange={handleChange} required />

      <label>Hora de inicio</label>
      <input
        type="time"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        required
      />

      <label>Hora de cierre</label>
      <input
        type="time"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        required
      />


      <button type="submit">Publicar servicio</button>
    </form>
  );
}
