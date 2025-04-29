import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaCalendarAlt, FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51P8RRZDVGXCoDJmoQb8dsKySiy85GEzqmEo9wNwbFsNgZpgRIx9HVv0tUlUz4koJiYQAh4nOSeXwsEWAtaeg6PDf00UnG3XdaC');

// Payment form component that will be wrapped in Elements
function PaymentForm({ bookingData, room, totalPrice, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'Morocco',
    savePaymentInfo: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validatePaymentForm = () => {
    const errors = {};
    
    if (!paymentData.cardholderName) {
      errors.cardholderName = "Le nom du titulaire est requis";
    }
    
    if (!paymentData.billingAddress) {
      errors.billingAddress = "L'adresse de facturation est requise";
    }
    
    if (!paymentData.city) {
      errors.city = "La ville est requise";
    }
    
    if (!paymentData.postalCode) {
      errors.postalCode = "Le code postal est requis";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validatePaymentForm();
    if (Object.keys(errors).length > 0) {
      onError("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    if (!stripe || !elements) {
      // Stripe.js n'a pas encore chargé
      onError("Le système de paiement est en cours de chargement, veuillez réessayer.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Créer un payment method avec les informations de la carte
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: paymentData.cardholderName,
          address: {
            line1: paymentData.billingAddress,
            city: paymentData.city,
            postal_code: paymentData.postalCode,
            country: paymentData.country,
          },
        },
      });

      if (error) {
        setCardError(error.message);
        onError("Erreur de carte: " + error.message);
        setIsLoading(false);
        return;
      }

      // Envoyer la réservation avec le payment_method_id au backend
      const response = await fetch('http://127.0.0.1:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          room_id: bookingData.roomId,
          check_in_date: bookingData.checkInDate,
          check_out_date: bookingData.checkOutDate,
          payment_method_id: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Gérer le cas où une authentification supplémentaire est requise (3D Secure)
        if (data.requires_action) {
          const { error: confirmError } = await stripe.confirmCardPayment(
            data.payment_intent_client_secret
          );
          
          if (confirmError) {
            onError("Erreur de confirmation du paiement: " + confirmError.message);
            setIsLoading(false);
            return;
          }
          // Si nous arrivons ici, le paiement a été confirmé avec succès après authentification
        } else {
          onError(data.message || "Erreur lors du traitement du paiement");
          setIsLoading(false);
          return;
        }
      }
      
      // Paiement réussi
      setIsLoading(false);
      onSuccess();
      
      // Clear booking data from localStorage
      localStorage.removeItem('currentBooking');
      
    } catch (err) {
      console.error("Payment processing error:", err);
      onError("Erreur lors du traitement du paiement. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">Nom du titulaire de la carte</label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={paymentData.cardholderName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]"
            placeholder="Nom tel qu'il apparaît sur la carte"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Informations de carte</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-[#7C6A46] focus-within:border-[#7C6A46]">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {cardError && (
            <p className="text-sm text-red-600 mt-1">{cardError}</p>
          )}
        </div>
      </div>
    
      <h2 className="text-xl font-semibold mt-8 mb-6 pb-3 border-b">Adresse de facturation</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            type="text"
            id="billingAddress"
            name="billingAddress"
            value={paymentData.billingAddress}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              id="city"
              name="city"
              value={paymentData.city}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]"
            />
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Code postal</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={paymentData.postalCode}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
          <select
            id="country"
            name="country"
            value={paymentData.country}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7C6A46] focus:border-[#7C6A46]"
          >
            <option value="Morocco">Maroc</option>
            <option value="France">France</option>
            <option value="Spain">Espagne</option>
            <option value="United Kingdom">Royaume-Uni</option>
            <option value="Germany">Allemagne</option>
            <option value="United States">États-Unis</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="savePaymentInfo"
            name="savePaymentInfo"
            checked={paymentData.savePaymentInfo}
            onChange={handleInputChange}
            className="h-4 w-4 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
          />
          <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">
            Sauvegarder ces informations pour les prochaines réservations
          </label>
        </div>
      </div>
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading || !stripe}
          className="w-full py-3 px-4 bg-[#7C6A46] hover:bg-[#8d794f] text-white font-medium rounded-md shadow transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </>
          ) : `Payer ${totalPrice} MAD`}
        </button>
      </div>
    </form>
  );
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get booking data from location state or localStorage as fallback
  const [bookingData, setBookingData] = useState(() => {
    if (location.state && location.state.bookingData) {
      return location.state.bookingData;
    }

    // Fallback to localStorage if the state is not available (e.g., after page refresh)
    const savedBooking = localStorage.getItem('currentBooking');
    return savedBooking ? JSON.parse(savedBooking) : null;
  });

  // Room data state (would normally come from API)
  const [room, setRoom] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // If no booking data, redirect to rooms page
    if (!bookingData) {
      navigate('/rooms');
      return;
    }

    // Fetch room details
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/rooms/${bookingData.roomId}`);
        const data = await response.json();
        setRoom(data.room);
        
        // Calculate price
        if (data.room && bookingData.checkInDate && bookingData.checkOutDate) {
          const checkIn = new Date(bookingData.checkInDate);
          const checkOut = new Date(bookingData.checkOutDate);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          setTotalPrice(nights * data.room.price_per_night);
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Impossible de charger les détails de la chambre.");
      }
    };

    fetchRoomDetails();
  }, [bookingData, navigate]);

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    
    // After 3 seconds, redirect to a confirmation page
    setTimeout(() => {
      navigate('/booking-confirmation', { 
        state: { 
          bookingData,
          totalPrice,
          room: room ? {
            id: room.id,
            name: room.name,
            image: room.image
          } : null
        } 
      });
    }, 3000);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  if (!bookingData || !room) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#7C6A46]"></div>
      </div>
    );
  }

  // Calculate booking details
  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const baseImageUrl = 'http://127.0.0.1:8000/storage/';

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Finaliser votre réservation</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Form */}
        <div className="w-full lg:w-2/3">
          {isSuccess ? (
            <div className="bg-green-50 p-8 rounded-lg text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Paiement réussi!</h2>
              <p className="text-green-700 mb-4">Votre réservation a été confirmée. Redirection en cours...</p>
              <div className="animate-pulse">
                <div className="h-2 w-24 bg-green-200 rounded mx-auto"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6 pb-3 border-b">Informations de paiement</h2>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-gray-500" />
                    <span className="text-sm text-gray-500">Paiement sécurisé et crypté</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCcVisa className="text-blue-800 text-2xl" />
                    <FaCcMastercard className="text-red-600 text-2xl" />
                    <FaCcAmex className="text-blue-500 text-2xl" />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}
                
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    bookingData={bookingData}
                    room={room}
                    totalPrice={totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            </>
          )}
        </div>
        
        {/* Booking Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 pb-3 border-b">Résumé de la réservation</h2>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden">
                <img 
                  src={room.image ? `${baseImageUrl}${room.image}` : '/images/room.png'} 
                  alt={room.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="font-semibold">{room.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{room.type}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {bookingData.numberOfGuests} {bookingData.numberOfGuests > 1 ? 'personnes' : 'personne'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium">{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium">{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">{nights} {nights > 1 ? 'nuits' : 'nuit'}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{nights} {nights > 1 ? 'nuits' : 'nuit'} x {room.price_per_night} MAD</span>
                <span>{room.price_per_night * nights} MAD</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Taxes (10%)</span>
                <span>{Math.round(room.price_per_night * nights * 0.1)} MAD</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Frais de service</span>
                <span>150 MAD</span>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{totalPrice + Math.round(room.price_per_night * nights * 0.1) + 150} MAD</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Politique d'annulation</h4>
              <p className="text-sm text-gray-600">
                Annulation gratuite jusqu'à 48 heures avant l'arrivée. Annulation après ce délai ou non-présentation: première nuit facturée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;