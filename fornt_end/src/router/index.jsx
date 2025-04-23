import React from 'react'
import { BrowserRouter, createBrowserRouter, Route, Routes  } from 'react-router-dom'
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


function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Master />}>
            <Route index element={<Home />} />
            <Route path="Rooms" element={<Rooms />} />
            <Route path="Explore" element={<Explore />} />
            <Route path="About" element={<About />} />
            <Route path="Login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="contact" element={<Contact />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default AppRouter;
