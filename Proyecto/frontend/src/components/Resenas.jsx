import React from "react";
import "./Resenas.css";

export default function Resenas() {
  // Datos dummy
  const reviews = [
    { id: 1, user: "Ana García", rating: 5, comment: "Excelente servicio, muy puntual y amable.", date: "10 Oct 2025" },
    { id: 2, user: "Carlos Ruiz", rating: 4, comment: "Buen trabajo, aunque llegó un poco tarde.", date: "05 Oct 2025" },
    { id: 3, user: "Elena Bo", rating: 5, comment: "Me encantó, definitivamente volveré a contratar.", date: "01 Oct 2025" },
  ];

  // Función para pintar estrellitas
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="reviews-container">
      <h2 style={{ marginBottom: "25px", color: "#333" }}>Lo que dicen tus clientes</h2>
      
      {reviews.length === 0 ? (
        <p>Aún no tienes reseñas.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-header">
              <span className="reviewer-name">{rev.user}</span>
              <span className="review-date">{rev.date}</span>
            </div>
            <div className="star-rating">{renderStars(rev.rating)}</div>
            <p className="review-text">"{rev.comment}"</p>
          </div>
        ))
      )}
    </div>
  );
}