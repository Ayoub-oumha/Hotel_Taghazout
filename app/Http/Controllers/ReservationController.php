<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Auth::user()->reservations()->latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $reservations
        ]);
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'payment_method_id' => 'required|string', // Ajout du payment_method_id pour Stripe
        ]);

        if($validated->fails()){
            return response()->json(["message" => "error", "error" => $validated->errors()], 422);
        }

        $room = Room::findOrFail($request->room_id);
       
        $checkIn = new \DateTime($request->check_in_date);
        $checkOut = new \DateTime($request->check_out_date);
        $days = $checkIn->diff($checkOut)->days;
        
        $totalPrice = $room->price_per_night * $days;
        
        try {
            // Initialiser Stripe avec votre clé secrète
            Stripe::setApiKey(config('services.stripe.secret'));
    
            // Créer un PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $totalPrice * 100, // Le montant est en centimes
                'currency' => 'eur', // Changer selon votre devise
                'payment_method' => $request->payment_method_id,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'return_url' => route('payment.success'), // Ajoutez cette ligne
                'description' => 'Réservation chambre ' . $room->name . ' du ' . $request->check_in_date . ' au ' . $request->check_out_date,
                'metadata' => [
                    'user_id' => Auth::id(),
                    'room_id' => $request->room_id,
                ],
            ]);
            
            // Si le paiement nécessite une authentification supplémentaire
            if ($paymentIntent->status === 'requires_action' && 
                $paymentIntent->next_action->type === 'use_stripe_sdk') {
                return response()->json([
                    'requires_action' => true,
                    'payment_intent_client_secret' => $paymentIntent->client_secret,
                ]);
            }
            
            // Si le paiement a échoué
            if ($paymentIntent->status !== 'succeeded') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Paiement échoué'
                ], 400);
            }
            
            // Paiement réussi, créer la réservation
            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'room_id' => $request->room_id,
                'check_in_date' => $request->check_in_date,
                'check_out_date' => $request->check_out_date,
                'total_price' => $totalPrice,
                'status' => 'confirmed', // Directement confirmé car paiement effectué
                'payment_id' => $paymentIntent->id, // Stocker l'ID du paiement Stripe
                'payment_status' => 'paid'
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Réservation créée et payée avec succès',
                'data' => $reservation
            ], 201);
        } catch (ApiErrorException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur de paiement: ' . $e->getMessage()
            ], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        
        $reservation = Reservation::find($id);
        if(!$reservation){
            return response()->json(["error" => "reservation not found"] ,404) ;
        }
        
        // Check if user owns this reservation or is admin
        if (Auth::id() !== $reservation->user_id && !Auth::user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }
        
        $validated = $request->validate([
            'room_id' => 'sometimes|required|exists:rooms,id',
            'check_in_date' => 'sometimes|required|date|after_or_equal:today',
            'check_out_date' => 'sometimes|required|date|after:check_in_date',
            'status' => 'sometimes|required|in:pending,confirmed,cancelled,completed',
        ]);

        if (isset($validated['room_id']) || isset($validated['check_in_date']) || isset($validated['check_out_date'])) {
            $room = Room::findOrFail($validated['room_id'] ?? $reservation->room_id);
            
            // Calculate number of days
            $checkIn = new \DateTime($validated['check_in_date'] ?? $reservation->check_in_date);
            $checkOut = new \DateTime($validated['check_out_date'] ?? $reservation->check_out_date);
            $days = $checkIn->diff($checkOut)->days;
            
            // Calculate total price
            $totalPrice = $room->price_per_night * $days;
            $validated['total_price'] = $totalPrice;
        }

        $reservation->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation updated successfully',
            'data' => $reservation
        ]);
    }

    public function destroy(string $id)
    {
        
        $reservation = Reservation::find($id);
        if(!$reservation){
            return response()->json(["message"=> "error" , "reservvation with this id not $id found"] ,404) ;
        }
        
        // Check if user owns this reservation or is admin
        if (Auth::id() !== $reservation->user_id && !Auth::user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $reservation->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation deleted successfully'
        ]);
    }
    public function cancel(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        
       
        if (Auth::id() !== $reservation->user_id && !Auth::user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }
        
        $reservation->update(['status' => 'cancelled']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Reservation cancelled successfully',
            'data' => $reservation
        ]);
    }
    public function confirm(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        
        // Usually only admins can confirm
        if (!Auth::user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }
        
        $reservation->update(['status' => 'confirmed']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Reservation confirmed successfully',
            'data' => $reservation
        ]);
    }
    public function complete(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        
        
        if (!Auth::user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }
        
        $reservation->update(['status' => 'completed']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Reservation marked as completed',
            'data' => $reservation
        ]);
    }

}
