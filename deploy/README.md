# MI Booking - Deployment Guide

## 🚀 Быстрый старт с Docker

### 1. Локальная разработка

```bash
# Запуск только БД и Mailpit
docker-compose -f docker-compose.dev.yml up -d

# Backend (в отдельном терминале)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend (в отдельном терминале)
cd frontend
npm install
npm run dev
```

### 2. Production с Docker Compose

```bash
# На сервере
git clone https://github.com/yourusername/mi-booking.git
cd mi-booking

# Настройка окружения
cp .env.example .env
# Отредактируйте .env

# Запуск
docker-compose up -d

# Миграции
docker-compose exec backend php artisan migrate --force
```

### 3. Production с SSL (Let's Encrypt)

```bash
# Установка certbot
apt-get install certbot python3-certbot-nginx

# Получение сертификата
certbot --nginx -d your-domain.com

# Автообновление
certbot renew --dry-run
```

## 🔧 CI/CD Pipeline

### GitHub Actions

1. Добавьте secrets в репозиторий:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `SSH_HOST`
   - `SSH_USER`
   - `SSH_KEY`

2. Pipeline автоматически:
   - Запускает тесты backend
   - Запускает тесты frontend
   - Запускает E2E тесты
   - Собирает Docker образы
   - Деплоит на сервер (main branch)

### Ручной деплой

```bash
# Скопируйте deploy.sh на сервер
scp deploy/deploy.sh root@your-server:/var/www/mi-booking/

# Запустите
ssh root@your-server "cd /var/www/mi-booking && ./deploy.sh"
```

## 📁 Структура деплоя

```
deploy/
├── nginx-api.conf          # Nginx для backend API
├── nginx-production.conf   # Nginx для production (SSL)
├── deploy.sh              # Скрипт деплоя
└── setup-server.sh        # Настройка нового сервера
```

## 🐳 Docker команды

```bash
# Пересобрать
docker-compose up -d --build

# Логи
docker-compose logs -f backend
docker-compose logs -f frontend

# Миграции
docker-compose exec backend php artisan migrate

# Очистка
docker system prune -f
```

## 🔍 Troubleshooting

### Проблема: 502 Bad Gateway
```bash
# Проверьте что backend запущен
docker-compose ps

# Проверьте логи
docker-compose logs backend
```

### Проблема: Permission denied
```bash
# Права на storage
docker-compose exec backend chown -R www-data:www-data storage
```

### Проблема: Database connection
```bash
# Проверьте что MySQL запущен
docker-compose exec db mysqladmin ping
```
