<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use App\Models\TicketType;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_has_active_scope(): void
    {
        Event::factory()->active()->count(3)->create();
        Event::factory()->cancelled()->create();
        Event::factory()->completed()->create();

        $active = Event::active()->get();

        $this->assertCount(3, $active);
    }

    #[Test]
    public function it_has_upcoming_scope(): void
    {
        Event::factory()->create(['start_date' => now()->addWeek()]);
        Event::factory()->create(['start_date' => now()->subWeek()]);

        $upcoming = Event::upcoming()->get();

        $this->assertCount(1, $upcoming);
    }

    #[Test]
    public function it_filters_by_location(): void
    {
        Event::factory()->create(['location' => 'Москва, Крокус Сити Холл']);
        Event::factory()->create(['location' => 'Санкт-Петербург, Ледовый дворец']);

        $moscow = Event::byLocation('Москва')->get();

        $this->assertCount(1, $moscow);
        $this->assertStringContainsString('Москва', $moscow->first()->location);
    }

    #[Test]
    public function it_filters_by_date_range(): void
    {
        Event::factory()->create(['start_date' => '2024-03-15']);
        Event::factory()->create(['start_date' => '2024-06-15']);

        $events = Event::byDateRange('2024-02-01', '2024-04-01')->get();

        $this->assertCount(1, $events);
    }

    #[Test]
    public function it_has_ticket_types_relationship(): void
    {
        $event = Event::factory()->create();
        TicketType::factory()->count(3)->for($event)->create();

        $this->assertCount(3, $event->ticketTypes);
    }

    #[Test]
    public function it_has_bookings_relationship(): void
    {
        $event = Event::factory()->create();
        Booking::factory()->count(2)->for($event)->create();

        $this->assertCount(2, $event->bookings);
    }

    #[Test]
    public function it_checks_if_active(): void
    {
        $active = Event::factory()->active()->create(['start_date' => now()->addDay()]);
        $cancelled = Event::factory()->cancelled()->create();
        $past = Event::factory()->create(['start_date' => now()->subDay(), 'status' => 'active']);

        $this->assertTrue($active->isActive());
        $this->assertFalse($cancelled->isActive());
        $this->assertFalse($past->isActive());
    }

    #[Test]
    public function it_checks_available_tickets(): void
    {
        $event = Event::factory()->create();
        TicketType::factory()->for($event)->create(['available' => 10]);

        $this->assertTrue($event->hasAvailableTickets());

        $event2 = Event::factory()->create();
        TicketType::factory()->for($event2)->create(['available' => 0]);

        $this->assertFalse($event2->hasAvailableTickets());
    }
}
