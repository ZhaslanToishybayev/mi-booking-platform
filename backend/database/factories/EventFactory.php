<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 week', '+3 months');
        $endDate = clone $startDate;
        $endDate->modify('+3 hours');

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'location' => $this->faker->city . ', ' . $this->faker->streetAddress,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'image_url' => '/storage/events/' . $this->faker->numberBetween(1, 10) . '.jpg',
            'status' => 'active',
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'start_date' => $this->faker->dateTimeBetween('-3 months', '-1 week'),
        ]);
    }

    public function withTicketTypes(): static
    {
        return $this->afterCreating(function (Event $event) {
            TicketType::factory()->for($event)->vip()->create();
            TicketType::factory()->for($event)->standard()->create();
            TicketType::factory()->for($event)->student()->create();
        });
    }
}
