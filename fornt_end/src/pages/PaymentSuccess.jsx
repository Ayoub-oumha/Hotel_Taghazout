import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api/api';

function PaymentSuccess() {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        let reservationId = params.id;
        
        if (!reservationId) {
          const queryParams = new URLSearchParams(location.search);
          reservationId = queryParams.get('reservation_id');
        }
        
        if (!reservationId) {
          const pathParts = location.pathname.split('/');
          reservationId = pathParts[pathParts.length - 1];
        }
        
        setDebugInfo({
          params_id: params.id,
          query_params: Object.fromEntries(new URLSearchParams(location.search)),
          path_parts: location.pathname.split('/'),
          extracted_id: reservationId
        });
        
        if (!reservationId) {
          setError("Information de réservation manquante");
          setLoading(false);
          return;
        }
        
        try {
          console.log(`Fetching reservation with ID: ${reservationId}`);
          const response = await api.get(`/reservations/${reservationId}`);
          
          if (response.data && response.data.data) {
            setReservation(response.data.data);
          } else if (response.data) {
            setReservation(response.data);
          } else {
            throw new Error("Format de réponse invalide");
          }
        } catch (apiError) {
          console.error("API Error details:", apiError.response?.data || apiError.message);
          throw new Error(`Erreur API: ${apiError.response?.status || ''} ${apiError.message}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reservation details:", err);
        setError(`Impossible de charger les détails de la réservation: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchReservationDetails();
  }, [location, params]);
  
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
          
          {process.env.NODE_ENV !== 'production' && debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-left overflow-auto text-xs">
              <h4 className="font-bold mb-2">Debug Info:</h4>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button 
              onClick={() => navigate('/rooms')}
              className="bg-white text-[#7C6A46] border border-[#7C6A46] px-4 py-2 rounded hover:bg-gray-50"
            >
              Voir les chambres
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Paiement réussi !
          </h2>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Détails de la réservation</h3>
            
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Numéro de réservation:</span> #{reservation.id}</p>
              <p><span className="font-medium">Chambre:</span> #{reservation.room_id}</p>
              <p><span className="font-medium">Arrivée:</span> {formatDate(reservation.check_in_date)}</p>
              <p><span className="font-medium">Départ:</span> {formatDate(reservation.check_out_date)}</p>
              <p><span className="font-medium">Montant total:</span> {reservation.total_price} MAD</p>
              <p><span className="font-medium">Statut:</span> 
                <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {reservation.status === 'confirmed' ? 'Confirmé' : reservation.status}
                </span>
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Votre réservation a été confirmée avec succès. Merci pour votre confiance !
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="bg-white text-[#7C6A46] border border-[#7C6A46] px-4 py-2 rounded hover:bg-gray-50"
              >
                Retour à l'accueil
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                className="bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
              >
                Voir mes réservations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;