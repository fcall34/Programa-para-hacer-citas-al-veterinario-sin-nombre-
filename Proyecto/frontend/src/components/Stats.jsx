import { useEffect, useState } from "react";
import "./Styles/Stats.css";

export default function ProviderStats() {

  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

    useEffect(() => {
    const fetchData = async () => {
      try {
        // Stats
        const statsRes = await fetch(
          "http://localhost:3000/api/provider/stats",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const statsData = await statsRes.json();

        if (statsData.success) {
          setStats(statsData.stats);
        }

        

      } catch (err) {
        console.error("Error cargando stats:", err);
      }
    };

    fetchData();
  }, []);


  if (!stats) return <p>Cargando estadísticas...</p>;

  return (
  <div className="provider-stats-wrapper">

    {/* 🔵 Header bonito */}
    <div className="stats-header">
      <h1 className="stats-name">
        {stats.full_name}
      </h1>
      <p className="stats-subtitle">
        CONOCE TUS ESTADÍSTICAS
      </p>
    </div>

    {/* 🔵 Cards */}
    <div className="provider-stats">
      <div className="stat-card">
        <h4>Ganancias Totales</h4>
        <p className="stat-value">
          ${Number(stats.totalEarnings).toLocaleString()}
        </p>
      </div>

      <div className="stat-card">
        <h4>Citas Completadas</h4>
        <p className="stat-value">
          {stats.completedAppointments}
        </p>
      </div>

      <div className="stat-card">
        <h4>Calificación</h4>
        <p className="stat-value">
          ★ {stats.avgRating || "N/A"}
        </p>
      </div>
    </div>
  </div>
);
}
