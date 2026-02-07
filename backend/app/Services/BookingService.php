<?php

namespace App\Services;

use App\Exceptions\NotEnoughTicketsException;
use App\Models\Booking;
use App\Models\Event;
use App\Repositories\BookingRepository;
use App\Repositories\EventRepository;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private BookingRepository $bookingRepository,
        private EventRepository $eventRepository,
    ) {}

    public function createBooking(Event $event, array $data): Booking
    {
        // Some pooled PostgreSQL connections can remain in "aborted transaction"
        // state after a previous failed query. Reset before starting a new write tx.
        try {
            DB::unprepared('ROLLBACK');
        } catch (\Throwable) {
            // No active transaction to rollback.
        }

        return DB::transaction(function () use ($event, $data) {
            // Validate ticket availability
            $ticketTypes = $this->getEventTicketTypesFromEvent($event, $data['tickets']);
            $this->validateTicketAvailability($ticketTypes, $data['tickets']);

            // Calculate total amount
            $totalAmount = $this->calculateTotalAmount($ticketTypes, $data['tickets']);

            // Create booking
            $booking = $this->bookingRepository->create([
                'event_id' => $event->id,
                'email' => $data['email'],
                'name' => $data['name'],
                'phone' => $data['phone'] ?? null,
                'total_amount' => $totalAmount,
                'status' => 'confirmed',
            ]);

            // Decrease availability and create tickets
            $ticketsData = [];
            foreach ($data['tickets'] as $ticketRequest) {
                $ticketType = $ticketTypes[$ticketRequest['ticket_type_id']];
                $ticketType->decreaseAvailability($ticketRequest['quantity']);

                $ticketsData[] = [
                    'ticket_type' => $this->normalizeTicketType($ticketType->name),
                    'price' => $ticketType->price,
                    'quantity' => $ticketRequest['quantity'],
                ];
            }

            // Create tickets
            $this->bookingRepository->createTickets($booking, $ticketsData);

            return $booking->load('tickets');
        });
    }

    public function cancelBooking(string $token): Booking
    {
        $booking = $this->bookingRepository->findByToken($token);

        if (!$booking) {
            throw new \RuntimeException('Booking not found');
        }

        $this->bookingRepository->cancel($booking);

        return $booking->fresh();
    }

    private function validateTicketAvailability(array $ticketTypes, array $tickets): void
    {
        foreach ($tickets as $ticketRequest) {
            $ticketType = $ticketTypes[$ticketRequest['ticket_type_id']];
            $requestedQuantity = $ticketRequest['quantity'];

            if (!$ticketType->isAvailable($requestedQuantity)) {
                throw new NotEnoughTicketsException($ticketType->name, $requestedQuantity, $ticketType->available);
            }
        }
    }

    private function calculateTotalAmount(array $ticketTypes, array $tickets): float
    {
        $total = 0;

        foreach ($tickets as $ticketRequest) {
            $ticketType = $ticketTypes[$ticketRequest['ticket_type_id']];
            $total += $ticketType->price * $ticketRequest['quantity'];
        }

        return $total;
    }

    private function getEventTicketTypesFromEvent(Event $event, array $tickets): array
    {
        $ticketTypeIds = collect($tickets)
            ->pluck('ticket_type_id')
            ->unique()
            ->values();

        $event->loadMissing('ticketTypes');
        $ticketTypes = $event->ticketTypes->keyBy('id');

        foreach ($ticketTypeIds as $ticketTypeId) {
            if (!isset($ticketTypes[$ticketTypeId])) {
                throw new \RuntimeException("Ticket type {$ticketTypeId} not found for event {$event->id}");
            }
        }

        return $ticketTypes->all();
    }

    private function normalizeTicketType(string $ticketType): string
    {
        return mb_strtolower(trim($ticketType));
    }
}
