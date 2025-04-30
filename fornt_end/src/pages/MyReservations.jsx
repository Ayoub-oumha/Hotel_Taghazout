import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useReservationCart } from '../context/ReservationCartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useReservationCart();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reservations');
      // Response data structure changed to match the API
      setReservations(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des réservations:', err);
      setError('Impossible de charger vos réservations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      setCancelingId(id);
      try {
        await api.put(`/reservations/${id}/cancel`);
        // Mettre à jour l'état local
        setReservations(reservations.map(reservation => 
          reservation.id === id ? { ...reservation, status: 'Annulée' } : reservation
        ));
        toast.success('Réservation annulée avec succès');
      } catch (err) {
        console.error('Erreur lors de l\'annulation:', err);
        toast.error('Impossible d\'annuler la réservation. Veuillez réessayer.');
      } finally {
        setCancelingId(null);
      }
    }
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?')) {
      setDeletingId(id);
      try {
        await api.delete(`/reservations/${id}`);
        // Supprimer de l'état local
        setReservations(reservations.filter(reservation => reservation.id !== id));
        toast.success('Réservation supprimée avec succès');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast.error('Impossible de supprimer la réservation. Veuillez réessayer.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleModifyReservation = (id) => {
    navigate(`/modify-reservation/${id}`);
  };

  const handleAddToCart = (reservation) => {
    setAddingToCartId(reservation.id);
    try {
      const result = addToCart(reservation);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.info(result.message);
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      toast.error('Impossible d\'ajouter la réservation au panier');
    } finally {
      setAddingToCartId(null);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-5" role="alert">{error}</div>;
 
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-3xl font-bold text-center mb-8">Mes Réservations</h1>
      
      {reservations.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-4">Vous n'avez aucune réservation pour le moment.</p>
          <Link to="/rooms" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Réserver une chambre
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
              {reservation.room?.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`http://localhost:8000/storage/${reservation.room.image}`} 
                    className="w-full h-full object-cover" 
                    alt={reservation.room.name} 
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">Chambre {reservation.room?.name || 'Non disponible'}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                    ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {reservation.status === 'pending' ? 'En attente' : 
                     reservation.status === 'confirmed' ? 'Confirmée' : 
                     reservation.status === 'cancelled' ? 'Annulée' : reservation.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Arrivée:</span> {formatDate(reservation.check_in_date)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Départ:</span> {formatDate(reservation.check_out_date)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Capacité:</span> {reservation.room?.capacity} personnes
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Prix par nuit:</span> {reservation.room?.price_per_night} MAD
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Prix Total:</span> {reservation.total_price} MAD
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {reservation.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => handleModifyReservation(reservation.id)}
                        disabled={reservation.status === 'cancelled'}
                        className="flex-1 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                        Modifier
                      </button>
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        disabled={cancelingId === reservation.id || reservation.status === 'cancelled'}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-white text-sm py-2 px-3 rounded">
                        {cancelingId === reservation.id ? 'En cours...' : 'Annuler'}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteReservation(reservation.id)}
                    disabled={deletingId === reservation.id}
                    className="flex-1 bg-red-500 hover:bg-red-700 text-white text-sm py-2 px-3 rounded">
                    {deletingId === reservation.id ? 'En cours...' : 'Supprimer'}
                  </button>
                  <button
                    onClick={() => handleAddToCart(reservation)}
                    disabled={addingToCartId === reservation.id || reservation.status === 'cancelled'}
                    className="flex-1 bg-green-500 hover:bg-green-700 text-white text-sm py-2 px-3 rounded">
                    {addingToCartId === reservation.id ? 'En cours...' : 'Ajouter au panier'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;