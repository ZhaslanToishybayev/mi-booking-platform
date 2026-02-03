# MI Booking - E2E Tests

End-to-end тесты с использованием Playwright.

## Установка

```bash
cd e2e
npm install
npx playwright install
```

## Запуск тестов

```bash
# Все тесты
npm test

# С открытием браузера
npm run test:headed

# UI режим (для разработки)
npm run test:ui

# Debug режим
npm run test:debug

# Отчет
npm run report
```

## Структура

```
e2e/
├── tests/
│   ├── booking-flow.spec.ts    # Основной flow бронирования
│   ├── events.spec.ts          # Тесты каталога мероприятий
│   └── my-bookings.spec.ts     # Тесты личного кабинета
├── fixtures/
│   └── test-data.ts            # Тестовые данные
├── utils/
│   └── api-helpers.ts          # Хелперы для API
└── playwright.config.ts        # Конфигурация
```

## Переменные окружения

```bash
BASE_URL=http://localhost:3000 npm test
```
