import React from "react";
import "./Styles/ServiceCard.css";
import StarsDisplay from "./StarsDisplay";


function formatTime(timeValue) {
  if (!timeValue) return "";
  const match = timeValue.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

export default function ServiceCard({
  title,
  price,
  category,
  distance,
  start_time,
  end_time,
  rating,
  reviewCount,
  onClick
}) {


  return (
    <div className="service-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div>
        <h3>{title}</h3>

        {/* ⭐ ESTRELLAS */}
        <StarsDisplay value={rating} />

        <div className="price">${price}</div>
        <div className="category">{category}</div>

        <div className="schedule">
          ⏰ {formatTime(start_time)} - {formatTime(end_time)}
        </div>

        <div className="distance">📍 {distance} km de ti</div>
      </div>

      <div className="calendar">📅</div>
    </div>
  );
}
