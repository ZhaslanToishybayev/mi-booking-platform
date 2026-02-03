<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PdfGenerationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_pdf_for_valid_booking_token(): void
    {
        $booking = Booking::factory()->withTickets(2)->create();

        $response = $this->get("/api/v1/bookings/{$booking->token}/pdf");

        $response->assertOk()
            ->assertHeader('Content-Type', 'application/pdf')
            ->assertHeader('Content-Disposition', "attachment; filename=\"booking-{$booking->id}.pdf\"");
    }

    #[Test]
    public function it_returns_404_for_invalid_booking_token(): void
    {
        $response = $this->get('/api/v1/bookings/invalid-token/pdf');

        $response->assertNotFound();
    }

    #[Test]
    public function it_returns_pdf_for_valid_ticket(): void
    {
        $booking = Booking::factory()->create();
        $ticket = Ticket::factory()->for($booking)->create();

        $response = $this->get("/api/v1/bookings/{$booking->token}/tickets/{$ticket->id}/pdf");

        $response->assertOk()
            ->assertHeader('Content-Type', 'application/pdf')
            ->assertHeader('Content-Disposition', "attachment; filename=\"ticket-{$ticket->id}.pdf\"");
    }

    #[Test]
    public function it_returns_404_for_invalid_ticket_id(): void
    {
        $booking = Booking::factory()->create();

        $response = $this->get("/api/v1/bookings/{$booking->token}/tickets/99999/pdf");

        $response->assertNotFound();
    }

    #[Test]
    public function it_returns_404_for_ticket_from_different_booking(): void
    {
        $booking1 = Booking::factory()->create();
        $booking2 = Booking::factory()->create();
        $ticket = Ticket::factory()->for($booking2)->create();

        $response = $this->get("/api/v1/bookings/{$booking1->token}/tickets/{$ticket->id}/pdf");

        $response->assertNotFound();
    }
}
