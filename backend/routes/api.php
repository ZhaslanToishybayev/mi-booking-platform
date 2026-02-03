<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PdfController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Health check
    Route::get('/health-check', function () {
        return response()->json(['status' => 'ok']);
    });

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::get('/events/{event}/availability', [EventController::class, 'availability']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{token}', [BookingController::class, 'show']);
    Route::post('/bookings/{token}/cancel', [BookingController::class, 'cancel']);

    // PDF
    Route::get('/bookings/{token}/pdf', [PdfController::class, 'bookingPdf']);
    Route::get('/bookings/{token}/tickets/{ticket}/pdf', [PdfController::class, 'ticketPdf']);
});

// Note: Rate limiting can be enabled in production by adding throttle middleware:
// Route::middleware('throttle:bookings')->group(function () { ... });
// Make sure CACHE_DRIVER is set to redis/memcached in production for rate limiting
