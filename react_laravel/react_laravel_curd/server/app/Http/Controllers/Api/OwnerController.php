<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Owner;

class OwnerController extends Controller
{
    public function index()
    {
        return response()->json(
            Owner::select('id', 'name')->get()
        );
    }
}