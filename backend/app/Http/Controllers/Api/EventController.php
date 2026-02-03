<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventCollection;
use App\Http\Resources\EventResource;
use App\Repositories\EventRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(
        private EventRepository $eventRepository,
    ) {}

    public function index(Request $request): EventCollection
    {
        $filters = $request->only(['date_from', 'date_to', 'location']);
        $perPage = min($request->input('per_page', 10), 50);

        $events = $this->eventRepository->getActiveEvents($filters, $perPage);

        return new EventCollection($events);
    }

    public function show(int $event): JsonResponse
    {
        $event = $this->eventRepository->findById($event);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json(new EventResource($event));
    }

    public function availability(int $event): JsonResponse
    {
        $availability = $this->eventRepository->getAvailability($event);

        if (empty($availability)) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($availability);
    }
}
