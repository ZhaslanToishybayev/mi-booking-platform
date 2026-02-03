<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_type' => $this->ticket_type,
            'price' => $this->price,
            'seat_number' => $this->seat_number,
            'qr_code' => $this->qr_code,
            'status' => $this->status,
            'download_url' => $this->download_url,
        ];
    }
}
