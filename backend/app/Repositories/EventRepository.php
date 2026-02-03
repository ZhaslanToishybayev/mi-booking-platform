<?php

namespace App\Repositories;

use App\Models\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EventRepository
{
    public function getActiveEvents(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Event::with('ticketTypes')
            ->active()
            ->upcoming()
            ->orderBy('start_date');

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->byDateRange($filters['date_from'], $filters['date_to']);
        }

        if (!empty($filters['location'])) {
            $query->byLocation($filters['location']);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Event
    {
        return Event::with('ticketTypes')->find($id);
    }

    public function getAvailability(int $eventId): array
    {
        $event = $this->findById($eventId);

        if (!$event) {
            return [];
        }

        return [
            'event_id' => $event->id,
            'available' => $event->hasAvailableTickets(),
            'ticket_types' => $event->ticketTypes->map(fn ($type) => [
                'type_id' => $type->id,
                'name' => $type->name,
                'available' => $type->available,
                'price' => $type->price,
            ])->toArray(),
        ];
    }
}
