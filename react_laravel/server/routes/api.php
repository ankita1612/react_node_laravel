<?php
use App\Http\Controllers\AuthController;
//dd(1)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/registration', [AuthController::class, 'registration']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});