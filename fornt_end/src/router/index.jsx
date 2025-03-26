import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
    {path: "/", element: <h1>Home</h1>},
    {path: "*", element: <error404/>}
]);
