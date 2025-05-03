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
use Stripe\Checkout\Session as StripeSession;

class ReservationController extends Controller
{
    public function index()
    {
        // reservation of user with data of room
        $reservations = Auth::user()->reservations()->with('room')->get();
        // $reservations = Auth::user()->load('reservations.room');
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
    ]);

    if ($validated->fails()) {
        return response()->json(["message" => "error", "error" => $validated->errors()], 422);
    }

    $room = Room::findOrFail($request->room_id);
    
    $checkIn = new \DateTime($request->check_in_date);
    $checkOut = new \DateTime($request->check_out_date);
    $days = $checkIn->diff($checkOut)->days;
    
    $totalPrice = $room->price_per_night * $days;

    // Create reservation
    $reservation = Reservation::create([
        'user_id' => Auth::id(),
        'room_id' => $request->room_id,
        'check_in_date' => $request->check_in_date,
        'check_out_date' => $request->check_out_date,
        'total_price' => $totalPrice,
        'status' => 'pending'
    ]);

    // Stripe
    Stripe::setApiKey(env('STRIPE_SECRET'));

    $checkoutSession = StripeSession::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'mad',
                'product_data' => [
                    'name' => 'Réservation chambre #' . $room->id,
                    'description' => 'Du ' . $checkIn->format('d/m/Y') . ' au ' . $checkOut->format('d/m/Y'),
                ],
                'unit_amount' => $totalPrice * 100, // en centimes
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

    return response()->json([
        'status' => 'success',
        'message' => 'Réservation créée. Redirection vers Stripe...',
        'payment_url' => $checkoutSession->url,
        'data' => $reservation
    ]);
}

    public function update(Request $request, string $id)
    {
        
        $reservation = Reservation::find($id);
        if(!$reservation){
            return response()->json(["error" => "reservation not found"] ,404) ;
        }
        
        
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
    // public function cancel(string $id)
    // {
    //     $reservation = Reservation::findOrFail($id);
        
       
    //     if (Auth::id() !== $reservation->user_id && !Auth::user()->isAdmin()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Unauthorized'
    //         ], 403);
    //     }
        
    //     $reservation->update(['status' => 'cancelled']);
        
    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Reservation cancelled successfully',
    //         'data' => $reservation
    //     ]);
    // }
    // public function confirm(string $id)
    // {
    //     $reservation = Reservation::findOrFail($id);
        
        
    //     if (!Auth::user()->isAdmin()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Unauthorized'
    //         ], 403);
    //     }
        
    //     $reservation->update(['status' => 'confirmed']);
        
    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Reservation confirmed successfully',
    //         'data' => $reservation
    //     ]);
    // }
    // public function complete(string $id)
    // {
    //     $reservation = Reservation::findOrFail($id);
        
        
    //     if (!Auth::user()->isAdmin()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Unauthorized'
    //         ], 403);
    //     }
        
    //     $reservation->update(['status' => 'confirmed']);
        
    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Reservation marked as completed',
    //         'data' => $reservation
    //     ]);
    // }
    // SHOW reservation of user with id of user
    public function myReservation(){
        $userId = Auth::user()->id;
        
        $reservations = Reservation::where('user_id', $userId)
            ->with('room')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $reservations
        ]);
    }

public function dashboardAdmin()
{

    $totalReservations = Reservation::count();
    

    $pendingReservations = Reservation::where('status', 'pending')->count();
    $confirmedReservations = Reservation::where('status', 'confirmed')->count();
    $cancelledReservations = Reservation::where('status', 'cancelled')->count();
    $completedReservations = Reservation::where('status', 'confirmed')->count();
    
    $totalRevenue = Reservation::where('status', 'confirmed')->sum('total_price');
    

    $currentMonthRevenue = Reservation::where('status', 'completed')
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->sum('total_price');
    
    $totalRooms = \App\Models\Room::count();

    $tableColumns = \Schema::getColumnListing('reservations');
    
    $checkInOptions = ['check_in', 'checkin', 'check_in_date', 'date_start', 'start_date', 'from_date'];
    $checkOutOptions = ['check_out', 'checkout', 'check_out_date', 'date_end', 'end_date', 'to_date'];
    
    $checkInColumn = null;
    $checkOutColumn = null;
    
    foreach ($checkInOptions as $column) {
        if (in_array($column, $tableColumns)) {
            $checkInColumn = $column;
            break;
        }
    }
    
    foreach ($checkOutOptions as $column) {
        if (in_array($column, $tableColumns)) {
            $checkOutColumn = $column;
            break;
        }
    }
    
    // If we found the correct column names, use them for the query
    $occupiedRooms = 0;
    if ($checkInColumn && $checkOutColumn) {
        $occupiedRooms = Reservation::where('status', 'confirmed')
            ->whereDate($checkInColumn, '<=', now())
            ->whereDate($checkOutColumn, '>=', now())
            ->count();
    } else {
        // Fallback: just count confirmed reservations
        $occupiedRooms = Reservation::where('status', 'confirmed')->count();
    }
    
    // Get total users count
    $totalUsers = \App\Models\User::count();
    
    // Recent reservations (last 5)
    $recentReservations = Reservation::with('user', 'room')
        ->orderBy('created_at', 'desc')
        ->get();
    
    // Monthly revenue for the last 6 months
    // $monthlyRevenue = [];
    // for ($i = 5; $i >= 0; $i--) {
    //     $month = now()->subMonths($i);
    //     $revenue = Reservation::where('status', 'confirmed')
    //         ->whereMonth('created_at', $month->month)
    //         ->whereYear('created_at', $month->year)
    //         ->sum('total_price');
            
    //     $monthlyRevenue[] = [
    //         'month' => $month->format('M Y'),
    //         'revenue' => $revenue
    //     ];
    // }

    return response()->json([
        'reservations' => [
            'total' => $totalReservations,
            'pending' => $pendingReservations,
            'confirmed' => $confirmedReservations,
            'cancelled' => $cancelledReservations,
            'completed' => $completedReservations,
        ],
        'revenue' => [
            'total' => $totalRevenue,
            'current_month' => $currentMonthRevenue,
            // 'monthly_data' => $monthlyRevenue,
        ],
        'rooms' => [
            'total' => $totalRooms,
            'occupied' => $occupiedRooms,
            'available' => $totalRooms - $occupiedRooms,
            'occupancy_rate' => $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 2) : 0,
        ],
        'users' => [
            'total' => $totalUsers,
        ],
        'recent_reservations' => $recentReservations,
    ]);
}
public function getBookedDates(Room $room)
{
    $bookings = Reservation::where('room_id', $room->id)
                  ->where('status', 'confirmed')
                  ->orWhere('status', 'pending')
                  ->where('check_out_date', '>=', now())
                  ->get(['check_in_date', 'check_out_date']);
                  
    return response()->json([
        'bookings' => $bookings
    ]);
}

}
