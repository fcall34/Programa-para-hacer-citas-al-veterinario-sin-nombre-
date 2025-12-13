import React from "react";
import "./Stats.css";

export default function Stats() {
  // Datos de ejemplo (luego vendrán de tu BD)
  const stats = {
    earnings: 12500,
    totalAppointments: 45,
    rating: 4.8,
    views: 120
  };

  return (
    <div className="stats-container">
      <h2 className="stats-title">Resumen de tu negocio</h2>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Ganancias Totales</span>
          <span className="kpi-number">${stats.earnings}</span>
        </div>
        
        <div className="kpi-card">
          <span className="kpi-label">Citas Completadas</span>
          <span className="kpi-number">{stats.totalAppointments}</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Calificación</span>
          <span className="kpi-number">★ {stats.rating}</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Visitas al Perfil</span>
          <span className="kpi-number">{stats.views}</span>
        </div>
      </div>

      <div className="recent-activity-section">
        <h3>Actividad Reciente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-text">Juan Pérez agendó una cita</span>
            <span className="activity-date">Hace 2 horas</span>
          </div>
          <div className="activity-item">
            <span className="activity-text">María López dejó una reseña</span>
            <span className="activity-date">Ayer</span>
          </div>
          <div className="activity-item">
            <span className="activity-text">Tu servicio "Corte" fue publicado</span>
            <span className="activity-date">Hace 3 días</span>
          </div>
        </div>
      </div>
    </div>
  );
}