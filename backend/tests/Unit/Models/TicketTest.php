<?php

namespace Tests\Unit\Models;

use App\Models\Booking;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_generates_qr_code_on_create(): void
    {
        $ticket = Ticket::factory()->create();

        $this->assertNotNull($ticket->qr_code);
        $this->assertStringStartsWith('TICKET-', $ticket->qr_code);
    }

    #[Test]
    public function it_belongs_to_booking(): void
    {
        $booking = Booking::factory()->create();
        $ticket = Ticket::factory()->for($booking)->create();

        $this->assertInstanceOf(Booking::class, $ticket->booking);
        $this->assertEquals($booking->id, $ticket->booking->id);
    }

    #[Test]
    public function it_has_active_scope(): void
    {
        Ticket::factory()->active()->count(2)->create();
        Ticket::factory()->used()->create();
        Ticket::factory()->cancelled()->create();

        $active = Ticket::active()->get();

        $this->assertCount(2, $active);
    }

    #[Test]
    public function it_can_be_found_by_qr_code(): void
    {
        $ticket = Ticket::factory()->create(['qr_code' => 'TEST-QR-123']);
        Ticket::factory()->count(2)->create();

        $found = Ticket::byQrCode('TEST-QR-123')->first();

        $this->assertEquals($ticket->id, $found->id);
    }

    #[Test]
    public function it_checks_if_active(): void
    {
        $active = Ticket::factory()->active()->create();
        $used = Ticket::factory()->used()->create();

        $this->assertTrue($active->isActive());
        $this->assertFalse($used->isActive());
    }

    #[Test]
    public function it_checks_if_used(): void
    {
        $active = Ticket::factory()->active()->create();
        $used = Ticket::factory()->used()->create();

        $this->assertFalse($active->isUsed());
        $this->assertTrue($used->isUsed());
    }

    #[Test]
    public function it_can_be_marked_as_used(): void
    {
        $ticket = Ticket::factory()->active()->create();

        $ticket->markAsUsed();

        $this->assertEquals('used', $ticket->fresh()->status);
    }

    #[Test]
    public function it_throws_exception_when_marking_non_active_as_used(): void
    {
        $ticket = Ticket::factory()->used()->create();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Ticket is not active');

        $ticket->markAsUsed();
    }

    #[Test]
    public function it_can_be_cancelled(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create([
            'name' => 'vip',
            'quantity' => 100,
            'available' => 90
        ]);
        $booking = Booking::factory()->for($event)->create();
        $ticket = Ticket::factory()->for($booking)->create([
            'ticket_type' => 'vip',
            'status' => 'active'
        ]);

        $ticket->cancel();

        $this->assertEquals('cancelled', $ticket->fresh()->status);
        $this->assertEquals(91, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_has_download_url_attribute(): void
    {
        $booking = Booking::factory()->create(['token' => 'abc123']);
        $ticket = Ticket::factory()->for($booking)->create(['id' => 456]);

        $this->assertEquals('/api/v1/bookings/abc123/tickets/456/pdf', $ticket->download_url);
    }
}
