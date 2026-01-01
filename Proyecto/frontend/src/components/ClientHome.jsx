import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import ServiceDetailCard from "../components/ServiceDetailCard.jsx";
import Header from "../components/Header.jsx";
import ScheduleMenu from "./ScheduleMenu";
import AppointmentsList from "./AppointmentList.jsx";
import './Styles/ClientHome.css';
const API_URL = import.meta.env.VITE_API_URL;

export default function HomeClient() {

  const [services, setServices] = useState([]);        // todos los servicios
  const [selectedService, setSelectedService] = useState(null); // servicio seleccionado
  const [loading, setLoading] = useState(true);

  const [showSchedule, setShowSchedule] = useState(false);
  const [view, setView] = useState('services');

  useEffect(() => {
  if (selectedService) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [selectedService]);


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");



        const res = await fetch(`${API_URL}/api/services`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();

        console.log("SERVICIOS:", data.data);

        if (data.success) {
            const parsed = data.data.map(service => ({
              ...service,
              categories: service.categories
                ? JSON.parse(service.categories)
                : [],
              images: service.images
                ? JSON.parse(service.images)
                : []
            }));

            setServices(parsed);
           
          }


      } catch (err) {
        console.error("Error trayendo servicios:", err);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);


  const handleSelect = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      const parsed = {
        ...data.data,
        categories: data.data.categories
          ? JSON.parse(data.data.categories)
          : [],
        images: data.data.images
          ? JSON.parse(data.data.images)
          : []
      };

      setSelectedService(parsed);
    }
  } catch (error) {
    console.error("Error al seleccionar servicio:", error);
  }
};


  if (loading) return <p className="loading">Cargando servicios...</p>;

  return (
  <div className="home-wrapper">

    <Header onViewAppointments={() => setView("appointments")} />


    {view === "services" && (
      <div className="home-container">

        <div className="top-area">
          <SearchBar />
        </div>

        <div className="content-area">

          <div className="left-column">
            {services.map(service => (
              <ServiceCard
                  key={service.service_id}
                  title={service.title}
                  price={service.cost}
                  categories={service.categories}
                  image={service.images?.[0]?.image_url}
                  start_time={service.start_time}
                  end_time={service.end_time}
                  rating={Number(service.avg_rating) || 0}
                  reviewCount={service.review_count || 0}
                  distance={2.5}
                  onClick={() => handleSelect(service.service_id)}
                />
            ))}
          </div>


        </div>
      </div>

      
    )}

    {view === "appointments" && (
      <div className="appointments-container">
        <button className="back-btn" onClick={() => setView("services")}>
          ← Volver a Servicios
        </button>
        <AppointmentsList />
      </div>
    )}

    {showSchedule && (
      <ScheduleMenu
        service={selectedService}
        onClose={() => setShowSchedule(false)}
      />
    )}



    {selectedService && (
  <div className="service-overlay" onClick={() => setSelectedService(null)}>
    <div
      className="service-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <ServiceDetailCard
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onOpenSchedule={() => setShowSchedule(true)}
      />
    </div>
  </div>
)}


  </div>
);

}
