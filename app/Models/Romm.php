<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'room_number',
        'type',
        'description',
        'price_per_night',
        'capacity',
        'has_air_conditioning',
        'has_wifi',
        'has_tv',
        'has_minibar',
        'has_balcony',
        'has_sea_view',
        'is_available',
        'amenities',
        'image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amenities' => 'array',
        'price_per_night' => 'float',
        'capacity' => 'integer',
        'has_air_conditioning' => 'boolean',
        'has_wifi' => 'boolean',
        'has_tv' => 'boolean',
        'has_minibar' => 'boolean',
        'has_balcony' => 'boolean',
        'has_sea_view' => 'boolean',
        'is_available' => 'boolean',
    ];
}
