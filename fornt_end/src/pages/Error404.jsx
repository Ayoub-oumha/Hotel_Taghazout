import React from 'react'
import { Link } from 'react-router-dom'

function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f5f0] to-[#eae6df] px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#7C6A46] h-3"></div>
        <div className="p-8 sm:p-12">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-[#7C6A46]/10 flex items-center justify-center">
              <span className="text-5xl text-[#7C6A46]">404</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mt-8">Page Not Found</h2>
          
          <div className="h-px bg-gradient-to-r from-transparent via-[#7C6A46]/30 to-transparent my-6"></div>
          
          <p className="text-center text-gray-600 mb-8">
            We can't seem to find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#7C6A46] text-white font-medium rounded-lg hover:bg-[#8d794f] transition duration-300 ease-in-out group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Homepage
            </Link>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-8">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error404