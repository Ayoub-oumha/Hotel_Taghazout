<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
         
        $validated = Validator::make( $request->all(),[ 'room_id' => 'required|exists:rooms,id',
        'check_in_date' => 'required|date|after_or_equal:today',
        'check_out_date' => 'required|date|after:check_in_date',]) ;

        if($validated->fails()){
            return response()->json(["message" => "error" , "error" => $validated->errors()] ,422 ) ;

        }
    
        $room = Room::findOrFail($request->room_id);
       
        $checkIn = new \DateTime($request->check_in_date);
        $checkOut = new \DateTime($request->check_out_date);
        $days = $checkIn->diff($checkOut)->days;
        // return response()->json(["mea" => $checkIn]);
        
        
        $totalPrice = $room->price_per_night * $days;

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'room_id' =>$request->room_id,
            'check_in_date' =>$request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'total_price' => $totalPrice,
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation created successfully',
            'data' => $reservation
        ], 201);
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

}
