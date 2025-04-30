import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/api';
import { FaUsers, FaCheck, FaTimes, FaWifi, FaSnowflake, FaMountain, FaSwimmingPool, FaParking, FaGlassMartiniAlt } from "react-icons/fa";
import { BsTv } from "react-icons/bs";
import { PiShower } from "react-icons/pi";
import { AuthContext } from '../context/AuthContext';

function RoomsDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data.room);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Impossible de charger les détails de la chambre. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    
    
    if (bookingErrors[name]) {
      const newErrors = { ...bookingErrors };
      delete newErrors[name];
      setBookingErrors(newErrors);
    }
  };

  
  const validateBooking = () => {
    const errors = {};
    
    if (!booking.checkIn) {
      errors.checkIn = "La date d'arrivée est requise";
    }
    
    if (!booking.checkOut) {
      errors.checkOut = "La date de départ est requise";
    }
    
    if (booking.checkIn && booking.checkOut) {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      if (start >= end) {
        errors.checkOut = "La date de départ doit être après la date d'arrivée";
      }
    }
    
    if (booking.guests < 1) {
      errors.guests = "Le nombre de clients doit être d'au moins 1";
    }
    
    if (room && booking.guests > room.capacity) {
      errors.guests = `Cette chambre peut accueillir un maximum de ${room.capacity} personnes`;
    }
    
    return errors;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const errors = validateBooking();
    if (Object.keys(errors).length > 0) {
      setBookingErrors(errors);
      return;
    }
    
    if (!user) {
      
      navigate('/login', { state: { returnUrl: `/rooms/${id}` } });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        roomId: id,
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        numberOfGuests: booking.guests,
        specialRequests: booking.specialRequests,
      };
      
      // Here you would typically submit the booking to your API
      const response = await api.post('/reservations', bookingData);
      
      // For now, we'll simulate a successful booking and redirect to payment
      // setTimeout(() => {
      //   // Store booking data in localStorage or state management to access in payment page
      //   localStorage.setItem('currentBooking', JSON.stringify(bookingData));
        
      //   // Navigate to payment page
      //   navigate('/payment', { state: { bookingData } });
      // }, 1000);
    } catch (err) {
      console.error("Error creating booking:", err);
      setBookingErrors({ submit: "Erreur lors de la création de la réservation. Veuillez réessayer." });
      setIsSubmitting(false);
    }
  };

  // Function to render amenity icons based on the amenities string
  const renderAmenities = (amenitiesString, hasWifi, hasTv) => {
    try {
      // Parse the JSON string if it exists
      let amenitiesArray = [];
      if (amenitiesString) {
        amenitiesArray = JSON.parse(amenitiesString);
      }
      
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {hasWifi && (
            <div className="flex items-center gap-2">
              <FaWifi className="text-xl text-[#7C6A46]" />
              <span>WiFi gratuit</span>
            </div>
          )}
          
          {hasTv && (
            <div className="flex items-center gap-2">
              <BsTv className="text-xl text-[#7C6A46]" />
              <span>Télévision</span>
            </div>
          )}
          
          {room.has_air_conditioning && (
            <div className="flex items-center gap-2">
              <FaSnowflake className="text-xl text-[#7C6A46]" />
              <span>Climatisation</span>
            </div>
          )}
          
          {room.has_sea_view && (
            <div className="flex items-center gap-2">
              <FaMountain className="text-xl text-[#7C6A46]" />
              <span>Vue sur la mer</span>
            </div>
          )}
          
          {amenitiesArray.includes("Pool") && (
            <div className="flex items-center gap-2">
              <FaSwimmingPool className="text-xl text-[#7C6A46]" />
              <span>Piscine</span>
            </div>
          )}
          
          {amenitiesArray.includes("Parking") && (
            <div className="flex items-center gap-2">
              <FaParking className="text-xl text-[#7C6A46]" />
              <span>Parking</span>
            </div>
          )}
          
          {amenitiesArray.includes("Minibar") && (
            <div className="flex items-center gap-2">
              <FaGlassMartiniAlt className="text-xl text-[#7C6A46]" />
              <span>Minibar</span>
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#7C6A46]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <h3 className="text-xl font-bold text-red-700 mb-2">Erreur</h3>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Chambre non trouvée</h3>
          <p className="text-gray-700">La chambre que vous recherchez n'existe pas ou a été supprimée.</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="mt-4 bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
          >
            Voir toutes les chambres
          </button>
        </div>
      </div>
    );
  }

  const baseImageUrl = 'http://127.0.0.1:8000/storage/';

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span onClick={() => navigate('/')} className="hover:text-[#7C6A46] cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span onClick={() => navigate('/rooms')} className="hover:text-[#7C6A46] cursor-pointer">Chambres</span>
        <span className="mx-2">/</span>
        <span className="text-[#7C6A46]">{room.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column - Room Details */}
        <div className="w-full lg:w-2/3">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{room.name}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${room.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {room.is_available ? 'Disponible' : 'Occupé'}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {room.type} • Capacité: {room.capacity} {room.capacity > 1 ? 'personnes' : 'personne'}
            </p>
          </div>

          {/* Room Image */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={room.image ? `${baseImageUrl}${room.image}` : '/images/room.png'} 
              className="w-full h-auto object-cover" 
              alt={room.name}
            />
          </div>

          {/* Room Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Room Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Caractéristiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FaUsers className="text-xl text-[#7C6A46]" />
                <span>Capacité: {room.capacity} {room.capacity > 1 ? 'personnes' : 'personne'}</span>
              </div>
              <div className="flex items-center gap-2">
                {room.has_sea_view ? 
                  <FaCheck className="text-xl text-green-500" /> : 
                  <FaTimes className="text-xl text-red-500" />
                }
                <span>Vue sur la mer</span>
              </div>
              <div className="flex items-center gap-2">
                {room.has_air_conditioning ? 
                  <FaCheck className="text-xl text-green-500" /> : 
                  <FaTimes className="text-xl text-red-500" />
                }
                <span>Climatisation</span>
              </div>
              <div className="flex items-center gap-2">
                {room.has_wifi ? 
                  <FaCheck className="text-xl text-green-500" /> : 
                  <FaTimes className="text-xl text-red-500" />
                }
                <span>WiFi</span>
              </div>
              <div className="flex items-center gap-2">
                {room.has_tv ? 
                  <FaCheck className="text-xl text-green-500" /> : 
                  <FaTimes className="text-xl text-red-500" />
                }
                <span>Télévision</span>
              </div>
            </div>
          </div>

          {/* Room Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Équipements</h2>
            {renderAmenities(room.amenities, room.has_wifi, room.has_tv)}
          </div>

          {/* Room Policies */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-3">Politiques</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Arrivée / Départ</h3>
                <p className="text-gray-600">Check-in: 14:00 - 22:00</p>
                <p className="text-gray-600">Check-out: avant 12:00</p>
              </div>
              <div>
                <h3 className="font-medium">Annulation</h3>
                <p className="text-gray-600">Annulation gratuite jusqu'à 48 heures avant l'arrivée. Annulation après ce délai ou non-présentation: première nuit facturée.</p>
              </div>
              <div>
                <h3 className="font-medium">Enfants et lits d'appoint</h3>
                <p className="text-gray-600">Les enfants de tout âge sont les bienvenus. Les enfants de 12 ans et plus sont considérés comme des adultes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl font-semibold mb-4">Réserver</h2>
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
              <div>
                <p className="font-bold text-3xl text-[#7C6A46]">{room.price_per_night} MAD</p>
                <p className="text-gray-500">par nuit</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Meilleur prix garanti</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">Date d'arrivée</label>
                <input 
                  type="date" 
                  id="checkIn" 
                  name="checkIn"
                  min={today}
                  value={booking.checkIn}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${bookingErrors.checkIn ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]`}
                />
                {bookingErrors.checkIn && <p className="mt-1 text-sm text-red-600">{bookingErrors.checkIn}</p>}
              </div>

              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">Date de départ</label>
                <input 
                  type="date" 
                  id="checkOut" 
                  name="checkOut"
                  min={booking.checkIn || tomorrowStr}
                  value={booking.checkOut}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${bookingErrors.checkOut ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]`}
                />
                {bookingErrors.checkOut && <p className="mt-1 text-sm text-red-600">{bookingErrors.checkOut}</p>}
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Nombre de clients</label>
                <select 
                  id="guests" 
                  name="guests"
                  value={booking.guests}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${bookingErrors.guests ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]`}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'personne' : 'personnes'}</option>
                  ))}
                </select>
                {bookingErrors.guests && <p className="mt-1 text-sm text-red-600">{bookingErrors.guests}</p>}
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">Demandes spéciales (facultatif)</label>
                <textarea 
                  id="specialRequests" 
                  name="specialRequests"
                  rows="3"
                  value={booking.specialRequests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                  placeholder="Ex: chambre au calme, lit bébé..."
                />
              </div>

              {bookingErrors.submit && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md">
                  {bookingErrors.submit}
                </div>
              )}
              
              {!room.is_available ? (
                <div className="p-3 bg-red-50 text-red-700 rounded-md">
                  Cette chambre n'est pas disponible actuellement.
                </div>
              ) : (
                <button 
                  type="submit"
                  disabled={isSubmitting || !room.is_available}
                  className="w-full py-3 px-4 bg-[#7C6A46] hover:bg-[#8d794f] text-white font-medium rounded-md shadow transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement en cours...
                    </>
                  ) : "Réserver maintenant"}
                </button>
              )}
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Vous ne serez pas débité maintenant. Le paiement sera demandé à l'étape suivante.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomsDetails;