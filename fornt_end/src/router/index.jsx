import React from 'react'
import { createBrowserRouter, Route } from 'react-router-dom'
import Master from '../layout/master';
import Home from '../pages/Home';
export const router = createBrowserRouter([
    {path: "/", element: <Master />, children:[
        {path: "/" , element: <Home/>}
    ]},
]);
