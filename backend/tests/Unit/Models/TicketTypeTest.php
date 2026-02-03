<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TicketTypeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_belongs_to_event(): void
    {
        $event = Event::factory()->create();
        $ticketType = TicketType::factory()->for($event)->create();

        $this->assertInstanceOf(Event::class, $ticketType->event);
        $this->assertEquals($event->id, $ticketType->event->id);
    }

    #[Test]
    public function it_decreases_availability(): void
    {
        $ticketType = TicketType::factory()->create(['available' => 10]);

        $ticketType->decreaseAvailability(3);

        $this->assertEquals(7, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_throws_exception_when_not_enough_tickets(): void
    {
        $ticketType = TicketType::factory()->create(['available' => 2]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Not enough tickets available');

        $ticketType->decreaseAvailability(5);
    }

    #[Test]
    public function it_increases_availability(): void
    {
        $ticketType = TicketType::factory()->create([
            'quantity' => 100,
            'available' => 50
        ]);

        $ticketType->increaseAvailability(10);

        $this->assertEquals(60, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_does_not_exceed_quantity_when_increasing(): void
    {
        $ticketType = TicketType::factory()->create([
            'quantity' => 100,
            'available' => 95
        ]);

        $ticketType->increaseAvailability(10);

        $this->assertEquals(100, $ticketType->fresh()->available);
    }

    #[Test]
    public function it_checks_availability(): void
    {
        $ticketType = TicketType::factory()->create(['available' => 5]);

        $this->assertTrue($ticketType->isAvailable(3));
        $this->assertTrue($ticketType->isAvailable(5));
        $this->assertFalse($ticketType->isAvailable(6));
    }

    #[Test]
    public function it_has_vip_factory_state(): void
    {
        $vip = TicketType::factory()->vip()->create();

        $this->assertEquals('vip', $vip->name);
        $this->assertGreaterThanOrEqual(5000, $vip->price);
    }

    #[Test]
    public function it_has_standard_factory_state(): void
    {
        $standard = TicketType::factory()->standard()->create();

        $this->assertEquals('standard', $standard->name);
        $this->assertGreaterThanOrEqual(1000, $standard->price);
    }

    #[Test]
    public function it_has_student_factory_state(): void
    {
        $student = TicketType::factory()->student()->create();

        $this->assertEquals('student', $student->name);
        $this->assertGreaterThanOrEqual(500, $student->price);
    }
}
