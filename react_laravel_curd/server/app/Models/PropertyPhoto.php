<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PropertyPhoto extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'property_id',
        'photo'
    ];
}
