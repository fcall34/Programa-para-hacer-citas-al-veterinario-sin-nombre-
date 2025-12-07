import React, { useState } from "react";
import "./ScheduleMenu.css";

export default function ScheduleMenu({ service, onClose }) {

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = service.expiration_date
    ? service.expiration_date.split("T")[0]
    : null;

  // Normaliza el formato del backend a HH:mm
  const toHHMM = (t) => {
    if (!t) return "";
    if (typeof t !== "string") t = String(t);

    // Caso ISO: 1970-01-01T09:17:00.000Z
    const isoMatch = t.match(/T(\d{2}):(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}:${isoMatch[2]}`;

    // Caso normal: 09:17:00, 09:17:00.0000000
    const match = t.match(/^(\d{2}):(\d{2})/);
    if (match) return `${match[1]}:${match[2]}`;

    return t;
  };

  const serviceStart = toHHMM(service.start_time);
  const serviceEnd = toHHMM(service.end_time);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Selecciona fecha y hora.");
      return;
    }

    // Validación de horario dentro del rango permitido
    if (selectedTime < serviceStart || selectedTime > serviceEnd) {
      alert(`El horario debe estar entre ${serviceStart} y ${serviceEnd}`);
      return;
    }

    // Construir datetime real para el backend
    const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          service_id: service.service_id,
          appointment_date: appointmentDateTime
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Cita solicitada con éxito!");
        onClose();
      } else {
        alert("Error: " + data.message);
      }

    } catch (err) {
      console.error("Error enviando cita:", err);
      alert("Error al solicitar la cita");
    }
  };

  return (
    <div className="scheduleMenu-overlay">
      <div className="scheduleMenu">
        <h2>Agendar Cita</h2>

        <div className="section">
          <label>Fecha:</label>
          <input 
            type="date"
            min={minDate}
            max={maxDate}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="section">
          <label>Hora:</label>
          <input 
            type="time"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
          />
          <p className="hint">
            Disponible: {serviceStart} - {serviceEnd}
          </p>
        </div>

        <div className="buttons">
          <button className="close-btn" onClick={onClose}>Cancelar</button>
          <button 
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime}
          >
            Pedir cita
          </button>
        </div>
      </div>
    </div>
  );
}
