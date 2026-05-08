<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Amenity::insert([
            ['name' => 'Parking'],
            ['name' => 'Swimming Pool'],
            ['name' => 'Garden'],
            ['name' => 'Gym'],
        ]);
    }
}
