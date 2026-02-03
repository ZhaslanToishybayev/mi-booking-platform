<?php

namespace Tests\Unit\Services;

use App\Exceptions\NotEnoughTicketsException;
use App\Models\Booking;
use App\Models\Event;
use App\Models\TicketType;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BookingServiceTest extends TestCase
{
    use RefreshDatabase;

    private BookingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(BookingService::class);
    }

    #[Test]
    public function it_creates_booking_with_tickets(): void
    {
        $event = Event::factory()->create();
        $vipType = TicketType::factory()->for($event)->vip()->create(['available' => 10]);
        $standardType = TicketType::factory()->for($event)->standard()->create(['available' => 20]);

        $data = [
            'email' => 'test@example.com',
            'name' => 'Test User',
            'phone' => '+7 999 123-45-67',
            'tickets' => [
                ['ticket_type_id' => $vipType->id, 'quantity' => 2],
                ['ticket_type_id' => $standardType->id, 'quantity' => 1],
            ]
        ];

        $booking = $this->service->createBooking($event, $data);

        $this->assertInstanceOf(Booking::class, $booking);
        $this->assertEquals('test@example.com', $booking->email);
        $this->assertEquals(3, $booking->tickets->count());
        $this->assertEquals(
            ($vipType->price * 2) + ($standardType->price * 1),
            $booking->total_amount
        );
    }

    #[Test]
    public function it_decreases_ticket_availability_on_booking(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create(['available' => 10]);

        $data = [
            'email' => 'test@example.com',
            'name' => 'Test User',
            'tickets' => [
                ['ticket_type_id' => $ticketType->id, 'quantity' => 3]
            ]
        ];

        $this->service->createBooking($event, $data);

        $this->assertEquals(7, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_throws_exception_when_not_enough_tickets(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create(['available' => 2]);

        $data = [
            'email' => 'test@example.com',
            'name' => 'Test User',
            'tickets' => [
                ['ticket_type_id' => $ticketType->id, 'quantity' => 5]
            ]
        ];

        $this->expectException(NotEnoughTicketsException::class);
        $this->expectExceptionMessage('Not enough standard tickets');

        $this->service->createBooking($event, $data);
    }

    #[Test]
    public function it_throws_exception_for_nonexistent_ticket_type(): void
    {
        $event = Event::factory()->create();

        $data = [
            'email' => 'test@example.com',
            'name' => 'Test User',
            'tickets' => [
                ['ticket_type_id' => 99999, 'quantity' => 1]
            ]
        ];

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Ticket type 99999 not found');

        $this->service->createBooking($event, $data);
    }

    #[Test]
    public function it_cancels_booking_and_returns_tickets(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create([
            'name' => 'vip',
            'quantity' => 100,
            'available' => 90
        ]);
        $booking = Booking::factory()->for($event)->create(['token' => 'cancel-test']);
        $booking->tickets()->create([
            'ticket_type' => 'vip',
            'price' => 5000,
            'qr_code' => 'TEST-QR-1',
            'status' => 'active'
        ]);

        $cancelled = $this->service->cancelBooking('cancel-test');

        $this->assertEquals('cancelled', $cancelled->status);
        $this->assertEquals(91, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_throws_exception_when_cancelling_nonexistent_booking(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Booking not found');

        $this->service->cancelBooking('nonexistent-token');
    }
}
