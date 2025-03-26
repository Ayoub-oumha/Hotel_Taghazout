import React from 'react'
import { Outlet } from 'react-router-dom'

function Master() {
  return (
    <>
        <header>
            <img src="" alt="" />
        </header>
        <main><Outlet/></main>
        <footer>Footer</footer>
    </>
  )
}

export default Master