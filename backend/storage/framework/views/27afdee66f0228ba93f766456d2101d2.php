<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Подтверждение бронирования</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0;
            color: #2563eb;
        }
        .section {
            margin: 20px 0;
            padding: 15px;
            background: #f9fafb;
            border-radius: 5px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .event-title {
            font-size: 16px;
            font-weight: bold;
            margin: 5px 0;
        }
        .info-row {
            margin: 5px 0;
        }
        .label {
            font-weight: bold;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f3f4f6;
            font-weight: bold;
        }
        .total {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
        }
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            border: 2px dashed #2563eb;
            border-radius: 10px;
        }
        .qr-code {
            margin: 15px 0;
        }
        .qr-text {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
        }
        .footer ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .footer li {
            margin: 5px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            background: #22c55e;
            color: white;
            border-radius: 3px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ПОДТВЕРЖДЕНИЕ БРОНИРОВАНИЯ</h1>
    </div>

    <div class="section">
        <div class="section-title">Мероприятие</div>
        <div class="event-title"><?php echo e($event->title); ?></div>
        <div class="info-row">
            <span class="label">Дата:</span> <?php echo e($event->start_date->format('d.m.Y H:i')); ?>

        </div>
        <div class="info-row">
            <span class="label">Место:</span> <?php echo e($event->location); ?>

        </div>
    </div>

    <div class="section">
        <div class="section-title">Информация о бронировании</div>
        <div class="info-row">
            <span class="label">Номер брони:</span> #<?php echo e($booking->id); ?>

        </div>
        <div class="info-row">
            <span class="label">Код доступа:</span> <?php echo e(substr($booking->token, 0, 16)); ?>...
        </div>
        <div class="info-row">
            <span class="label">Статус:</span> <span class="status-badge">Подтверждено</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Контактные данные</div>
        <div class="info-row">
            <span class="label">Имя:</span> <?php echo e($booking->name); ?>

        </div>
        <div class="info-row">
            <span class="label">Email:</span> <?php echo e($booking->email); ?>

        </div>
        <?php if($booking->phone): ?>
        <div class="info-row">
            <span class="label">Телефон:</span> <?php echo e($booking->phone); ?>

        </div>
        <?php endif; ?>
    </div>

    <div class="section">
        <div class="section-title">Билеты</div>
        <table>
            <thead>
                <tr>
                    <th>Тип</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                    <th>Итого</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    $grouped = $tickets->groupBy('ticket_type');
                ?>
                <?php $__currentLoopData = $grouped; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $type => $typeTickets): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td><?php echo e(strtoupper($type)); ?></td>
                    <td><?php echo e($typeTickets->count()); ?></td>
                    <td><?php echo e(number_format($typeTickets->first()->price, 0, ',', ' ')); ?> ₽</td>
                    <td><?php echo e(number_format($typeTickets->sum('price'), 0, ',', ' ')); ?> ₽</td>
                </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
        <div class="total">
            ИТОГО: <?php echo e(number_format($booking->total_amount, 0, ',', ' ')); ?> ₽
        </div>
    </div>

    <div class="section-title" style="margin-top: 30px; text-align: center;">ВХОДНЫЕ БИЛЕТЫ</div>

    <?php $__currentLoopData = $tickets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $ticket): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div class="qr-section" style="page-break-inside: avoid;">
        <div class="qr-text">БИЛЕТ #<?php echo e($index + 1); ?> &mdash; <?php echo e(mb_strtoupper($ticket->ticket_type)); ?></div>
        <?php if($ticket->seat_number): ?>
        <div style="margin: 5px 0; font-weight: bold;">Место: <?php echo e($ticket->seat_number); ?></div>
        <?php endif; ?>
        <div class="qr-code">
            <img src="data:image/svg+xml;base64,<?php echo e($qrCodes[$ticket->id]); ?>" alt="QR Code" width="150" height="150">
        </div>
        <div style="font-family: monospace; font-size: 10px; color: #666;"><?php echo e($ticket->qr_code); ?></div>
        <div style="font-size: 10px; margin-top: 5px;">Покажите этот код на входе</div>
    </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

    <div class="footer">
        <strong>Важная информация:</strong>
        <ul>
            <li>Приходите за 30 минут до начала мероприятия</li>
            <li>Имейте при себе документ, удостоверяющий личность</li>
            <li>QR-код действителен только один раз</li>
            <li>Билет не подлежит возврату, но можно отменить бронирование</li>
        </ul>
        <div style="text-align: center; margin-top: 15px;">
            Дата создания: <?php echo e($booking->created_at->format('d.m.Y H:i')); ?>

        </div>
    </div>
</body>
</html>
<?php /**PATH /var/www/resources/views/pdf/booking-confirmation.blade.php ENDPATH**/ ?>