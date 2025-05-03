<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('room_number')->unique();
            $table->enum('type', ['standard', 'deluxe', 'suite', 'family', 'executive']);
            $table->text('description')->nullable();
            $table->decimal('price_per_night', 10, 2);
            $table->integer('capacity');
            $table->boolean('has_air_conditioning')->default(true);
            $table->boolean('has_wifi')->default(true);
            $table->boolean('has_tv')->default(true);
            $table->boolean('has_minibar')->default(false);
            $table->boolean('has_balcony')->default(false);
            $table->boolean('has_sea_view')->default(false);
            $table->boolean('is_available')->default(true);
            $table->json('amenities')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
