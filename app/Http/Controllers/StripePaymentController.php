<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripePaymentController extends Controller
{
    /**
     * Create a new payment intent
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
        ]);

        try {
            // Get the reservation
            $reservation = Reservation::findOrFail($request->reservation_id);
            
            // Create a new payment intent with Stripe
            $paymentIntent = Payment::createStripePaymentIntent(
                $reservation->total_price, 
                'eur', 
                [
                    'reservation_id' => $reservation->id,
                    'customer_name' => auth()->user()->name ?? 'Guest',
                    'customer_email' => auth()->user()->email ?? '',
                ]
            );

            if (!$paymentIntent['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create payment intent: ' . $paymentIntent['message']
                ], 422);
            }

            // Create a payment record in the database
            $payment = Payment::create([
                'reservation_id' => $reservation->id,
                'payment_method' => 'stripe',
                'stripe_payment_id' => $paymentIntent['id'],
                'amount' => $reservation->total_price,
                'payment_status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent['client_secret'],
                'payment_id' => $payment->id
            ]);
        } catch (\Exception $e) {
            Log::error('Payment creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Stripe webhook
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);

            // Handle the event
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $paymentIntent = $event->data->object;
                    $this->handleSuccessfulPayment($paymentIntent);
                    break;
                case 'payment_intent.payment_failed':
                    $paymentIntent = $event->data->object;
                    $this->handleFailedPayment($paymentIntent);
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Process successful payments from Stripe webhook
     *
     * @param object $paymentIntent
     */
    private function handleSuccessfulPayment($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_id', $paymentIntent->id)->first();
        if ($payment) {
            $payment->markAsPaid();
            
            // Update the reservation status
            $reservation = $payment->reservation;
            $reservation->status = 'confirmed'; // Assuming there's a status field
            $reservation->save();
            
            Log::info('Payment successful for reservation #' . $payment->reservation_id);
        }
    }

    /**
     * Process failed payments from Stripe webhook
     *
     * @param object $paymentIntent
     */
    private function handleFailedPayment($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_id', $paymentIntent->id)->first();
        if ($payment) {
            $payment->markAsFailed();
            Log::info('Payment failed for reservation #' . $payment->reservation_id);
        }
    }

    /**
     * Confirm payment status (client-side)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'payment_intent_id' => 'required|string'
        ]);

        try {
            $payment = Payment::findOrFail($request->payment_id);
            
            // Confirm the payment status with Stripe
            $result = Payment::confirmStripePayment($request->payment_intent_id);
            
            if ($result['success'] && $result['status'] === 'succeeded') {
                $payment->markAsPaid();
                
                // Update the reservation status
                $reservation = $payment->reservation;
                $reservation->status = 'confirmed';  // Assuming there's a status field
                $reservation->save();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful',
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Payment not successful: ' . ($result['status'] ?? 'Unknown status'),
            ]);
        } catch (\Exception $e) {
            Log::error('Payment confirmation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during payment confirmation: ' . $e->getMessage()
            ], 500);
        }
    }
}
