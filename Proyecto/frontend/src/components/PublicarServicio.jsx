import { useState } from "react";

export default function PublishService() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    location: "",
    available: false,
    category_id: "",
    expiration_date: ""
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

      // ❗❗ FALTA: AWAIT al fetch
      const res = await fetch("http://localhost:3000/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // ❗❗ FALTA: enviar token
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData)
      });

      // ❗❗ AQUÍ rompia: res no era un Response
      const data = await res.json();

      console.log("Respuesta:", data);

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

      <button type="submit">Publicar servicio</button>
    </form>
  );
}
