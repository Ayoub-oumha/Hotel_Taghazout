<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class RoomsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::all();
        return response()->json([
            'status' => true,
            'rooms' => $rooms
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd("hello") ;
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'room_number' => 'required|string|unique:rooms,room_number',
            'type' => 'required|in:standard,deluxe,suite,family,executive',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'has_air_conditioning' => 'boolean',
            'has_wifi' => 'boolean',
            'has_tv' => 'boolean',
            'has_minibar' => 'boolean',
            'has_balcony' => 'boolean',
            'has_sea_view' => 'boolean',
            'is_available' => 'boolean',
            'amenities' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $roomData = $request->except('image');
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            
            // Make sure the directory exists
            $directory = public_path('storage/rooms');
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }
            
            // Save the file directly to the public storage path
            $image->move($directory, $imageName);
            $roomData['image'] = 'rooms/' . $imageName;
        }

        $room = Room::create($roomData);

        return response()->json([
            'status' => true,
            'message' => 'Room created successfully',
            'room' => $room
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::find($id);
        
        if (!$room) {
            return response()->json([
                'status' => false,
                'message' => 'Room not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'room' => $room
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
       
        $room = Room::find($id);
        
        if (!$room) {
            return response()->json([
                'status' => false,
                'message' => 'Room not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'room_number' => 'string|unique:rooms,room_number,' . $id,
            'type' => 'in:standard,deluxe,suite,family,executive',
            'description' => 'nullable|string',
            'price_per_night' => 'numeric|min:0',
            'capacity' => 'integer|min:1',
            'has_air_conditioning' => 'boolean',
            'has_wifi' => 'boolean',
            'has_tv' => 'boolean',
            'has_minibar' => 'boolean',
            'has_balcony' => 'boolean',
            'has_sea_view' => 'boolean',
            'is_available' => 'boolean',
            'amenities' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $roomData = $request->except('image');
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($room->image) {
                $oldImagePath = public_path('storage/' . $room->image);
                if (File::exists($oldImagePath)) {
                    File::delete($oldImagePath);
                }
            }
            
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            
            // Make sure the directory exists
            $directory = public_path('storage/rooms');
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }
            
            // Save the file directly to the public storage path
            $image->move($directory, $imageName);
            $roomData['image'] = 'rooms/' . $imageName;
        }

        $room->update($roomData);

        return response()->json([
            'status' => true,
            'message' => 'Room updated successfully',
            'room' => $room
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $room = Room::find($id);
        
        if (!$room) {
            return response()->json([
                'status' => false,
                'message' => 'Room not found'
            ], 404);
        }

        // Delete room image if exists
        if ($room->image) {
            $imagePath = public_path('storage/' . $room->image);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }
        }

        $room->delete();

        return response()->json([
            'status' => true,
            'message' => 'Room deleted successfully'
        ]);
    }
}
