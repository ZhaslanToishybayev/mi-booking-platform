# MI Booking - Frontend

React + TypeScript + Vite приложение для бронирования билетов.

## Технологический стек

- **React 18** + TypeScript
- **Vite** - сборка
- **TanStack Query** - управление данными
- **React Router** - роутинг
- **Tailwind CSS** - стили
- **Zustand** - state management
- **Vitest** + React Testing Library - тестирование

## Установка

```bash
cd frontend
npm install
```

## Разработка

```bash
# Запуск dev сервера
npm run dev

# Тесты в watch режиме
npm run test

# Тесты один раз
npm run test:run

# С coverage
npm run test:coverage

# Сборка
npm run build
```

## Структура проекта

```
src/
├── components/
│   ├── ui/           # Базовые компоненты (Button, Card, Input, Loading)
│   ├── events/       # EventCard
│   ├── booking/      # Booking формы
│   ├── tickets/      # Ticket компоненты
│   └── layout/       # Layout, Header, Footer
├── pages/            # Страницы приложения
├── hooks/            # React hooks (useEvents, useBooking)
├── api/              # API клиент
├── types/            # TypeScript типы
├── utils/            # Утилиты (formatters)
└── __tests__/        # Тесты и моки
```

## Тестирование

- **Unit тесты** - для компонентов и хуков
- **Интеграционные тесты** - для pages
- **MSW** - моки API (опционально)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev сервер на http://localhost:3000 |
| `npm run build` | Production сборка |
| `npm run test` | Тесты в watch режиме |
| `npm run test:run` | Тесты один раз |
| `npm run test:coverage` | Тесты с coverage |

## API

Прокси настроен на `http://localhost:8000` (Laravel backend).
