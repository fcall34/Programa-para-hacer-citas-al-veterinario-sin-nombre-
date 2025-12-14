import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Styles/UserProfile.css';
import Header from "./Header"; 

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Si no hay token, va pa' fuera
          return;
        }

        const res = await fetch("http://localhost:3000/api/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          alert("No se pudo cargar el perfil");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="loading-screen">Cargando perfil...</div>;

  return (
    <div className="profile-page-wrapper">
      {/* Reutilizamos tu Header, pasando la navegación si es necesario */}
      <Header onViewAppointments={() => navigate('/ClientHome')} /> 

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            {/* Usamos la inicial del nombre como avatar */}
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          
          <h2 className="profile-name">{user?.full_name}</h2>
          <p className="profile-type">
            {user?.user_type === 1 ? "Cliente" : "Proveedor"}
          </p>

          <div className="profile-info-grid">
            <div className="info-item">
              <label>Correo Electrónico</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Teléfono</label>
              <p>{user?.phone || "--"}</p>
            </div>
            <div className="info-item">
              <label>Ubicación</label>
              <p>{user?.location || "--"}</p>
            </div>
            <div className="info-item">
              <label>Miembro desde</label>
              <p>2025</p> {/* O puedes traer la fecha de registro de la BD */}
            </div>
          </div>

          <button className="edit-profile-btn" onClick={() => alert("Próximamente...")}>
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}