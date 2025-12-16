import React from "react";
import "./Styles/ServiceDetailCrd.css";

function formatTime(timeValue) {
  if (!timeValue) return "";
  const match = timeValue.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

export default function ServiceDetailCard({ service, onOpenSchedule }) {
  if (!service) {
    return (
      <p className="no-service">
        Selecciona un servicio para ver los detalles
      </p>
    );
  }

  // ⭐ normalizamos el promedio
  const avgRating = Number(service.avg_rating);
  const ratingText = !isNaN(avgRating)
    ? avgRating.toFixed(1)
    : "0.0";

  const reviewCount = service.review_count ?? 0;

  return (
    <div className="detail-card">

      {/* HEADER */}
      <div className="detail-header">
        <h2 className="detail-title">{service.title}</h2>

        <div className="detail-actions">
          <button className="apply-btn" onClick={onOpenSchedule}>
            Agendar cita
          </button>
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
            <p>
              {formatTime(service.start_time)} -{" "}
              {formatTime(service.end_time)}
            </p>
          </div>
        </div>

        <div className="info-row">
          <span className="info-icon">📦</span>
          <div>
            <p className="info-label">Categoría</p>
            <div className="badge blue">
              {service.category_description ?? "Sin categoría"}
            </div>
          </div>
        </div>

        {/* ⭐ PROMEDIO DE ESTRELLAS */}
        <div className="info-row">
          <span className="info-icon">⭐</span>
          <div>
            <p className="info-label">Calificación</p>
            <p>
              <strong>{ratingText}</strong> / 5
              {" "}({reviewCount} reseñas)
            </p>
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
