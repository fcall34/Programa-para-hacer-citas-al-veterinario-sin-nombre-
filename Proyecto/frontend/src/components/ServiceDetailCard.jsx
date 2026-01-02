import { useState } from "react";
import StarsDisplay from "./StarsDisplay";
import "./Styles/ServiceDetailCrd.css";

const API_URL = import.meta.env.VITE_API_URL;

function formatTime(timeValue) {
  if (!timeValue) return "";
  const match = timeValue.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

export default function ServiceDetailCard({ service, onClose, onOpenSchedule }) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = service.images || [];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="service-detail-card">

      <button className="close-btn" onClick={onClose}>✕</button>


      <div className="carousel">
        {images.length > 0 ? (
          <>
            <img
              src={`${API_URL}${images[currentImage].image_url}`}
              alt="Servicio"
              className="carousel-img"
            />

            {images.length > 1 && (
              <>
                <button className="carousel-btn left" onClick={prevImage}>
                  ‹
                </button>
                <button className="carousel-btn right" onClick={nextImage}>
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <img src="/placeholder.jpg" className="carousel-img" />
        )}
      </div>

      <div className="detail-info">

        <h2 className="title">{service.title}</h2>

        {/* Categorías */}
        <div className="categories">
          {service.categories.map((c, i) => (
            <span key={i} className="category-tag">
              {c.category_description}
            </span>
          ))}
        </div>

        <div className="rating">
          <StarsDisplay value={Number(service.avg_rating) || 0} />
          <span>({service.review_count})</span>
        </div>


        <div className="price">
          💲 {service.cost}
        </div>

        <div className="schedule">
          ⏰ {formatTime(service.start_time)} - {formatTime(service.end_time)}
        </div>


        <div className="location">
          📍 {service.location}
        </div>

        <div className="provider">
          👤 {service.provider_name}
        </div>


        <p className="description">
          {service.description}
        </p>

        <button className="book-btn" onClick={onOpenSchedule}>
          Agendar cita
        </button>
      </div>
    </div>
  );
}
