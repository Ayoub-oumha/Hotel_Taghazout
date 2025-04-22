import React from 'react'
import { createBrowserRouter, Route } from 'react-router-dom'
import Master from '../layout/master';
import Home from '../pages/Home';
import Error404 from '../pages/error404';
import Rooms from '../pages/Rooms';
import Explore from '../pages/Explore';
import Login from '../pages/Auth/Login';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Admin/Dashboard';



export const router = createBrowserRouter([
    {path: "/", element: <Master />, children:[
        {path: "/" , element: <Home/>},
        {path: "/Rooms" , element: <Rooms/>},
        {path: "/Explore" , element: <Explore/>},
        {path: "/About" , element: <About/>},
        {path: "/Login" , element: <Login/>},
        {path: "/contact" , element: <Contact/>},
        {path: "/dashboard" , element: <Dashboard/>},
        {path: "/*" , element: <Error404/>},
    ]},
]);
