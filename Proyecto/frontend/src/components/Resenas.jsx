import { useEffect, useState } from "react";
import "./Styles/Resenas.css";

export default function Resenas() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/provider/misreviews", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setReviews(res.data);
        }
        setLoading(false);
      });
  }, []);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return "★".repeat(full) + "☆".repeat(empty);
  };

  if (loading) return <p>Cargando reseñas...</p>;

  return (
    <div className="reviews-container">
      <h2 style={{ marginBottom: "25px", color: "#333" }}>
        Lo que dicen tus clientes
      </h2>

      {reviews.length === 0 ? (
        <p>Aún no tienes reseñas.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.review_id} className="review-card">
            <div className="review-header">
              <span className="reviewer-name">{rev.reviewer_name}</span>
              <span className="review-date">
                {new Date(rev.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="star-rating">
              {renderStars(rev.rating)}
            </div>

            <p className="review-text">"{rev.comment}"</p>
          </div>
        ))
      )}
    </div>
  );
}
