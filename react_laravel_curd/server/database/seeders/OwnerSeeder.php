<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Owner;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Owner::insert([
            ['name' => 'John Doe'],
            ['name' => 'Michael Smith'],
            ['name' => 'David Johnson'],
        ]);
    }
}
