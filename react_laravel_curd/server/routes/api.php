<?php
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\OwnerController;
use App\Http\Controllers\Api\PropertyController;

Route::apiResource(
    'property',
    PropertyController::class
);

Route::get(
    'owners',
    [OwnerController::class, 'index']
);

Route::get(
    'amenities',
    [AmenityController::class, 'index']
);