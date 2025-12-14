import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import ServicesPage from './components/ServiciesPage.jsx';
import ProveedorDashBoard from './components/ProveedorDashBoard.jsx';
import ClientHome from './components/ClientHome.jsx'
import AdminDashboard from './components/AdminPage.jsx'
import UserProfile from "./components/UserProfile.jsx";
import VerifyEmail from './components/VerifyEmail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UnauthorizedPage from './components/Unauthorized.jsx';
import { ROLES } from './Roles.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<ProtectedRoute role={ROLES.CLIENT}> <ServicesPage /> </ProtectedRoute>} />
        <Route path='/ProveedorDashBoard' element={<ProtectedRoute role={ROLES.PROVIDER}><ProveedorDashBoard/></ProtectedRoute>}/>
        <Route path='/ClientHome' element={<ProtectedRoute role={ROLES.CLIENT}> <ClientHome/> </ProtectedRoute>}/>
        <Route path='/AdminDashboard' element={<ProtectedRoute role={ROLES.ADMIN}> <AdminDashboard/> </ProtectedRoute>}/>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;