import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import ServiceDetailCard from "./ServiceDetailCard";
const API_URL = import.meta.env.VITE_API_URL;

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
  fetch(`${API_URL}/api/services`)
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        const parsed = res.data.map(service => ({
          ...service,
          categories: service.categories
            ? JSON.parse(service.categories)
            : [],
          images: service.images
            ? JSON.parse(service.images)
            : []
        }));

        setServices(parsed);
      }
    });
}, []);



  const handleSelect = (id) => {
  fetch(`${API_URL}/api/services/${id}`)
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        const parsedService = {
          ...res.data,
          categories: res.data.categories
            ? JSON.parse(res.data.categories)
            : [],
          images: res.data.images
            ? JSON.parse(res.data.images)
            : []
        };

        setSelected(parsedService);
      }
    });
};

return (
  <div className="services-page">

    {/* COLUMNA IZQUIERDA – LISTA */}
    <div className="services-list">
      <h2 className="font-bold mb-2">Servicios</h2>

      {services.map(service => (
        <ServiceCard
          key={service.service_id}
          title={service.title}
          price={service.cost}
          categories={service.categories}
          image={service.images?.[0]?.image_url}
          start_time={service.start_time}
          end_time={service.end_time}
          rating={Number(service.avg_rating) || 0}
          reviewCount={service.review_count || 0}
          distance={2.5}
          onClick={() => handleSelect(service.service_id)}
        />
      ))}
    </div>

    {/* COLUMNA DERECHA – DETALLE */}
    <div className="service-detail">
      {selected ? (
        <ServiceDetailCard service={selected} />
      ) : (
        <p className="placeholder">
          Selecciona un servicio para ver los detalles
        </p>
      )}
    </div>

  </div>
);



  
}
