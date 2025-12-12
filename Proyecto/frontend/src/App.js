import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import ServicesPage from './components/ServiciesPage.jsx';
import ProveedorDashBoard from './components/ProveedorDashBoard.jsx';
import ClientHome from './components/ClientHome.jsx'
import AdminDashboard from './components/AdminPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path='/ProveedorDashBoard' element={<ProveedorDashBoard/>}/>
        <Route path='/ClientHome' element={<ClientHome/>}/>
        <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;