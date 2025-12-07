import React from "react";
import "./ServiceDetailCrd.css";


function formatTime(timeValue) {
  if (!timeValue) return "";

  // Si viene como string ISO: "1970-01-01T09:17:00.000Z"
  const match = timeValue.match(/T(\d{2}):(\d{2})/);

  if (!match) return "";

  return `${match[1]}:${match[2]}`;
}




export default function ServiceDetailCard({ service, onOpenSchedule }) {
  if (!service) {
    return <p className="no-service">Selecciona un servicio para ver los detalles</p>;
  }

  return (
    <div className="detail-card">

      {/* HEADER */}
      <div className="detail-header">
        <div>
          <h2 className="detail-title">{service.title}</h2>
        </div>

        <div className="detail-actions">
          <button className="apply-btn" onClick={onOpenSchedule}>Agendar cita</button>
          <button className="icon-btn">❤️</button>
          <button className="icon-btn">🔗</button>
        </div>
      </div>

      {/* INFORMACIÓN */}
      <div className="detail-section">
        <h3>Información del servicio</h3>

        <div className="info-row">
          <span className="info-icon">💵</span>
          <div>
            <p className="info-label">Costo</p>
            <div className="badge green">${service.cost}</div>
          </div>
        </div>

        <div className="info-row">
          <span className="info-icon">⏰</span>
          <div>
            <p className="info-label">Horario</p>
            <p>{formatTime(service.start_time)} - {formatTime(service.end_time)}</p>
          </div>
        </div>

        <div className="info-row">
          <span className="info-icon">📦</span>
          <div>
            <p className="info-label">Categoría</p>
            <div className="badge blue">{service.category_description ?? "Sin categoría"}</div>
          </div>
        </div>

        <div className="info-row">
          <span className="info-icon">⭐</span>
          <div>
            <p className="info-label">Reseñas</p>
            <p>{service.review_count ?? 0} reseñas</p>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="detail-section">
        <h3>Descripción</h3>
        <p className="detail-description">{service.description}</p>
      </div>

      {/* UBICACIÓN */}
      <div className="detail-section">
        <h3>Ubicación</h3>
        <p>📍 {service.location}</p>
      </div>
    </div>
  );
}
