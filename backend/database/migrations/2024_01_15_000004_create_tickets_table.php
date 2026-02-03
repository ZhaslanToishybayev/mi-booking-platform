<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('ticket_type');
            $table->string('seat_number', 50)->nullable();
            $table->decimal('price', 10, 2);
            $table->string('qr_code', 255)->unique();
            $table->enum('status', ['active', 'used', 'cancelled'])->default('active');
            $table->timestamps();

            $table->index('qr_code');
            $table->index(['booking_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
