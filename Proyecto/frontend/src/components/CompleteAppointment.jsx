import { useEffect, useState } from "react";

export default function CompleteAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [folios, setFolios] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/provider/accepted",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (data.success) {
          setAppointments(data.appointments);
        }
      } catch (err) {
        console.error("Error cargando citas:", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleComplete = async (appointmentId) => {
    const folio = folios[appointmentId];

    if (!folio) {
      alert("Ingresa el folio");
      return;
    }

    setLoadingId(appointmentId);

    try {
      const res = await fetch(
        "http://localhost:3000/api/provider/complete",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ folio })
        }
      );

      const data = await res.json();

      if (data.success) {
        // marcar como completada localmente
        setAppointments(prev =>
          prev.map(a =>
            a.Appointment_id === appointmentId
              ? { ...a, is_complete: 1 }
              : a
          )
        );
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Error al completar la cita");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h2>Citas aceptadas</h2>

      {appointments.map(app => (
        <div key={app.Appointment_id} className="appointment-card">

          <p><strong>Servicio:</strong> {app.service_name}</p>
          <p><strong>Cliente:</strong> {app.client_name}</p>
          <p><strong>Teléfono:</strong> {app.client_phone}</p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(app.Appointment_date).toLocaleString()}
          </p>

          {/* 🟢 ESTADO */}
          {app.is_complete ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              ✔ Completada
            </span>
          ) : (
            <>
              <input
                type="number"
                placeholder="Folio de la cita"
                value={folios[app.Appointment_id] || ""}
                onChange={e =>
                  setFolios({
                    ...folios,
                    [app.Appointment_id]: e.target.value
                  })
                }
              />

              <button
                onClick={() => handleComplete(app.Appointment_id)}
                disabled={loadingId === app.Appointment_id}
              >
                {loadingId === app.Appointment_id
                  ? "Validando..."
                  : "Validar y completar"}
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
