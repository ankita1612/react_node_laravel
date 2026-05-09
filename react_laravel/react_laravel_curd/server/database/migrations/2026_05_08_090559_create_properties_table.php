<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('property_name');
            $table->text('property_detail');
            $table->enum('property_type', [
                'Residential',
                'Commercial'
            ]);
            $table->string('property_size')->nullable();
            $table->foreignId('owner_id')
                ->constrained('owners');
            $table->text('property_address');
            $table->string('brochure')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
