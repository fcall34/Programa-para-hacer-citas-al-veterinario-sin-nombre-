import React, { useState } from "react";
import Stars from "./Stars.jsx";
import './Styles/ReviewForm.css'
const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewForm({
  appointmentId,
  target,
  allowComment,
  onSuccess
}) {
  const [providerRating, setProviderRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const isClientReview = target === "provider"; 
  // cliente → califica proveedor + servicio

  const submit = async () => {
    if (loading || sent) return;
    setLoading(true);

    const payload = {
      appointment_id: appointmentId,
      review_target: target,
    };

    if (isClientReview) {
      payload.provider_rating = providerRating;
      payload.service_rating = serviceRating;
      payload.comment = allowComment ? comment : null;
    } else {
      // 🔒 lógica existente del proveedor (NO tocada)
      payload.rating = providerRating;
    }

    const res = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSent(true);
      onSuccess && onSuccess();
    } else {
      alert(data.message || "Error al enviar reseña");
    }
  };

  if (sent) {
    return <p style={{ color: "green" }}>⭐ Reseña enviada</p>;
  }

  return (
    <div className="review-box">
      <h4 className="review-title">
        ⭐ {isClientReview ? "Califica tu cita" : "Califica a tu cliente"}
      </h4>

      {/* CLIENTE */}
      {isClientReview && (
        <>
          <label>Proveedor</label>
          <Stars value={providerRating} onChange={setProviderRating} />

          <label>Servicio</label>
          <Stars value={serviceRating} onChange={setServiceRating} />

          {allowComment && (
            <textarea
              placeholder="Comentario para el proveedor"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          )}
        </>
      )}

      {/* PROVEEDOR (SIN CAMBIOS) */}
      {!isClientReview && (
        <Stars value={providerRating} onChange={setProviderRating} />
      )}

      <button className="review-btn" onClick={submit} disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
