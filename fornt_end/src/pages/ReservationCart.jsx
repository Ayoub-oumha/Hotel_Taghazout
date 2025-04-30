import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationCart } from '../context/ReservationCartContext';
import api from '../api/api';

function ReservationCart() {
  const { cartItems, totalAmount, removeFromCart, clearCart } = useReservationCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Proceed to checkout with Stripe
  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Get reservation IDs from cart
      const reservationIds = cartItems.map(item => item.id);
      
      // Create checkout session with backend
      const response = await api.post('/create-checkout-session', {
        reservationIds: reservationIds
      });
      
      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Erreur lors de la création de la session de paiement');
      }
    } catch (err) {
      console.error('Erreur lors du processus de paiement:', err);
      setError(err.response?.data?.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Votre Panier</h1>
        <div className="text-center py-10">
          <p className="mb-4">Votre panier est vide.</p>
          <button 
            onClick={() => navigate('/rooms')} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Parcourir les chambres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Votre Panier</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Résumé de vos réservations</h2>
        
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium">{item.room?.name || 'Chambre'}</h3>
                <p className="text-gray-600">
                  <span className="font-semibold">Arrivée:</span> {formatDate(item.check_in_date)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Départ:</span> {formatDate(item.check_out_date)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Type de chambre:</span> {item.room?.type}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Prix par nuit:</span> {item.room?.price_per_night} MAD
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <p className="text-lg font-bold mb-2">{item.total_price} MAD</p>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-500 hover:text-red-700">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">{totalAmount.toFixed(2)} MAD</span>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between">
          <button 
            onClick={handleCheckout} 
            disabled={isProcessing}
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mb-4 md:mb-0">
            {isProcessing ? 'Traitement en cours...' : 'Procéder au paiement'}
          </button>
          
          <button 
            onClick={clearCart} 
            className="w-full md:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded">
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationCart;