import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Styles/UserProfile.css';
import Header from "./Header"; 

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para saber si estamos editando
  const [isEditing, setIsEditing] = useState(false);
  // Estado para guardar la nueva ubicación mientras escribes
  const [newLocation, setNewLocation] = useState("");

  const navigate = useNavigate();

  // 1. Cargar datos del usuario
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
          setNewLocation(data.user.location || ""); // Pre-llenamos el dato
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

  // 2. Función para guardar los cambios
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
            // Actualizamos el usuario en pantalla sin recargar
            setUser({ ...user, location: newLocation });
            setIsEditing(false); // Salimos del modo edición
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
      {/* Header conectado a la navegación correcta */}
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
              <p>{user?.email}</p> {/* Solo lectura */}
            </div>
            
            <div className="info-item">
              <label>Teléfono</label>
              <p>{user?.phone || "--"}</p> {/* Solo lectura */}
            </div>
            
            <div className="info-item">
              <label>Ubicación</label>
              {isEditing ? (
                // Si estamos editando, mostramos el INPUT
                <input 
                    type="text" 
                    className="location-input"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Escribe tu ciudad o dirección"
                />
              ) : (
                // Si NO estamos editando, mostramos el TEXTO normal
                <p>{user?.location || "Sin ubicación definida"}</p>
              )}
            </div>
            
            <div className="info-item">
              <label>Miembro desde</label>
              <p>2025</p>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
                <>
                    <button className="save-btn" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </button>
                    <button className="cancel-btn" onClick={() => {
    setIsEditing(false);
    // Agregamos el '?' después de user para protegerlo
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