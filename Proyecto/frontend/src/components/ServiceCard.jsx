import React from "react";
import "./ServiceCard.css";

export default function ServiceCard({ title, price, distance, schedule, rating }) {
  return (
    <div className="service-card">
      <div>
        <h3>{title}</h3>
        <div className="stars">{rating} ⭐</div>
        <div className="price">{price}</div>
        <div className="schedule">{schedule}</div>
        <div className="distance">📍 {distance} km de ti</div>
      </div>

      <div className="calendar">📅</div>
    </div>
  );
}
