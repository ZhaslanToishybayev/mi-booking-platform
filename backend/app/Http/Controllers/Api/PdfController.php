<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\BookingRepository;
use App\Services\PDFService;
use Illuminate\Http\Response;

class PdfController extends Controller
{
    public function __construct(
        private BookingRepository $bookingRepository,
        private PDFService $pdfService,
    ) {}

    public function bookingPdf(string $token): Response
    {
        $booking = $this->bookingRepository->findByToken($token);

        if (!$booking) {
            return response('Booking not found', 404);
        }

        $pdf = $this->pdfService->generateBookingPDF($booking);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"booking-{$booking->id}.pdf\"",
        ]);
    }

    public function ticketPdf(string $token, int $ticket): Response
    {
        $booking = $this->bookingRepository->findByToken($token);

        if (!$booking) {
            return response('Booking not found', 404);
        }

        $ticket = $booking->tickets->find($ticket);

        if (!$ticket) {
            return response('Ticket not found', 404);
        }

        $pdf = $this->pdfService->generateTicketPDF($ticket);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"ticket-{$ticket->id}.pdf\"",
        ]);
    }
}
