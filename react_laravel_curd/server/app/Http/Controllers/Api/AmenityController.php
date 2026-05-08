<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;

class AmenityController extends Controller
{
    public function index()
    {
        return response()->json(
            Amenity::select('id', 'name')->get()
        );
    }
}