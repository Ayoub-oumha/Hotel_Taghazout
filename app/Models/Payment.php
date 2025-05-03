<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stripe\StripeClient;
use Exception;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id', 'payment_method', 'stripe_payment_id', 'amount', 'payment_status', 'payment_date'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Create a Stripe payment intent
     *
     * @param float $amount Amount in your currency's smallest unit (e.g. cents for USD)
     * @param string $currency Currency code (e.g. 'usd', 'eur')
     * @param array $metadata Additional metadata for the payment
     * @return array Payment intent details or error message
     */
    public static function createStripePaymentIntent($amount, $currency = 'eur', $metadata = [])
    {
        try {
            $stripe = new StripeClient(config('services.stripe.secret'));
            
            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => $amount * 100, // Convert to cents
                'currency' => $currency,
                'metadata' => $metadata,
                'payment_method_types' => ['card'],
            ]);

            return [
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'id' => $paymentIntent->id
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Confirm a Stripe payment
     *
     * @param string $paymentIntentId The Stripe payment intent ID
     * @return array Status of the payment confirmation
     */
    public static function confirmStripePayment($paymentIntentId)
    {
        try {
            $stripe = new StripeClient(config('services.stripe.secret'));
            $paymentIntent = $stripe->paymentIntents->retrieve($paymentIntentId);

            if ($paymentIntent->status === 'succeeded') {
                return [
                    'success' => true,
                    'status' => $paymentIntent->status
                ];
            }

            return [
                'success' => false,
                'status' => $paymentIntent->status
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Update the payment record with Stripe payment ID
     *
     * @param string $stripePaymentId The Stripe payment ID
     * @return bool Success status
     */
    public function updateStripePaymentId($stripePaymentId)
    {
        $this->stripe_payment_id = $stripePaymentId;
        return $this->save();
    }

    /**
     * Process successful payment
     *
     * @return bool Success status
     */
    public function markAsPaid()
    {
        $this->payment_status = 'paid';
        $this->payment_date = now();
        return $this->save();
    }

    /**
     * Mark payment as failed
     *
     * @return bool Success status
     */
    public function markAsFailed()
    {
        $this->payment_status = 'failed';
        return $this->save();
    }
}
