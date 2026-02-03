# MI Booking - Backend

Система бронирования билетов на мероприятия с генерацией PDF-подтверждений.

## Технологический стек

- **Laravel 11** (PHP 8.3+)
- **MySQL 8.0**
- **Laravel Sanctum** (гостевые токены)
- **barryvdh/laravel-dompdf** (PDF генерация)
- **simplesoftwareio/simple-qrcode** (QR коды)

## Установка

```bash
# 1. Установка зависимостей
composer install

# 2. Настройка окружения
cp .env.example .env
php artisan key:generate

# 3. Настройка БД в .env
DB_DATABASE=mi_booking
DB_USERNAME=root
DB_PASSWORD=your_password

# 4. Миграции и сидеры
php artisan migrate
php artisan db:seed

# 5. Линк для storage
php artisan storage:link
```

## Тестирование (TDD)

```bash
# Все тесты
php artisan test

# Unit тесты
php artisan test --filter=Unit

# Feature тесты
php artisan test --filter=Feature

# С coverage
php artisan test --coverage
```

## API Endpoints

### Events
- `GET /api/v1/events` - Список мероприятий
- `GET /api/v1/events/{id}` - Детали мероприятия
- `GET /api/v1/events/{id}/availability` - Доступность билетов

### Bookings
- `POST /api/v1/bookings` - Создать бронирование
- `GET /api/v1/bookings/{token}` - Получить бронирование
- `POST /api/v1/bookings/{token}/cancel` - Отменить бронирование

### PDF
- `GET /api/v1/bookings/{token}/pdf` - PDF подтверждения
- `GET /api/v1/bookings/{token}/tickets/{id}/pdf` - PDF билета

## Структура проекта

```
app/
├── Models/           # Event, TicketType, Booking, Ticket
├── Repositories/     # EventRepository, BookingRepository
├── Services/         # BookingService, PDFService
├── Http/
│   ├── Controllers/  # EventController, BookingController, PdfController
│   ├── Requests/     # StoreBookingRequest
│   └── Resources/    # EventResource, BookingResource, etc.
└── Exceptions/       # NotEnoughTicketsException

database/
├── migrations/       # 4 таблицы
└── factories/        # Factories для тестов

resources/views/pdf/
├── booking-confirmation.blade.php
└── ticket.blade.php

tests/
├── Unit/
│   ├── Models/       # Тесты моделей
│   └── Services/     # Тесты сервисов
└── Feature/          # API тесты
```

## Типы билетов

- **VIP** - приоритетный вход, лучшие места
- **Standard** - обычный билет
- **Student** - льготный

## Особенности

- Гостевое бронирование (без регистрации)
- Уникальный токен для каждой брони
- PDF с QR-кодом для проверки на входе
- Автоматическое управление доступностью билетов
- Отмена брони с возвратом билетов в продажу

## Команды

```bash
# Запуск сервера
php artisan serve

# Оптимизация для production
php artisan optimize
php artisan config:cache
php artisan route:cache

# Очистка кэша
php artisan optimize:clear
```
