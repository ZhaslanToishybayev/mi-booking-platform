<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Входной билет</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .ticket {
            border: 3px solid #2563eb;
            border-radius: 10px;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .header h1 {
            font-size: 16px;
            margin: 0;
            color: #2563eb;
        }
        .header .subtitle {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .section {
            margin: 15px 0;
        }
        .section-title {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .event-title {
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
        }
        .info-row {
            margin: 3px 0;
        }
        .ticket-type {
            display: inline-block;
            padding: 5px 15px;
            background: #2563eb;
            color: white;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        .qr-section {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #f9fafb;
            border-radius: 5px;
        }
        .qr-code {
            margin: 10px 0;
        }
        .qr-code-text {
            font-family: monospace;
            font-size: 10px;
            color: #666;
            margin-top: 5px;
        }
        .warning {
            text-align: center;
            font-size: 10px;
            color: #dc2626;
            margin-top: 15px;
            padding: 10px;
            border: 1px dashed #dc2626;
            border-radius: 5px;
        }
        .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 9px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <h1>ВХОДНОЙ БИЛЕТ</h1>
            <div class="subtitle">MI Booking Platform</div>
        </div>

        <div class="section">
            <div class="section-title">Мероприятие</div>
            <div class="event-title">{{ $event->title }}</div>
            <div class="info-row">
                <strong>Дата:</strong> {{ $event->start_date->format('d.m.Y') }}
            </div>
            <div class="info-row">
                <strong>Время:</strong> {{ $event->start_date->format('H:i') }}
            </div>
            <div class="info-row">
                <strong>Место:</strong> {{ $event->location }}
            </div>
        </div>

        <div class="section" style="text-align: center;">
            <div class="section-title">Тип билета</div>
            <div class="ticket-type">{{ strtoupper($ticket->ticket_type) }}</div>
            @if($ticket->seat_number)
            <div style="margin-top: 10px;">
                <strong>Место:</strong> {{ $ticket->seat_number }}
            </div>
            @endif
        </div>

        <div class="section">
            <div class="section-title">Владелец</div>
            <div style="font-size: 14px; font-weight: bold;">
                {{ $booking->name }}
            </div>
        </div>

        <div class="qr-section">
            <div class="section-title">QR-КОД ДЛЯ СКАНИРОВАНИЯ</div>
            <div class="qr-code">
                <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code" width="150" height="150">
            </div>
            <div class="qr-code-text">{{ $ticket->qr_code }}</div>
        </div>

        <div class="warning">
            ⚠ Один вход — один билет<br>
            Билет действителен только с документом, удостоверяющим личность
        </div>

        <div class="footer">
            Бронирование #{{ $booking->id }} | Билет #{{ $ticket->id }}<br>
            Дата покупки: {{ $booking->created_at->format('d.m.Y') }}
        </div>
    </div>
</body>
</html>
