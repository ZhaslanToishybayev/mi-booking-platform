<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Repositories\BookingRepository;
use App\Repositories\EventRepository;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService,
        private BookingRepository $bookingRepository,
        private EventRepository $eventRepository,
    ) {}

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $event = $this->eventRepository->findById($request->input('event_id'));

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        if (!$event->isActive()) {
            return response()->json(['message' => 'Event is not active'], 410);
        }

        try {
            $booking = $this->bookingService->createBooking($event, $request->validated());

            return response()->json(
                new BookingResource($booking->load(['event', 'tickets'])),
                201
            );
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(string $token): JsonResponse
    {
        $booking = $this->bookingRepository->findByToken($token);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        return response()->json(new BookingResource($booking));
    }

    public function cancel(string $token): JsonResponse
    {
        try {
            $booking = $this->bookingService->cancelBooking($token);

            return response()->json([
                'message' => 'Booking cancelled successfully',
                'booking' => new BookingResource($booking),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
