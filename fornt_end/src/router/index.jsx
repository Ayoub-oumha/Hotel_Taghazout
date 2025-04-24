import React from 'react'
import { BrowserRouter, createBrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Master from '../layout/master';
import Home from '../pages/Home';
import Error404 from '../pages/error404';
import Rooms from '../pages/Rooms';
import Explore from '../pages/Explore';
import Login from '../pages/Auth/Login';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Admin/Dashboard';
import Register from '../pages/Auth/Register';
import RoleProtectedRoute from './RoleProtectedRoute';
import Unauthorized from '../pages/Unauthorized';
import { setNavigator } from '../api/api';

// Composant wrapper pour configurer le navigateur
const NavigationManager = () => {
  // Récupérer l'objet navigate
  const navigate = useNavigate();
  
  // Configurer la fonction de navigation pour l'API
  React.useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  
  return null;
};

function AppRouter() {
    return (
      <BrowserRouter>
        <NavigationManager />
        <Routes>
          <Route path="/" element={<Master />}>
            <Route path="Login" element={<Login />} />
            <Route index element={<Home />} />
            <Route path="Rooms" element={<Rooms />} />
            <Route path="Explore" element={<Explore />} />
            <Route path="About" element={ <RoleProtectedRoute allowedRoles={["admin"]} ><About/></RoleProtectedRoute>} />
            <Route path="register" element={<Register />} />
            <Route path="contact" element={<Contact />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Error404 />} />
            <Route path="unauthorized" element={<Unauthorized/>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default AppRouter;
