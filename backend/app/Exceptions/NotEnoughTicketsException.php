<?php

namespace App\Exceptions;

use Exception;

class NotEnoughTicketsException extends Exception
{
    public function __construct(string $ticketType, int $requested, int $available)
    {
        parent::__construct(
            "Not enough {$ticketType} tickets. Requested: {$requested}, Available: {$available}"
        );
    }
}
