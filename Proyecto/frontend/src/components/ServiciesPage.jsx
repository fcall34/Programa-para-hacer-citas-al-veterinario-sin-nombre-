import { useState, useEffect } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/services")
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  const handleSelect = (id) => {
    fetch(`http://localhost:4000/api/services/${id}`)
      .then(res => res.json())
      .then(data => setSelected(data));
  };

  return (
    <div className="flex p-4">
      {/* Filtros y lista */}
      <div className="w-1/3">
        <h2 className="font-bold">Servicios</h2>
        {services.map(s => (
          <div 
            key={s.service_id} 
            onClick={() => handleSelect(s.service_id)}
            className={`p-2 border rounded mb-2 cursor-pointer ${selected?.service_id === s.service_id ? "bg-blue-100" : ""}`}
          >
            <h3>{s.title}</h3>
            <p>{s.category}</p>
            <p>${s.cost}</p>
          </div>
        ))}
      </div>

      {/* Panel de detalle */}
      <div className="w-2/3 p-4 border-l">
        {selected ? (
          <div>
            <h2 className="text-xl font-bold">{selected.title}</h2>
            <p>{selected.description}</p>
            <p><strong>Ubicación:</strong> {selected.location}</p>
            <p><strong>Costo:</strong> ${selected.cost}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Hacer cita</button>
          </div>
        ) : (
          <p>Selecciona un servicio para ver más detalles</p>
        )}
      </div>
    </div>
  );
}
