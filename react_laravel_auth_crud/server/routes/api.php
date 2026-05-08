<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
// Public auth routes
Route::withoutMiddleware('auth:sanctum')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'registration']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('employee', EmployeeController::class);
});

