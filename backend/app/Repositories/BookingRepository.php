<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

class BookingRepository
{
    public function findByToken(string $token): ?Booking
    {
        return Booking::with(['event', 'tickets'])
            ->byToken($token)
            ->first();
    }

    public function findByEmail(string $email): Collection
    {
        return Booking::with(['event', 'tickets'])
            ->byEmail($email)
            ->orderByDesc('created_at')
            ->get();
    }

    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function cancel(Booking $booking): void
    {
        $booking->cancel();
    }

    public function createTickets(Booking $booking, array $ticketsData): array
    {
        $tickets = [];

        foreach ($ticketsData as $ticketData) {
            for ($i = 0; $i < $ticketData['quantity']; $i++) {
                $tickets[] = Ticket::create([
                    'booking_id' => $booking->id,
                    'ticket_type' => $ticketData['ticket_type'],
                    'price' => $ticketData['price'],
                    'status' => 'active',
                ]);
            }
        }

        return $tickets;
    }
}
