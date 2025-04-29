<?php

use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomsController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/rooms', [RoomsController::class, 'index']);
Route::get('/rooms/{id}', [RoomsController::class, 'show']);

// Protected routes
Route::middleware( 'auth:sanctum' ,'role:admin')->group(function () {
    Route::post('/rooms', [RoomsController::class, 'store']);
    Route::put('/rooms/{id}', [RoomsController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomsController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
});
// Reservation API Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('reservations', ReservationController::class);
    Route::post('reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::post('reservations/{id}/confirm', [ReservationController::class, 'confirm']);
    Route::post('reservations/{id}/complete', [ReservationController::class, 'complete']);
});

Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);

Route::get('/payment/success', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Paiement traité avec succès'
    ]);
})->name('payment.success');
// Route::apiResource('users' , UserController::class);
// Route::get('/test' , [UserController::class , 'index']) ;