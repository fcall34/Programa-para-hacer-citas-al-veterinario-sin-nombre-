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
          setServices(data.data);
          setSelectedService(data.data[0]); // seleccionar el primero por default
        }

      } catch (err) {
        console.error("Error trayendo servicios:", err);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

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
                price={`$${service.cost}`}
                category={service.category_description ?? "Sin categoría"}
                start_time={service.start_time}
                end_time={service.end_time}
                distance="--"
                rating={5}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>

          <div className="right-column">
            {selectedService ? (
              <ServiceDetailCard
                service={selectedService}
                onOpenSchedule={() => setShowSchedule(true)}
              />
            ) : (
              <p className="no-service">Selecciona un servicio para ver detalles</p>
            )}
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

  </div>
);

}
