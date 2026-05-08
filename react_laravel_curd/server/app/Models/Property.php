<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'property_name',
        'property_detail',
        'property_type',
        'property_size',
        'owner_id',
        'property_address',
        'brochure',
    ];

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function photos()
    {
        return $this->hasMany(PropertyPhoto::class);
    }
}