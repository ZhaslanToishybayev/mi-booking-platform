<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'token',
        'email',
        'name',
        'phone',
        'total_amount',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->token)) {
                $booking->token = Str::random(64);
            }
        });
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function scopeByToken($query, string $token)
    {
        return $query->where('token', $token);
    }

    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function cancel(): void
    {
        if ($this->isCancelled()) {
            throw new \RuntimeException('Booking is already cancelled');
        }

        $this->update(['status' => 'cancelled']);

        // Return tickets to availability
        foreach ($this->tickets as $ticket) {
            $ticket->cancel();
        }
    }

    public function getPdfUrlAttribute(): string
    {
        return "/api/v1/bookings/{$this->token}/pdf";
    }
}
