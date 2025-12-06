import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import ServicesPage from './components/ServiciesPage';
import AdminPage from './components/admin';
import ProveedorDashBoard from './components/ProveedorDashBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/ProveedorDashBoard' element={<ProveedorDashBoard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;