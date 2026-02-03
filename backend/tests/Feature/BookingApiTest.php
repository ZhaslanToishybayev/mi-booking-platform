<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_creates_booking_with_valid_data(): void
    {
        $event = Event::factory()->create();
        $vipType = TicketType::factory()->for($event)->vip()->create(['available' => 10]);
        $standardType = TicketType::factory()->for($event)->standard()->create(['available' => 20]);

        $response = $this->postJson('/api/v1/bookings', [
            'event_id' => $event->id,
            'email' => 'user@example.com',
            'name' => 'Иван Петров',
            'phone' => '+7 999 123-45-67',
            'tickets' => [
                ['ticket_type_id' => $vipType->id, 'quantity' => 2],
                ['ticket_type_id' => $standardType->id, 'quantity' => 1],
            ]
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'id', 'token', 'email', 'name', 'total_amount',
                'status', 'tickets', 'pdf_url'
            ]);

        $this->assertDatabaseCount('bookings', 1);
        $this->assertDatabaseCount('tickets', 3);

        // Check availability decreased
        $this->assertEquals(8, $vipType->fresh()->available);
        $this->assertEquals(19, $standardType->fresh()->available);
    }

    #[Test]
    public function it_returns_422_when_not_enough_tickets(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create(['available' => 2]);

        $response = $this->postJson('/api/v1/bookings', [
            'event_id' => $event->id,
            'email' => 'user@example.com',
            'name' => 'Test User',
            'tickets' => [
                ['ticket_type_id' => $ticketType->id, 'quantity' => 5]
            ]
        ]);

        $response->assertUnprocessable()
            ->assertJsonPath('message', fn($message) => str_contains($message, 'Not enough standard tickets'));
    }

    #[Test]
    public function it_returns_404_for_nonexistent_event(): void
    {
        $response = $this->postJson('/api/v1/bookings', [
            'event_id' => 99999,
            'email' => 'user@example.com',
            'name' => 'Test User',
            'tickets' => [
                ['ticket_type_id' => 1, 'quantity' => 1]
            ]
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['event_id']);
    }

    #[Test]
    public function it_returns_410_for_inactive_event(): void
    {
        $event = Event::factory()->cancelled()->create();
        $ticketType = TicketType::factory()->for($event)->create();

        $response = $this->postJson('/api/v1/bookings', [
            'event_id' => $event->id,
            'email' => 'user@example.com',
            'name' => 'Test User',
            'tickets' => [
                ['ticket_type_id' => $ticketType->id, 'quantity' => 1]
            ]
        ]);

        $response->assertGone()
            ->assertJson(['message' => 'Event is not active']);
    }

    #[Test]
    public function it_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/bookings', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['event_id', 'email', 'name', 'tickets']);
    }

    #[Test]
    public function it_validates_email_format(): void
    {
        $event = Event::factory()->create();

        $response = $this->postJson('/api/v1/bookings', [
            'event_id' => $event->id,
            'email' => 'invalid-email',
            'name' => 'Test User',
            'tickets' => []
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function it_returns_booking_by_token(): void
    {
        $booking = Booking::factory()->withTickets(2)->create(['token' => 'test-token-123']);

        $response = $this->getJson('/api/v1/bookings/test-token-123');

        $response->assertOk()
            ->assertJsonStructure([
                'id', 'token', 'event', 'email', 'name', 'total_amount',
                'status', 'tickets', 'pdf_url'
            ])
            ->assertJson(['token' => 'test-token-123']);
    }

    #[Test]
    public function it_returns_404_for_invalid_token(): void
    {
        $response = $this->getJson('/api/v1/bookings/invalid-token');

        $response->assertNotFound()
            ->assertJson(['message' => 'Booking not found']);
    }

    #[Test]
    public function it_cancels_booking(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create([
            'name' => 'vip',
            'quantity' => 100,
            'available' => 90
        ]);
        $booking = Booking::factory()->for($event)->create(['token' => 'cancel-token']);
        $booking->tickets()->create([
            'ticket_type' => 'vip',
            'price' => 5000,
            'qr_code' => 'TEST-QR-1',
            'status' => 'active'
        ]);

        $response = $this->postJson('/api/v1/bookings/cancel-token/cancel');

        $response->assertOk()
            ->assertJson(['message' => 'Booking cancelled successfully']);

        $this->assertEquals('cancelled', $booking->fresh()->status);
        $this->assertEquals(91, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_returns_error_when_cancelling_already_cancelled(): void
    {
        $booking = Booking::factory()->cancelled()->create(['token' => 'already-cancelled']);

        $response = $this->postJson('/api/v1/bookings/already-cancelled/cancel');

        $response->assertBadRequest()
            ->assertJson(['message' => 'Booking is already cancelled']);
    }
}
