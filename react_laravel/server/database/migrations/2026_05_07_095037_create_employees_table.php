<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {

            $table->id();

            $table->string('first_name');

            $table->string('last_name')->nullable();

            $table->decimal('salary', 10, 2);

            $table->integer('age')->nullable();

            $table->date('dob');

            $table->date('DOJ')->nullable();

            $table->text('description');

            $table->string('profile_image');

            $table->string('logo')->nullable();

            $table->enum('hobbies', [
                'Cricket',
                'Football',
                'Basket ball'
            ])->default('Football');

            $table->enum('status', [
                'active',
                'inactive'
            ])->default('active');

            $table->softDeletes();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};