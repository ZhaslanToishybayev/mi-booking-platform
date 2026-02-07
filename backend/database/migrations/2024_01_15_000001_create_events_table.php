<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('image_url', 500)->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('start_date');
            $table->index(['status', 'start_date']);
        });

        DB::statement("ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('active', 'cancelled', 'completed'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check");
        Schema::dropIfExists('events');
    }
};
