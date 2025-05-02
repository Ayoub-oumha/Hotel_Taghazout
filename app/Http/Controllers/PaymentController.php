<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function success(Request $request, Reservation $reservation)
    {
        $reservation->update(['status' => 'confirmed']);
        
        Payment::create([
            'reservation_id' => $reservation->id,
            'payment_method' => 'stripe', 
            'stripe_payment_id' => $request->get('payment_intent', null),
            'amount' => $reservation->total_price,
            'payment_status' => 'paid', // Changed from 'completed' to 'paid' to match enum
            'payment_date' => now()
        ]);
        
        $reservationId = $reservation->id;
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        return redirect()->away("http://localhost:3000/my-reservations");
    }

    public function cancel(Request $request, Reservation $reservation)
    {
        // You might want to handle cancellations differently
        // For now, just mark it as cancelled
        $reservation->update(['status' => 'cancelled']);

        // If this is an API-only application
        return response()->json([
            'status' => 'error',
            'message' => 'Payment was cancelled.',
            'data' => $reservation
        ]);
        
        // If you have a frontend, you could redirect instead:
        // return redirect()->route('home')->with('error', 'Payment was cancelled.');
    }
}