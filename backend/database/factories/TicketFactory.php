<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $types = ['vip', 'standard', 'student'];
        $type = $this->faker->randomElement($types);

        return [
            'booking_id' => Booking::factory(),
            'ticket_type' => $type,
            'seat_number' => $this->faker->optional()->regexify('[A-Z]-[0-9]{1,2}'),
            'price' => $this->faker->numberBetween(500, 15000),
            'qr_code' => 'TICKET-' . $this->faker->unique()->randomNumber(6) . '-' . Str::uuid(),
            'status' => 'active',
        ];
    }

    public function vip(): static
    {
        return $this->state(fn (array $attributes) => [
            'ticket_type' => 'vip',
        ]);
    }

    public function standard(): static
    {
        return $this->state(fn (array $attributes) => [
            'ticket_type' => 'standard',
        ]);
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'ticket_type' => 'student',
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function used(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'used',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }
}
