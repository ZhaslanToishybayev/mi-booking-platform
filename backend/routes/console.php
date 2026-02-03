<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('model:prune', ['--model' => [
    App\Models\Booking::class,
]])->daily();
