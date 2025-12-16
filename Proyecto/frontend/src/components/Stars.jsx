import React from "react";
import "./Styles/Stars.css";

export default function Stars({ value, onChange }) {
  return (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "active" : ""}`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
