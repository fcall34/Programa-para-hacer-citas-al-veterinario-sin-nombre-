import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Styles/UserProfile.css';
import Header from "./Header"; 

// 1. Agregamos la lista de ciudades igual que en el Registro
const CIUDADES_MEXICO = [
  "Aguascalientes", "Cancún", "Celaya", "Chihuahua", "Ciudad de México",
  "Ciudad Juárez", "Cuernavaca", "Guadalajara", "Hermosillo", "León",
  "Mérida", "Monterrey", "Morelia", "Pachuca", "Puebla", "Querétaro",
  "Saltillo", "San Luis Potosí", "Tijuana", "Toluca", "Torreón",
  "Tuxtla Gutiérrez", "Veracruz", "Villahermosa", "Xalapa", "Zacatecas"
];

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); 
          return;
        }

        const res = await fetch("http://localhost:3000/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
          setNewLocation(data.user.location || ""); 
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

  const handleSaveChanges = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/profile/update-location", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ location: newLocation })
        });

        const data = await res.json();

        if (data.success) {
            setUser({ ...user, location: newLocation });
            setIsEditing(false); 
            alert("Ubicación actualizada correctamente");
        } else {
            alert("Error al actualizar: " + data.message);
        }

    } catch (error) {
        console.error("Error guardando:", error);
        alert("Error al conectar con el servidor");
    }
  };

  if (loading) return <div className="loading-screen">Cargando perfil...</div>;

  return (
    <div className="profile-page-wrapper">
      <Header 
        onViewAppointments={() => navigate('/ClientHome')} 
        onHome={() => navigate('/ClientHome')}
      /> 

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
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
              {isEditing ? (
                // 2. Aquí cambiamos el input por el SELECT
                <select
                  className="location-input"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                >
                  <option value="">Selecciona tu ciudad</option>
                  {CIUDADES_MEXICO.map(ciudad => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{user?.location || "Sin ubicación definida"}</p>
              )}
            </div>
            
            <div className="info-item">
              <label>Miembro desde</label>
              <p>2025</p>
            </div>
          </div>

          {/* Botones de acción mejorados */}
          <div className="profile-actions">
            {isEditing ? (
                <>
                    <button className="save-btn" onClick={handleSaveChanges}>
                        Guardar
                    </button>
                    <button className="cancel-btn" onClick={() => {
                        setIsEditing(false);
                        setNewLocation(user?.location || ""); 
                    }}>
                        Cancelar
                    </button>
                </>
            ) : (
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Editar Ubicación
                </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}