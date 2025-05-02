import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/api';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch user's reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
        
        const response = await api.get('/myReservation');
        
        if (response.data.status === 'success') {
          setReservations(response.data.data);
        } else {
          setError('Failed to fetch reservations');
        }
      } catch (err) {
        setError('Error fetching reservations: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePayNow = async (reservationId) => {
    try {
      
      const response = await api.post('/payments/create-intent', {
        reservation_id: reservationId
      });
      
      if (response.data.success) {
        
        window.open(response.data.payment_url, '_blank');
        
        setMessage('Payment page opened in a new tab. Please complete your payment.');
        

        setTimeout(() => setMessage(null), 5000);
      } else {
        setError('Failed to initialize payment');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Error initializing payment: ' + err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Format date string to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <div className="text-[#7C6A46] font-semibold text-xl">Loading your reservations...</div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <div className="text-red-500 font-semibold text-xl">{error}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#7C6A46] border-b pb-4 border-[#7C6A46]/30">My Reservations</h1>
      
      {message && (
        <div className="bg-[#7C6A46]/10 border-l-4 border-[#7C6A46] text-[#7C6A46] p-4 mb-6 rounded">
          {message}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-lg text-center">
          <p className="text-lg text-gray-600">You don't have any reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {/* Room Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={`http://127.0.0.1:8000/storage/${reservation.room.image}`} 
                  alt={reservation.room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Reservation Details */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-[#7C6A46]">{reservation.room.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm 
                    ${reservation.status === 'confirmed' ? 'bg-[#7C6A46]/10 text-[#7C6A46]' : 'bg-yellow-100 text-yellow-800'}`}>
                    {reservation.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-1">Room #{reservation.room.room_number}</p>
                <p className="text-gray-600">Type: {reservation.room.type}</p>
                
                <div className="mt-3">
                  <p><span className="font-medium text-[#7C6A46]">Check-in:</span> {formatDate(reservation.check_in_date)}</p>
                  <p><span className="font-medium text-[#7C6A46]">Check-out:</span> {formatDate(reservation.check_out_date)}</p>
                  <p className="mt-2"><span className="font-medium text-[#7C6A46]">Total Price:</span> MAD {parseFloat(reservation.total_price).toFixed(2)}</p>
                </div>
                
                {/* Amenities */}
                <div className="mt-3">
                  <p className="font-medium text-[#7C6A46]">Amenities:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {JSON.parse(reservation.room.amenities).map((amenity, index) => (
                      <span key={index} className="bg-[#7C6A46]/10 px-2 py-1 text-sm rounded text-[#7C6A46]">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Pay Now Button for Pending Reservations */}
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => handlePayNow(reservation.id)}
                    className="mt-4 w-full bg-[#7C6A46] hover:bg-[#9F8A66] text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;