<?php

use App\Http\Controllers\RoomsController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware ;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
// Route::post('/register' , [UserController::class , "register"])->name("register") ;
// Route::post('/login' , [UserController::class , "login"])->name("login") ;
// Route::post('/logout', [UserController::class, "logout"])->name("logout") ;

    












    
    // Route::middleware([ "role:admin"])->group(function () {
    //     Route::get('/rooms', [RoomsController::class, 'index']);
    // });

    // Route::middleware([ RoleMiddleware::class . ':admin'])->group(function () {
    //     Route::get('/rooms', [RoomsController::class, 'index']);
    // });


// Route::get("/rooms" , [RoomsController::class , "index"])->middleware(["admin"]) ;
// Route::get("/users" , [UserController::class , "index"]) ;