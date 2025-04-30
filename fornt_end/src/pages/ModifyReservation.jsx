import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

function ModifyReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({
    check_in_date: '',
    check_out_date: '',
    guests: 1
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReservation();
  }, [id]);

  const fetchReservation = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reservations/${id}`);
      setReservation(response.data);
      
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        check_in_date: formatDateForInput(response.data.check_in_date),
        check_out_date: formatDateForInput(response.data.check_out_date),
        guests: response.data.room.capacity // Using room capacity as default guests
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération de la réservation:', err);
      setError('Impossible de charger les détails de la réservation. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'guests' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.put(`/reservations/${id}`, formData);
      alert('Réservation modifiée avec succès');
      navigate('/my-reservations');
    } catch (err) {
      console.error('Erreur lors de la modification de la réservation:', err);
      const errorMessage = err.response?.data?.message || 'Une erreur s\'est produite lors de la modification de la réservation.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/my-reservations')} 
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Retour aux réservations
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Réservation non trouvée.</p>
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/my-reservations')} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Retour aux réservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Modifier la réservation</h1>
      
      <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {reservation.room && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Chambre: {reservation.room.name}</h2>
            <p className="text-gray-600">Type: {reservation.room.type}</p>
            <p className="text-gray-600">Prix par nuit: {reservation.room.price_per_night} MAD</p>
            <p className="text-gray-600">Capacité: {reservation.room.capacity} personnes</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="check_in_date">
              Date d'arrivée
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="check_in_date"
              type="date"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="check_out_date">
              Date de départ
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="check_out_date"
              type="date"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guests">
              Nombre de personnes
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="guests"
              type="number"
              name="guests"
              min="1"
              max={reservation.room?.capacity || 10}
              value={formData.guests}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            <button
              onClick={() => navigate('/my-reservations')}
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifyReservation;