import React, { useEffect, useState } from "react";
import './Styles/AppointmentList.css'; 

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener Texto y Clase CSS según el número (0, 1, 2)
  const getStatusConfig = (status) => {
    switch (status) {
      case 0: 
        return { text: "Pendiente", className: "status-pending" };
      case 1: 
        return { text: "Aceptada", className: "status-accepted" };
      case 2: 
        return { text: "Rechazada", className: "status-rejected" };
      default: 
        return { text: "Sin estado", className: "status-default" };
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        // MANTENEMOS TU RUTA ORIGINAL
        const res = await fetch("http://localhost:3000/api/appointments/miscitas", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setAppointments(data.data);
        }
      } catch (error) {
        console.error("Error cargando citas:", error);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="loading-container">Cargando tus citas...</div>;

  return (
    <div className="appointments-layout">
      <h2 className="section-title">Mis Citas</h2>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No tienes citas registradas aún.</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((ap) => {
            // Obtenemos la configuración del estado para esta cita
            const statusConfig = getStatusConfig(ap.appointment_status);

            return (
              <div key={ap.appointment_id} className="appointment-card">
                
                {/* --- HEADER DE LA TARJETA --- */}
                <div className="card-header-row">
                  <h3 className="service-name">{ap.title || "Servicio"}</h3>
                  <span className={`status-badge ${statusConfig.className}`}>
                    {statusConfig.text}
                  </span>
                </div>

                {/* --- CUERPO DE LA TARJETA --- */}
                <div className="card-body">
                  
                  {/* Fecha */}
                  <div className="info-item">
                    <span className="icon">📅</span>
                    <span className="info-text">
                        {/* Intentamos formatear la fecha si es posible */}
                        {ap.appointment_date ? new Date(ap.appointment_date).toLocaleDateString() : "Sin fecha"}
                    </span>
                  </div>

                  {/* Ubicación (Solo si existe) */}
                  {ap.location && (
                    <div className="info-item">
                        <span className="icon">📍</span>
                        <span className="info-text">{ap.location}</span>
                    </div>
                  )}

                  {/* Categoría (Solo si existe) */}
                  {ap.category_description && (
                    <div className="info-item">
                        <span className="icon">🏷️</span>
                        <span className="info-text">{ap.category_description}</span>
                    </div>
                  )}

                </div>

                {/* --- FOOTER DE LA TARJETA --- */}
                <div className="card-footer">
                  <button className="btn-details">Ver detalles</button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}