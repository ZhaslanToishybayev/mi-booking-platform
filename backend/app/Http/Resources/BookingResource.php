<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'token' => $this->token,
            'event' => new EventResource($this->whenLoaded('event')),
            'email' => $this->email,
            'name' => $this->name,
            'phone' => $this->phone,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'tickets' => TicketResource::collection($this->whenLoaded('tickets')),
            'pdf_url' => $this->pdf_url,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
