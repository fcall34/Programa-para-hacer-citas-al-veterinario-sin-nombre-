// pages/Home.jsx
import React, { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import ServiceDetailCard from "../components/ServiceDetailCard";
import './ClientHome.css'

const Home = () => {
  const [selectedService, setSelectedService] = useState(null);

  const sampleServices = [
    {
      service_id: 1,
      title: "Hair Salon Narvarte",
      cost: "250 - 500",
      description: "Barbería y servicios de cuidado personal",
      location: "Narvarte",
      schedule: "lunes - viernes",
      distance: 4,
    },
    {
      service_id: 2,
      title: "Moira's Hair Salon",
      cost: "200 - 450",
      description: "Servicios de color y tratamientos",
      location: "Narvarte",
      schedule: "lunes - sábado",
      distance: 6.5,
    },
  ];

  return (
  <div className="home-container">
      
      <div className="service-list">
        {sampleServices.map(s => (
          <ServiceCard
            key={s.service_id}
            title={s.title}
            costRange={`$${s.cost}`}
            schedule={s.schedule}
            distance={s.distance}
            onClick={() => setSelectedService(s)}
          />
        ))}
      </div>

      <div className="service-detail-area">
        <ServiceDetailCard service={selectedService} />
      </div>

  </div>
);
}

export default Home;
