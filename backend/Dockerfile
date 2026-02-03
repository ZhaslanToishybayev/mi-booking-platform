FROM php:8.3-fpm

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo_mysql \
    && docker-php-ext-install zip \
    && docker-php-ext-install bcmath \
    && docker-php-ext-install opcache

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Рабочая директория
WORKDIR /var/www

# Копирование composer файлов
COPY composer.json composer.lock ./

# Установка зависимостей (без dev для production)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Копирование всего проекта
COPY . .

# Генерация ключа и оптимизация
RUN php artisan key:generate --force || true
RUN php artisan optimize:clear || true
RUN php artisan optimize || true

# Права
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# PHP-FPM конфиг
EXPOSE 9000
CMD ["php-fpm"]
