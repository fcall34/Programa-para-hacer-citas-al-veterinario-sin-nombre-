import React, { useState, useEffect } from "react";
import "./Styles/ScheduleMenu.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ScheduleMenu({ service, onClose }) {
  console.log("SERVICE RECIBIDO:", service);


  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  /* ------------------ helpers ------------------ */

  const toHHMM = (t) => {
    if (!t) return "";
    const match = String(t).match(/^(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : t;
  };

  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m + mins);
    return d.toTimeString().substring(0, 5);
  };

  /* -------- generar fechas disponibles ---------- */
  useEffect(() => {
    if (!service?.start_date || !service?.expiration_date) return;

    const dates = [];
    let current = new Date(service.start_date);
    const last = new Date(service.expiration_date);

    while (current <= last) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    setAvailableDates(dates);
  }, [service]);

  /* -------- obtener horarios disponibles ---------- */
  useEffect(() => {
    if (!selectedDate) return;

    const token = localStorage.getItem("token");

    fetch(
      `${API_URL}/api/appointments/availability/${service.service_id}?date=${selectedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("availability:", data);

        if (!data.success) {
          setAvailableTimes([]);
          return;
        }

        console.log(data)

        const start = toHHMM(data.start_time);
        const end = toHHMM(data.end_time);

        const times = [];
        let current = start;

        while (current < end) {
          if (!data.bookedTimes.includes(current)) {
            times.push(current);
          }
          current = addMinutes(current, 30);
        }

        setAvailableTimes(times);
      });
  }, [selectedDate, service.service_id]);

  /* ---------------- submit ------------------ */

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Selecciona fecha y hora");
      return;
    }

    const token = localStorage.getItem("token");
    const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;

    const res = await fetch(`${API_URL}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service_id: service.service_id,
        appointment_date: appointmentDateTime,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Cita creada correctamente");
      onClose();
    } else {
      alert(data.message);
    }
  };

  /* ---------------- render ------------------ */

  return (
    <div className="scheduleMenu-overlay">
      <div className="scheduleMenu">
        <h2>Agendar cita</h2>

        <div className="section">
          <label>Fecha</label>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
            }}
          >
            <option value="">Selecciona una fecha</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="section">
          <label>Hora</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
          >
            <option value="">Selecciona un horario</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="buttons">
          <button className="close-btn" onClick={onClose}>
            Cancelar
          </button>
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
