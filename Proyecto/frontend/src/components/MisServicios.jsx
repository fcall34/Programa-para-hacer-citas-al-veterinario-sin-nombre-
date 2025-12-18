import React, { useEffect, useState } from "react";
import "./Styles/MisServicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MisServicios() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/provider/misservicios`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setServices(data.data);
        } else {
          alert("No se pudieron cargar los servicios");
        }
      } catch (error) {
        console.error("Error cargando servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, []);

  if (loading) {
    return <div className="loading-screen">Cargando servicios...</div>;
  }

  return (
    <div className="mis-servicios-container">
      <h2 className="mis-servicios-title">Mis Servicios Publicados</h2>

      {services.length === 0 ? (
        <p className="no-services">Aún no has publicado servicios</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.service_id} className="service-card">
              <h3>{service.title}</h3>

              <p className="service-desc">{service.description}</p>

              <div className="service-info">
                <span><strong>Costo:</strong> ${service.cost}</span>
                <span><strong>Ubicación:</strong> {service.location}</span>
                <span>
                  <strong>Horario:</strong> {service.start_time} - {service.end_time}
                </span>
                <span>
                  <strong>Estado:</strong>{" "}
                  {service.available ? "Disponible" : "No disponible"}
                </span>
              </div>

              <div className="service-footer">
                <span className="service-date">
                  Expira: {service.expiration_date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
