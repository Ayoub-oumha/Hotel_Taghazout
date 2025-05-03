import React from 'react'
import { Link } from 'react-router-dom'
import { FaLock, FaHome } from 'react-icons/fa'

function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg border-t-4 border-[#7C6A46]">
        <div className="mb-6 flex justify-center">
          <FaLock className="text-[#7C6A46] text-6xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to access this page.
          Please contact an administrator if you believe this is an error.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-[#7C6A46] text-white font-medium rounded-lg hover:bg-[#6A5A3B] transition-colors"
        >
          <FaHome className="mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized