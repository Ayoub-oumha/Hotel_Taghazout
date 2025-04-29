import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaBed, FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, totalPrice, room } = location.state || {};
  
  useEffect(() => {
    // Si pas de données de réservation, rediriger vers la page d'accueil
    if (!bookingData || !room) {
      navigate('/');
    }
  }, [bookingData, room, navigate]);

  if (!bookingData || !room) {
    return null;
  }

  // Calculer les détails de la réservation
  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const baseImageUrl = 'http://127.0.0.1:8000/storage/';
  
  // Formater les dates
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Générer un numéro de réservation
  const bookingNumber = `BK-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <FaCheckCircle className="mx-auto text-5xl mb-4" />
          <h1 className="text-3xl font-bold">Réservation Confirmée</h1>
          <p className="text-xl mt-2">Merci d'avoir choisi l'Hôtel Taghazout!</p>
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Numéro de réservation</p>
              <p className="text-xl font-bold">{bookingNumber}</p>
            </div>
            <Link 
              to="/my-bookings" 
              className="bg-[#7C6A46] hover:bg-[#8d794f] text-white py-2 px-4 rounded-md transition-colors duration-200"
            >
              Voir mes réservations
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaBed className="text-[#7C6A46]" /> Détails de la chambre
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img 
                    src={room.image ? `${baseImageUrl}${room.image}` : '/images/room.png'} 
                    alt={room.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {bookingData.numberOfGuests} {bookingData.numberOfGuests > 1 ? 'personnes' : 'personne'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-[#7C6A46]" /> Dates de séjour
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">{formatDate(checkIn)}</p>
                    <p className="text-sm text-gray-500">À partir de 14h00</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Check-out</p>
                    <p className="text-gray-600">{formatDate(checkOut)}</p>
                    <p className="text-sm text-gray-500">Jusqu'à 12h00</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Durée: {nights} {nights > 1 ? 'nuits' : 'nuit'}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif du paiement</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{nights} {nights > 1 ? 'nuits' : 'nuit'} x {totalPrice / nights} MAD</span>
                <span>{totalPrice} MAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (10%)</span>
                <span>{Math.round(totalPrice * 0.1)} MAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de service</span>
                <span>150 MAD</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total payé</span>
                <span>{totalPrice + Math.round(totalPrice * 0.1) + 150} MAD</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-[#7C6A46]" /> Coordonnées
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  <span>{bookingData.guestName || "Invité"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-500" />
                  <span>{bookingData.guestEmail || "email@exemple.com"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-gray-500" />
                  <span>{bookingData.guestPhone || "Non spécifié"}</span>
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#7C6A46]" /> Adresse de l'hôtel
              </h2>
              <div className="space-y-2">
                <p className="font-medium">Hôtel Taghazout</p>
                <p>12 Avenue des Plages</p>
                <p>Taghazout, 80023</p>
                <p>Maroc</p>
                <p className="mt-2 text-sm">
                  <a href="tel:+212-5-28-20-00-00" className="text-[#7C6A46] hover:underline">+212 5 28 20 00 00</a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Information importante</h3>
            <p className="text-sm text-blue-700">
              Une confirmation de réservation a été envoyée à votre adresse e-mail. Si vous avez des questions ou besoin de modifier votre réservation, n'hésitez pas à contacter notre équipe de service client.
            </p>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;