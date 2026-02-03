<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PDFService
{
    public function generateBookingPDF(Booking $booking): string
    {
        $qrCodes = [];
        foreach ($booking->tickets as $ticket) {
            $qrCodes[$ticket->id] = $this->generateQRCode($ticket->qr_code);
        }

        $pdf = PDF::loadView('pdf.booking-confirmation', [
            'booking' => $booking,
            'event' => $booking->event,
            'tickets' => $booking->tickets,
            'qrCodes' => $qrCodes,
        ]);

        return $pdf->output();
    }

    public function generateTicketPDF(Ticket $ticket): string
    {
        $qrCode = $this->generateQRCode($ticket->qr_code);

        $pdf = PDF::loadView('pdf.ticket', [
            'ticket' => $ticket,
            'booking' => $ticket->booking,
            'event' => $ticket->booking->event,
            'qrCode' => $qrCode,
        ]);

        $pdf->setPaper('a5', 'portrait');

        return $pdf->output();
    }

    private function generateQRCode(string $data): string
    {
        // Use SVG format instead of PNG to avoid imagick dependency
        $svg = QrCode::format('svg')
            ->size(200)
            ->errorCorrection('H')
            ->generate($data);
        
        return base64_encode($svg);
    }
}
