<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_paginated_list_of_events(): void
    {
        Event::factory()->active()->count(15)->create();

        $response = $this->getJson('/api/v1/events');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'location', 'start_date', 'ticket_types']
                ],
                'meta' => ['current_page', 'total_pages', 'total']
            ]);
    }

    #[Test]
    public function it_filters_events_by_date_range(): void
    {
        Event::factory()->create(['start_date' => '2026-03-15 19:00:00', 'status' => 'active']);
        Event::factory()->create(['start_date' => '2026-06-15 19:00:00', 'status' => 'active']);

        $response = $this->getJson('/api/v1/events?date_from=2026-02-01&date_to=2026-04-01');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    #[Test]
    public function it_filters_events_by_location(): void
    {
        Event::factory()->create(['location' => 'Москва, Крокус Сити Холл']);
        Event::factory()->create(['location' => 'Санкт-Петербург, Ледовый дворец']);

        $response = $this->getJson('/api/v1/events?location=Москва');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    #[Test]
    public function it_returns_event_details(): void
    {
        $event = Event::factory()->create();
        TicketType::factory()->count(3)->for($event)->create();

        $response = $this->getJson("/api/v1/events/{$event->id}");

        $response->assertOk()
            ->assertJsonStructure([
                'id', 'title', 'description', 'location', 'start_date', 'end_date',
                'image_url', 'status', 'ticket_types'
            ]);
    }

    #[Test]
    public function it_returns_404_for_nonexistent_event(): void
    {
        $response = $this->getJson('/api/v1/events/99999');

        $response->assertNotFound()
            ->assertJson(['message' => 'Event not found']);
    }

    #[Test]
    public function it_returns_event_availability(): void
    {
        $event = Event::factory()->create();
        TicketType::factory()->for($event)->vip()->create(['available' => 50]);
        TicketType::factory()->for($event)->standard()->create(['available' => 200]);

        $response = $this->getJson("/api/v1/events/{$event->id}/availability");

        $response->assertOk()
            ->assertJsonStructure([
                'event_id', 'available', 'ticket_types'
            ])
            ->assertJson([
                'event_id' => $event->id,
                'available' => true
            ]);
    }

    #[Test]
    public function it_respects_per_page_parameter(): void
    {
        Event::factory()->active()->count(20)->create();

        $response = $this->getJson('/api/v1/events?per_page=5');

        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.total', 20);
    }

    #[Test]
    public function it_limits_per_page_to_maximum(): void
    {
        Event::factory()->active()->count(60)->create();

        $response = $this->getJson('/api/v1/events?per_page=100');

        $response->assertOk()
            ->assertJsonCount(50, 'data'); // Max is 50
    }
}
