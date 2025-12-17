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
          setServices(res.data);
        }
      });
  }, []);

  const handleSelect = (id) => {
    fetch(`${API_URL}/api/services/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setSelected(res.data);
        }
      });
  };

  return (
    <div className="flex p-4">
      {/* LISTA DE SERVICIOS */}
      <div className="w-1/3">
        <h2 className="font-bold mb-2">Servicios</h2>

        {services.map(service => (
          <ServiceCard
            key={service.service_id}
            title={service.title}
            price={service.cost}
            category={service.category_description}
            start_time={service.start_time}
            end_time={service.end_time}
            rating={Number(service.avg_rating) || 0}     // ⭐⭐⭐⭐⭐
            reviewCount={service.review_count || 0}
            distance={2.5}
            onClick={() => handleSelect(service.service_id)}
          />
        ))}
      </div>

      {/* DETALLE DEL SERVICIO */}
      <div className="w-2/3 p-4 border-l">
        <ServiceDetailCard
          service={selected}
          onOpenSchedule={() => console.log("Abrir agenda")}
        />
      </div>
    </div>
  );
}
