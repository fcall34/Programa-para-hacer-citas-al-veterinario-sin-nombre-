// components/ServiceCard.jsx
import React from "react";
import "./ServiceCard.css"; // O tailwind si usas tailwind

const ServiceCard = ({ title, costRange, schedule, distance, onClick }) => {
  return (
    <div className="service-card" onClick={onClick}>
      <h3>{title}</h3>

      <div className="stars">★★★★★</div>

      <p>{costRange}</p>
      <p>{schedule}</p>

      <div className="bottom-info">
        <span className="pin">📍 {distance} km de ti</span>
        <span className="icon">🗓️</span>
      </div>
    </div>
  );
};

export default ServiceCard;
