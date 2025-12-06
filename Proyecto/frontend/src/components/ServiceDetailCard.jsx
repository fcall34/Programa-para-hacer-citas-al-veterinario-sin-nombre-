import React from "react";
import "./ServiceDetailCrd.css";

export default function ServiceDetailCard({ service }) {
  return (
    <div className="detail-card">
      <div className="detail-left">
        <h2>{service.title}</h2>
        <div className="detail-stars">⭐⭐⭐⭐⭐</div>
        <p className="detail-location">{service.location}</p>

        <p className="description">{service.description}</p>

        <a className="reviews-link" href="#">
          {service.review_count} reseñas
        </a>
      </div>

      <div className="detail-right">
        <div className="big-calendar">📅</div>
        <button className="detail-btn">Agendar cita</button>
      </div>
    </div>
  );
}
