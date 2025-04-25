import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCalendarCheck, FaUser, FaBed, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get confirmation data from location state
  const confirmationData = location.state || null;
  
  // If there's no data, redirect to home after a short delay
  useEffect(() => {
    if (!confirmationData) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [confirmationData, navigate]);
  
  // Generate booking reference number
  const generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TH-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // If no confirmation data is available
  if (!confirmationData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 p-8 rounded-lg text-center max-w-md">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Aucune information de réservation</h2>
          <p className="text-red-700 mb-4">Nous n'avons pas trouvé de détails de réservation. Vous allez être redirigé vers la page d'accueil.</p>
          <div className="mt-6">
            <Link to="/" className="bg-[#7C6A46] hover:bg-[#8d794f] text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const { bookingData, paymentData, totalPrice, room } = confirmationData;
  const bookingReference = generateBookingReference();
  const baseImageUrl = 'http://127.0.0.1:8000/storage/';
  
  // Calculate booking length
  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        <div className="bg-green-100 rounded-lg p-6 mb-8 flex items-center gap-4">
          <div className="bg-green-200 rounded-full p-3">
            <FaCalendarCheck className="text-green-700 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">Réservation confirmée!</h1>
            <p className="text-green-700">
              Votre réservation a été traitée avec succès. Vous recevrez un email de confirmation dans quelques instants.
            </p>
          </div>
        </div>
        
        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-[#7C6A46] py-4 px-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Détails de la réservation</h2>
              <p className="text-sm bg-white text-[#7C6A46] py-1 px-3 rounded-full font-medium">
                Réf: {bookingReference}
              </p>
            </div>
          </div>
          
          <div className="p-6">
            {/* Room Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b">
              <div className="w-full md:w-1/3">
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={room.image ? `${baseImageUrl}${room.image}` : '/images/room.png'} 
                    alt={room.name}
                    className="w-full h-48 object-cover" 
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUser className="text-[#7C6A46]" />
                    <span>{bookingData.numberOfGuests} {bookingData.numberOfGuests > 1 ? 'personnes' : 'personne'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-[#7C6A46]" />
                    <span>{nights} {nights > 1 ? 'nuits' : 'nuit'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBed className="text-[#7C6A46]" />
                    <span>Chambre {room.type}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dates */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b">
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Check-in</p>
                <p className="font-semibold">{new Date(bookingData.checkInDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="mt-1 text-sm text-gray-500">À partir de 14:00</p>
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Check-out</p>
                <p className="font-semibold">{new Date(bookingData.checkOutDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="mt-1 text-sm text-gray-500">Jusqu'à 12:00</p>
              </div>
            </div>
            
            {/* Payment and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FaCreditCard className="text-[#7C6A46]" /> Paiement
                </h4>
                <p className="text-gray-600">{paymentData.cardholderName}</p>
                <p className="text-gray-600">{paymentData.cardNumber}</p>
                <p className="text-gray-700 font-semibold mt-2">Total payé: {totalPrice + Math.round(totalPrice * 0.1) + 150} MAD</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#7C6A46]" /> Adresse de facturation
                </h4>
                <p className="text-gray-600">{paymentData.billingAddress}</p>
                <p className="text-gray-600">{paymentData.postalCode}, {paymentData.city}</p>
                <p className="text-gray-600">{paymentData.country}</p>
              </div>
            </div>
            
            {/* Special Requests */}
            {bookingData.specialRequests && (
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-2">Demandes spéciales</h4>
                <p className="text-gray-600">{bookingData.specialRequests}</p>
              </div>
            )}
            
            {/* Next Steps */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Prochaines étapes</h4>
              <p className="text-blue-700 text-sm mb-2">
                Vous recevrez un email de confirmation contenant tous les détails de votre réservation.
              </p>
              <p className="text-blue-700 text-sm">
                Pour toute question, n'hésitez pas à nous contacter au +212 528 123 456 ou par email à contact@taghazouthub.com
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/"
            className="bg-[#7C6A46] hover:bg-[#8d794f] text-white font-medium py-3 px-6 rounded transition-colors duration-200 text-center"
          >
            Retour à l'accueil
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-white border border-[#7C6A46] text-[#7C6A46] hover:bg-gray-50 font-medium py-3 px-6 rounded transition-colors duration-200"
          >
            Imprimer confirmation
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;