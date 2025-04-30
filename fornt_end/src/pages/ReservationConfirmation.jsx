import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaCheckCircle, FaArrowLeft, FaDownload, FaEnvelope } from 'react-icons/fa';

const ReservationConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      // Vérifier si nous avons les informations nécessaires
      const reservationId = location.state?.reservationId;
      const paymentSuccess = location.state?.paymentSuccess;

      if (!reservationId || !paymentSuccess) {
        setError('Informations de réservation manquantes.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/reservations/${reservationId}`);
        if (response.data.success) {
          setReservation(response.data.reservation);
        } else {
          setError(response.data.message || 'Impossible de charger les détails de la réservation.');
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la réservation:', err);
        setError('Une erreur est survenue lors du chargement des détails de la réservation.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [location.state]);

  const calculateNights = () => {
    if (!reservation) return 0;
    
    const checkIn = new Date(reservation.check_in_date);
    const checkOut = new Date(reservation.check_out_date);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Fonction simulée pour télécharger le reçu
  const handleDownloadReceipt = () => {
    alert('La fonction de téléchargement du reçu sera disponible prochainement.');
  };

  // Fonction simulée pour envoyer le reçu par email
  const handleSendEmail = () => {
    alert('La fonction d\'envoi par email sera disponible prochainement.');
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

  if (!reservation) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md max-w-md text-center">
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Informations manquantes</h3>
          <p className="text-gray-700">Aucune réservation trouvée.</p>
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
        <span className="text-[#7C6A46]">Confirmation de réservation</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="bg-green-50 p-8 rounded-lg shadow-lg mb-8 text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">Réservation confirmée !</h1>
          <p className="text-gray-700 text-lg mb-4">
            Votre paiement a été traité avec succès et votre réservation est confirmée.
          </p>
          <p className="text-gray-500 mb-4">
            Un email de confirmation a été envoyé à votre adresse email.
          </p>
          <p className="font-medium">
            Numéro de réservation: <span className="text-[#7C6A46]">#{reservation.id}</span>
          </p>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 bg-[#7C6A46] text-white">
            <h2 className="text-2xl font-bold">Détails de la réservation</h2>
          </div>
          
          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-xl font-semibold mb-2">{reservation.room?.name || 'Chambre'}</h3>
              <p className="text-gray-600">{reservation.room?.type || 'Standard'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700">Dates du séjour</h4>
                <p className="text-gray-600">Du {new Date(reservation.check_in_date).toLocaleDateString('fr-FR')}</p>
                <p className="text-gray-600">Au {new Date(reservation.check_out_date).toLocaleDateString('fr-FR')}</p>
                <p className="text-gray-600">{calculateNights()} nuits</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Informations client</h4>
                <p className="text-gray-600">{reservation.user?.name || 'Client'}</p>
                <p className="text-gray-600">{reservation.user?.email || 'Email non disponible'}</p>
                <p className="text-gray-600">{reservation.number_of_guests} {reservation.number_of_guests > 1 ? 'personnes' : 'personne'}</p>
              </div>
            </div>
            
            {reservation.special_requests && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700">Demandes spéciales</h4>
                <p className="text-gray-600">{reservation.special_requests}</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Résumé du paiement</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix par nuit:</span>
                  <span>{reservation.room?.price_per_night || 0} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre de nuits:</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de service:</span>
                  <span>{Math.round(reservation.total_price * 0.1)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes:</span>
                  <span>{Math.round(reservation.total_price * 0.2)} MAD</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total payé:</span>
                  <span>{reservation.total_price} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button 
            onClick={handleDownloadReceipt}
            className="flex-1 bg-white border border-[#7C6A46] text-[#7C6A46] py-3 px-4 rounded-md shadow hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FaDownload /> Télécharger le reçu
          </button>
          <button 
            onClick={handleSendEmail}
            className="flex-1 bg-white border border-[#7C6A46] text-[#7C6A46] py-3 px-4 rounded-md shadow hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FaEnvelope /> Envoyer par email
          </button>
        </div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="text-[#7C6A46] flex items-center gap-2 hover:underline"
        >
          <FaArrowLeft /> Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ReservationConfirmation;