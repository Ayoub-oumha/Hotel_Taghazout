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
import RoomsDetails from '../pages/RoomsDetails';

import Users from '../pages/Admin/Users';
import RoomsAdmin from '../pages/Admin/RoomsAdmin';
import MyReservations from '../pages/MyReservations';
import ModifyReservation from '../pages/ModifyReservation';



const NavigationManager = () => {
  
  const navigate = useNavigate();
  
 
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
            <Route path="Rooms/:id" element={<RoomsDetails />} />
            <Route path="my-reservations" element={ <RoleProtectedRoute allowedRoles={["user"]} ><MyReservations/></RoleProtectedRoute> } />
            <Route path="modify-reservation/:id" element={ <RoleProtectedRoute allowedRoles={["user"]} ><ModifyReservation/></RoleProtectedRoute> } />

           
          
            <Route path="Explore" element={<Explore />} />
            <Route path="About" element={ <About/>} />
            <Route path="users" element={ <RoleProtectedRoute allowedRoles={["admin"]} ><Users/></RoleProtectedRoute>} />
            <Route path="admin/rooms" element={ <RoleProtectedRoute allowedRoles={["admin"]} ><RoomsAdmin/></RoleProtectedRoute>} />
            <Route path="register" element={<Register />} />
            <Route path="contact" element={<Contact />} />
            <Route path="dashboard" element={ <RoleProtectedRoute allowedRoles={["admin"]} ><Dashboard /></RoleProtectedRoute>} />
            <Route path="*" element={<Error404 />} />
            <Route path="unauthorized" element={<Unauthorized/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default AppRouter;
