import React from 'react'
import { createBrowserRouter, Route } from 'react-router-dom'
import Master from '../layout/master';
import Home from '../pages/Home';
import Error404 from '../pages/error404';
import Rooms from '../pages/Rooms';
import Login from '../pages/Auth/Login';

export const router = createBrowserRouter([
    {path: "/", element: <Master />, children:[
        {path: "/" , element: <Home/>},
        {path: "/Rooms" , element: <Rooms/>},
        {path: "/Login" , element: <Login/>},
        {path: "/contact" , element: <h1>contact</h1>},
        {path: "/*" , element: <Error404/>},
    ]},
]);
