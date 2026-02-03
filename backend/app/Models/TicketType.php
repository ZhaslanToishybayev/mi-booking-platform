<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'quantity',
        'available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function decreaseAvailability(int $quantity): void
    {
        if ($this->available < $quantity) {
            throw new \RuntimeException('Not enough tickets available');
        }

        $this->decrement('available', $quantity);
    }

    public function increaseAvailability(int $quantity): void
    {
        $newAvailable = min($this->available + $quantity, $this->quantity);
        $this->update(['available' => $newAvailable]);
    }

    public function isAvailable(int $requestedQuantity = 1): bool
    {
        return $this->available >= $requestedQuantity;
    }
}
