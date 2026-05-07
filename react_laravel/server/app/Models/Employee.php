<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'salary',
        'age',
        'dob',
        'DOJ',
        'description',
        'profile_image',
        'logo',
        'hobbies',
        'status',
    ];
}