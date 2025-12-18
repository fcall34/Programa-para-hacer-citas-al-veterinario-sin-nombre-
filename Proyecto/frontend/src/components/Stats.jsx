import { useEffect, useState } from "react";
import "./Styles/Stats.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProviderStats() {
  const [stats, setStats] = useState(null);
  const [topByAppointments, setTopByAppointments] = useState([]);
  const [topByRating, setTopByRating] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/provider/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setTopByAppointments(data.topByAppointments || []);
          setTopByRating(data.topByRating || []);
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p className="loading-text">Cargando estadísticas...</p>;

  return (
    <div className="provider-stats-wrapper">

      {/* 🔵 HEADER */}
      <div className="stats-header">
        <h1 className="stats-name">{stats.full_name}</h1>
        <p className="stats-subtitle">CONOCE TUS ESTADÍSTICAS</p>
      </div>

      {/* 🔵 STATS GENERALES */}
      <div className="provider-stats">
        <div className="stat-card">
          <h4>Ganancias Totales</h4>
          <p className="stat-value">
            ${Number(stats.totalEarnings || 0).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h4>Citas Completadas</h4>
          <p className="stat-value">
            {stats.completedAppointments || 0}
          </p>
        </div>

        <div className="stat-card">
          <h4>Calificación Promedio</h4>
          <p className="stat-value">
            ★ {stats.avgRating ?? "N/A"}
          </p>
        </div>
      </div>

      {/* 🔥 TOP POR CITAS */}
      <div className="stats-section">
        <h3>🔥 Servicios más solicitados</h3>

        {topByAppointments.length === 0 ? (
          <p className="empty-text">Aún no hay citas completadas</p>
        ) : (
          topByAppointments.map((service, index) => (
            <div key={service.service_id} className="ranking-card">
              <span className="rank">#{index + 1}</span>
              <span className="service-title">{service.title}</span>
              <span className="service-value">
                {service.totalAppointments} citas
              </span>
            </div>
          ))
        )}
      </div>

      {/* ⭐ TOP POR RATING */}
      <div className="stats-section">
        <h3>⭐ Servicios mejor calificados</h3>

        {topByRating.length === 0 ? (
          <p className="empty-text">Aún no hay reseñas</p>
        ) : (
          topByRating.map((service, index) => (
            <div key={service.service_id} className="ranking-card">
              <span className="rank">#{index + 1}</span>
              <span className="service-title">{service.title}</span>
              <span className="service-value">
                ★ {service.avgRating} ({service.totalReviews} reseñas)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
