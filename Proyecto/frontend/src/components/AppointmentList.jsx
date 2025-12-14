import React, { useEffect, useState } from "react";
import './Styles/AppointmentList.css';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  const getStatusText = (status) => {
    switch (status) {
      case 0: return "Pendiente";
      case 1: return "Aceptada";
      case 2: return "Rechazada";
      default: return "Sin estado";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return "status-pending";
      case 1: return "status-accepted";
      case 2: return "status-rejected";
      default: return "";
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

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

  if (loading) return <p>Cargando citas...</p>;

  return (
    <div className="appointments-wrapper">
      <h2>Mis Citas</h2>

      {appointments.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <div className="cards-container">
          {appointments.map((ap) => (
            <div key={ap.appointment_id} className="appointment-card">
              <h3 className="card-title">{ap.title}</h3>

              <p className="card-date">
                <strong>Fecha:</strong> {ap.appointment_date}
              </p>

              {ap.location && (
                <p className="card-location">
                  <strong>Ubicación:</strong> {ap.location}
                </p>
              )}

              {ap.category_description && (
                <p className="card-category">
                  <strong>Categoría:</strong> {ap.category_description}
                </p>
              )}

              <p className={`card-status ${getStatusClass(ap.appointment_status)}`}>
                <strong>Estado:</strong> {getStatusText(ap.appointment_status)}
              </p>

              <button className="details-btn">Ver detalles</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
