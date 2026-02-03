<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketTypeFactory extends Factory
{
    protected $model = TicketType::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(50, 500);

        return [
            'event_id' => Event::factory(),
            'name' => 'standard',
            'price' => $this->faker->numberBetween(1000, 5000),
            'quantity' => $quantity,
            'available' => $quantity,
        ];
    }

    public function vip(): static
    {
        return $this->state(function (array $attributes) {
            $quantity = $this->faker->numberBetween(20, 100);
            return [
                'name' => 'vip',
                'price' => $this->faker->numberBetween(5000, 15000),
                'quantity' => $quantity,
                'available' => $quantity,
            ];
        });
    }

    public function standard(): static
    {
        return $this->state(function (array $attributes) {
            $quantity = $this->faker->numberBetween(100, 500);
            return [
                'name' => 'standard',
                'price' => $this->faker->numberBetween(1000, 5000),
                'quantity' => $quantity,
                'available' => $quantity,
            ];
        });
    }

    public function student(): static
    {
        return $this->state(function (array $attributes) {
            $quantity = $this->faker->numberBetween(30, 100);
            return [
                'name' => 'student',
                'price' => $this->faker->numberBetween(500, 2000),
                'quantity' => $quantity,
                'available' => $quantity,
            ];
        });
    }

    public function limited(int $available): static
    {
        return $this->state(fn (array $attributes) => [
            'available' => $available,
        ]);
    }
}
