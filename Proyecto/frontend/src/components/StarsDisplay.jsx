import React from "react";
import "./Styles/StarsDisplay.css";

export default function StarsDisplay({ value = 0 }) {
  const rating = Number(value);

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="stars">
      {/* ⭐ estrellas completas */}
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full">★</span>
      ))}

      {/* ⭐ media estrella */}
      {hasHalfStar && <span className="star half">★</span>}

      {/* ⭐ estrellas vacías */}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty">★</span>
      ))}
    </div>
  );
}
