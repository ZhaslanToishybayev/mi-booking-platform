#!/bin/sh

# Ожидание готовности БД (опционально, но полезно)
echo "Waiting for database..."

# Запуск миграций
echo "Running migrations..."
php artisan migrate --force

# Очистка кеша
php artisan optimize:clear
php artisan optimize

# Запуск основного приложения
echo "Starting application..."
php artisan serve --host=0.0.0.0 --port=10000
