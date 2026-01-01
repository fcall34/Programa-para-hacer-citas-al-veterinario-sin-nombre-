import React from "react";
import "./Styles/ServiceCard.css";
import StarsDisplay from "./StarsDisplay";
const API_URL = import.meta.env.VITE_API_URL;



function formatTime(timeValue) {
  if (!timeValue) return "";
  const match = timeValue.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

export default function ServiceCard({
  title,
  price,
  categories = [],
  image,
  distance,
  start_time,
  end_time,
  rating,
  reviewCount,
  onClick

})



{
  return (
    <div className="service-card" onClick={onClick}>
      
      {/* 🖼 Imagen */}
      <div className="service-img">
        <img
          src={image ? `${API_URL}${image}` : "/placeholder.jpg"}
          alt={title}
        />
      </div>

      {/* 📄 Info */}
      <div className="service-info">
        <div className="price">${price}</div>

        <h3 className="title">{title}</h3>

        {/* Categorías */}
        <div className="categories">
          {Array.isArray(categories) &&
          categories.map((c, i) => (
            <span key={i} className="category-tag">
              {c.category_description}
            </span>
          ))}
        </div>

        {/* ⭐ Rating */}
        <div className="rating">
          <StarsDisplay value={rating} />
          <span className="reviews">({reviewCount})</span>
        </div>

        <div className="schedule">
          ⏰ {formatTime(start_time)} - {formatTime(end_time)}
        </div>

        <div className="distance">📍 {distance} km</div>
      </div>
    </div>
  );
}
