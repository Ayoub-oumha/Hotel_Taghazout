import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

// Assurez-vous de remplacer ceci par votre clé publique Stripe
const stripePromise = loadStripe('pk_test_votre_cle_publique_stripe');

// Composant de formulaire de carte de crédit
const CheckoutForm = ({ reservationData, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservationData || !reservationData.id) return;

    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await api.post('/api/stripe/create-payment-intent', {
          reservation_id: reservationData.id
        });
        
        if (response.data.success) {
          setClientSecret(response.data.client_secret);
          setPaymentId(response.data.payment_id);
        } else {
          setError(response.data.message || 'Erreur lors de la création du paiement');
        }
      } catch (err) {
        console.error('Erreur lors de la création du paiement:', err);
        setError('Impossible de préparer le paiement. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [reservationData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: reservationData.customerName || 'Client',
          },
        }
      });

      if (error) {
        setError(`Paiement échoué: ${error.message}`);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirmer le paiement côté serveur
        const confirmResponse = await api.post('/api/stripe/confirm-payment', {
          payment_id: paymentId,
          payment_intent_id: paymentIntent.id
        });

        if (confirmResponse.data.success) {
          setSuccess(true);
          
          // Rediriger vers une page de confirmation après 2 secondes
          setTimeout(() => {
            navigate('/reservation-confirmation', { 
              state: { 
                reservationId: reservationData.id,
                paymentSuccess: true 
              } 
            });
          }, 2000);
        } else {
          setError('Le paiement a été effectué mais n\'a pas pu être confirmé dans notre système.');
        }
      }
    } catch (err) {
      console.error('Erreur lors du traitement du paiement:', err);
      setError('Une erreur s\'est produite lors du traitement du paiement.');
    } finally {
      setLoading(false);
    }
  };

  const cardOptions = {
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Détails de paiement</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carte de crédit
          </label>
          <div className="border border-gray-300 rounded-md p-4">
            <CardElement options={cardOptions} />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md my-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md my-4">
            Paiement réussi ! Vous allez être redirigé vers la confirmation de votre réservation.
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading || success}
          className={`w-full mt-4 py-3 px-4 ${
            loading || !stripe ? 'bg-gray-400' : 'bg-[#7C6A46] hover:bg-[#8d794f]'
          } text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </>
          ) : `Payer ${amount} MAD`}
        </button>
      </div>
    </form>
  );
};

// Page principale de paiement
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      navigate('/login', { state: { returnUrl: '/payment' } });
      return;
    }

    const fetchReservationData = async () => {
      try {
        // Récupérer les données de réservation depuis l'état de location ou localStorage
        const bookingData = location.state?.bookingData || JSON.parse(localStorage.getItem('currentBooking'));

        if (!bookingData) {
          setError('Aucune donnée de réservation trouvée.');
          setLoading(false);
          return;
        }

        // Créer la réservation dans l'API
        const response = await api.post('/api/reservations', {
          room_id: bookingData.roomId,
          check_in_date: bookingData.checkInDate,
          check_out_date: bookingData.checkOutDate,
          number_of_guests: bookingData.numberOfGuests,
          special_requests: bookingData.specialRequests || '',
        });

        if (response.data.success) {
          const reservation = response.data.reservation;
          setReservationData(reservation);
          setTotalPrice(reservation.total_price);
        } else {
          setError(response.data.message || 'Erreur lors de la création de la réservation');
        }
      } catch (err) {
        console.error('Erreur lors de la création de la réservation:', err);
        setError('Impossible de créer la réservation. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [location, navigate, user]);

  const calculateNights = () => {
    if (!reservationData) return 0;
    
    const checkIn = new Date(reservationData.check_in_date);
    const checkOut = new Date(reservationData.check_out_date);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
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
            onClick={() => navigate('/rooms')}
            className="mt-4 bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
          >
            Retour aux chambres
          </button>
        </div>
      </div>
    );
  }

  if (!reservationData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Informations manquantes</h3>
          <p className="text-gray-700">Aucune donnée de réservation n'a été trouvée.</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="mt-4 bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
          >
            Voir les chambres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span onClick={() => navigate('/')} className="hover:text-[#7C6A46] cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span onClick={() => navigate('/rooms')} className="hover:text-[#7C6A46] cursor-pointer">Chambres</span>
        <span className="mx-2">/</span>
        <span className="text-[#7C6A46]">Paiement</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column - Payment Details */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold">Finaliser votre réservation</h1>
            </div>
            
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  reservationData={reservationData} 
                  amount={totalPrice} 
                />
              </Elements>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Moyens de paiement sécurisés</h2>
            <p className="text-gray-600 mb-4">
              Nous utilisons Stripe pour traiter vos paiements. Vos informations de carte sont cryptées et sécurisées.
            </p>
            <div className="flex flex-wrap gap-4">
              <img src="/images/visa.png" alt="Visa" className="h-10" />
              <img src="/images/mastercard.png" alt="Mastercard" className="h-10" />
              <img src="/images/amex.png" alt="American Express" className="h-10" />
            </div>
          </div>
        </div>

        {/* Right Column - Reservation Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Résumé de la réservation</h2>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="font-medium">{reservationData.room?.name || 'Chambre'}</p>
              <p className="text-gray-600">{reservationData.room?.type || 'Standard'}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Arrivée:</span>
                <span className="font-medium">{new Date(reservationData.check_in_date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Départ:</span>
                <span className="font-medium">{new Date(reservationData.check_out_date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre de nuits:</span>
                <span className="font-medium">{calculateNights()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clients:</span>
                <span className="font-medium">{reservationData.number_of_guests}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix par nuit:</span>
                <span className="font-medium">{reservationData.room?.price_per_night || 0} MAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de service:</span>
                <span className="font-medium">{Math.round(totalPrice * 0.1)} MAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes:</span>
                <span className="font-medium">{Math.round(totalPrice * 0.2)} MAD</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>{totalPrice} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;