<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class EventCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = EventResource::class;

    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return $this->collection->toArray();
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function paginationInformation(Request $request, array $paginated, array $default): array
    {
        return [
            'meta' => [
                'current_page' => $paginated['current_page'] ?? 1,
                'total_pages' => $paginated['last_page'] ?? 1,
                'total' => $paginated['total'] ?? 0,
                'from' => $paginated['from'] ?? null,
                'last_page' => $paginated['last_page'] ?? 1,
                'links' => $paginated['links'] ?? [],
                'path' => $paginated['path'] ?? '',
                'per_page' => $paginated['per_page'] ?? 10,
                'to' => $paginated['to'] ?? null,
            ],
            'links' => [
                'first' => $paginated['first_page_url'] ?? null,
                'last' => $paginated['last_page_url'] ?? null,
                'prev' => $paginated['prev_page_url'] ?? null,
                'next' => $paginated['next_page_url'] ?? null,
            ],
        ];
    }
}
