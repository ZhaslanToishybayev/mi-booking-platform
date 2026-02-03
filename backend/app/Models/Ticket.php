<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'ticket_type',
        'seat_number',
        'price',
        'qr_code',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    protected static function boot(): void
    {
        parent::boot();

        // Generate QR code before creating - use only UUID since id is not available yet
        static::creating(function ($ticket) {
            if (empty($ticket->qr_code)) {
                $ticket->qr_code = 'TICKET-' . Str::uuid();
            }
        });
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByQrCode($query, string $qrCode)
    {
        return $query->where('qr_code', $qrCode);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isUsed(): bool
    {
        return $this->status === 'used';
    }

    public function markAsUsed(): void
    {
        if (!$this->isActive()) {
            throw new \RuntimeException('Ticket is not active');
        }

        $this->update(['status' => 'used']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);

        // Return to ticket type availability
        $ticketType = TicketType::where('event_id', $this->booking->event_id)
            ->where('name', $this->ticket_type)
            ->first();

        if ($ticketType) {
            $ticketType->increaseAvailability(1);
        }
    }

    public function getDownloadUrlAttribute(): string
    {
        return "/api/v1/bookings/{$this->booking->token}/tickets/{$this->id}/pdf";
    }
}
