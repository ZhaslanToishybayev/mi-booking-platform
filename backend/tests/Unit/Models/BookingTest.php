<?php

namespace Tests\Unit\Models;

use App\Models\Booking;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_generates_unique_token_on_create(): void
    {
        $booking = Booking::factory()->create();

        $this->assertNotNull($booking->token);
        $this->assertEquals(64, strlen($booking->token));
    }

    #[Test]
    public function it_preserves_existing_token(): void
    {
        $token = Str::random(64);
        $booking = Booking::factory()->create(['token' => $token]);

        $this->assertEquals($token, $booking->token);
    }

    #[Test]
    public function it_belongs_to_event(): void
    {
        $event = Event::factory()->create();
        $booking = Booking::factory()->for($event)->create();

        $this->assertInstanceOf(Event::class, $booking->event);
        $this->assertEquals($event->id, $booking->event->id);
    }

    #[Test]
    public function it_has_tickets_relationship(): void
    {
        $booking = Booking::factory()->create();
        Ticket::factory()->count(3)->for($booking)->create();

        $this->assertCount(3, $booking->tickets);
    }

    #[Test]
    public function it_can_be_found_by_token(): void
    {
        $booking = Booking::factory()->create(['token' => 'test-token-123']);
        Booking::factory()->count(2)->create();

        $found = Booking::byToken('test-token-123')->first();

        $this->assertEquals($booking->id, $found->id);
    }

    #[Test]
    public function it_can_be_found_by_email(): void
    {
        $booking = Booking::factory()->create(['email' => 'test@example.com']);
        Booking::factory()->count(2)->create();

        $found = Booking::byEmail('test@example.com')->get();

        $this->assertCount(1, $found);
        $this->assertEquals($booking->id, $found->first()->id);
    }

    #[Test]
    public function it_has_confirmed_scope(): void
    {
        Booking::factory()->confirmed()->count(2)->create();
        Booking::factory()->cancelled()->create();
        Booking::factory()->pending()->create();

        $confirmed = Booking::confirmed()->get();

        $this->assertCount(2, $confirmed);
    }

    #[Test]
    public function it_checks_if_confirmed(): void
    {
        $confirmed = Booking::factory()->confirmed()->create();
        $cancelled = Booking::factory()->cancelled()->create();

        $this->assertTrue($confirmed->isConfirmed());
        $this->assertFalse($cancelled->isConfirmed());
    }

    #[Test]
    public function it_checks_if_cancelled(): void
    {
        $confirmed = Booking::factory()->confirmed()->create();
        $cancelled = Booking::factory()->cancelled()->create();

        $this->assertFalse($confirmed->isCancelled());
        $this->assertTrue($cancelled->isCancelled());
    }

    #[Test]
    public function it_can_be_cancelled(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create([
            'quantity' => 100,
            'available' => 90
        ]);
        $booking = Booking::factory()->for($event)->create();
        Ticket::factory()->for($booking)->create([
            'ticket_type' => $ticketType->name,
            'status' => 'active'
        ]);

        $booking->cancel();

        $this->assertEquals('cancelled', $booking->fresh()->status);
        $this->assertEquals(91, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_throws_exception_when_cancelling_already_cancelled(): void
    {
        $booking = Booking::factory()->cancelled()->create();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Booking is already cancelled');

        $booking->cancel();
    }

    #[Test]
    public function it_has_pdf_url_attribute(): void
    {
        $booking = Booking::factory()->create(['token' => 'abc123']);

        $this->assertEquals('/api/v1/bookings/abc123/pdf', $booking->pdf_url);
    }
}
