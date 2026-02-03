<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'token' => Str::random(64),
            'email' => $this->faker->safeEmail(),
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'total_amount' => $this->faker->numberBetween(1000, 50000),
            'status' => 'confirmed',
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function withTickets(int $count = 2): static
    {
        return $this->afterCreating(function (Booking $booking) use ($count) {
            Ticket::factory()->count($count)->for($booking)->create();
        });
    }
}
