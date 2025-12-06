// components/ServiceDetailCard.jsx
import React from "react";
import "./ServiceDetailCrd.css";

const ServiceDetailCard = ({ service }) => {
  if (!service) return null; // Nada seleccionado

  return (
    <div className="service-detail-card">
      <h2>{service.title}</h2>
      <div className="stars">★★★★★</div>

      <p>{service.location}</p>

      <p className="description">
        {service.description}
      </p>

      <a className="reviews" href="#">
        680 reseñas
      </a>

      <button className="btn">AGENDAR CITA</button>
    </div>
  );
};

export default ServiceDetailCard;
