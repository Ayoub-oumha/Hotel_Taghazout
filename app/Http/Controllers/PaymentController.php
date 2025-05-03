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
       
        $reservation->update(['status' => 'cancelled']);

        
        return response()->json([
            'status' => 'error',
            'message' => 'Payment was cancelled.',
            'data' => $reservation
        ]);
    }  
        public function createPaymentIntent(Request $request)
        {
            $request->validate([
                'reservation_id' => 'required|exists:reservations,id',
            ]);
        
            try {
                // Get the reservation
                $reservation = Reservation::findOrFail($request->reservation_id);
                
                // Set up Stripe API key
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                
                // Create a checkout session
                $session = \Stripe\Checkout\Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [[
                        'price_data' => [
                            'currency' => 'mad',
                            'product_data' => [
                                'name' => 'Reservation #' . $reservation->id,
                                'description' => 'Room booking from ' . $reservation->check_in_date . ' to ' . $reservation->check_out_date,
                            ],
                            'unit_amount' => $reservation->total_price * 100, // Stripe uses cents
                        ],
                        'quantity' => 1,
                    ]],
                    'mode' => 'payment',
                    'success_url' => route('payment.success', ['reservation' => $reservation->id]),
                    'cancel_url' => route('payment.cancel', ['reservation' => $reservation->id]),
                    'metadata' => [
                        'reservation_id' => $reservation->id
                    ]
                ]);
                
                // Create a payment record in the database
                $payment = Payment::create([
                    'reservation_id' => $reservation->id,
                    'payment_method' => 'stripe',
                    'stripe_payment_id' => $session->id,
                    'amount' => $reservation->total_price,
                    'payment_status' => 'pending',
                ]);
        
                return response()->json([
                    'success' => true,
                    'payment_url' => $session->url,
                    'payment_id' => $payment->id
                ]);
            } catch (\Exception $e) {
                Log::error('Payment link creation failed: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'An error occurred while creating the payment link: ' . $e->getMessage()
                ], 500);
            }
        }
        
         // public function confirmPayment(Request $request)
            // {
            //     $request->validate([
            //         'payment_id' => 'required|exists:payments,id',
            //         'payment_intent_id' => 'required|string'
            //     ]);
        
            //     try {
            //         $payment = Payment::findOrFail($request->payment_id);
                    
            //         // Confirm the payment status with Stripe
            //         $result = Payment::confirmStripePayment($request->payment_intent_id);
                    
            //         if ($result['success'] && $result['status'] === 'succeeded') {
            //             $payment->markAsPaid();
                        
            //             // Update the reservation status
            //             $reservation = $payment->reservation;
            //             $reservation->status = 'confirmed';  // Assuming there's a status field
            //             $reservation->save();
                        
            //             return response()->json([
            //                 'success' => true,
            //                 'message' => 'Payment successful',
            //             ]);
            //         }
                    
            //         return response()->json([
            //             'success' => false,
            //             'message' => 'Payment not successful: ' . ($result['status'] ?? 'Unknown status'),
            //         ]);
            //     } catch (\Exception $e) {
            //         Log::error('Payment confirmation failed: ' . $e->getMessage());
            //         return response()->json([
            //             'success' => false,
            //             'message' => 'An error occurred during payment confirmation: ' . $e->getMessage()
            //         ], 500);
            //     }
            // }
    
}