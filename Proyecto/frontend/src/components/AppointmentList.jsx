import React, { useEffect, useState } from "react";
import "./Styles/AppointmentList.css";
import ReviewForm from "./ReviewForm";
import "./styles/ReviewForm.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Estado visual
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
        const res = await fetch(
          `${API_URL}/api/appointments/miscitas`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (data.success) {
          setAppointments(data.data);
        }
      } catch (err) {
        console.error("Error cargando citas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="loading-container">Cargando tus citas...</div>;
  }

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
            const statusConfig = getStatusConfig(ap.appointment_status);

            return (
              <div key={ap.appointment_id} className="appointment-card">
                
                <div className="card-header-row">
                  <h3 className="service-name">{ap.title || "Servicio"}</h3>
                  <span className={`status-badge ${statusConfig.className}`}>
                    {statusConfig.text}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-item">
                    <span className="icon">📅</span>
                    <span className="info-text">
                      {ap.appointment_date
                        ? new Date(ap.appointment_date).toLocaleDateString()
                        : "Sin fecha"}
                    </span>
                  </div>

                  {ap.location && (
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <span className="info-text">{ap.location}</span>
                    </div>
                  )}

                  {ap.category_description && (
                    <div className="info-item">
                      <span className="icon">🏷️</span>
                      <span className="info-text">
                        {ap.category_description}
                      </span>
                    </div>
                  )}
                </div>
                <div className="card-footer">

                  {ap.is_complete && ap.clientReviewed === 0 && (
                    <div className="reviews-container">
                      <h4>Califica tu experiencia</h4>

                      <ReviewForm
                        appointmentId={ap.appointment_id}
                        target="provider"
                        allowComment={true}
                        onSuccess={() => {
                          setAppointments((prev) =>
                            prev.map((cita) =>
                              cita.appointment_id === ap.appointment_id
                                ? { ...cita, clientReviewed: 1 }
                                : cita
                            )
                          );
                        }}
                      />
                    </div>
                  )}

                  {ap.is_complete && ap.clientReviewed === 1 && (
                    <span className="reviewed-label">
                      ✔ Ya calificaste esta cita
                    </span>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
