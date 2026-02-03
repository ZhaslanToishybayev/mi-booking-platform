<?php

namespace App\Services;

use App\Exceptions\NotEnoughTicketsException;
use App\Models\Booking;
use App\Models\Event;
use App\Models\TicketType;
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
        return DB::transaction(function () use ($event, $data) {
            // Validate ticket availability
            $this->validateTicketAvailability($data['tickets']);

            // Calculate total amount
            $totalAmount = $this->calculateTotalAmount($data['tickets']);

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
                $ticketType = TicketType::find($ticketRequest['ticket_type_id']);
                $ticketType->decreaseAvailability($ticketRequest['quantity']);

                $ticketsData[] = [
                    'ticket_type' => $ticketType->name,
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

    private function validateTicketAvailability(array $tickets): void
    {
        foreach ($tickets as $ticket) {
            $ticketType = TicketType::find($ticket['ticket_type_id']);

            if (!$ticketType) {
                throw new \RuntimeException("Ticket type {$ticket['ticket_type_id']} not found");
            }

            if (!$ticketType->isAvailable($ticket['quantity'])) {
                throw new NotEnoughTicketsException($ticketType->name, $ticket['quantity'], $ticketType->available);
            }
        }
    }

    private function calculateTotalAmount(array $tickets): float
    {
        $total = 0;

        foreach ($tickets as $ticket) {
            $ticketType = TicketType::find($ticket['ticket_type_id']);
            $total += $ticketType->price * $ticket['quantity'];
        }

        return $total;
    }
}
