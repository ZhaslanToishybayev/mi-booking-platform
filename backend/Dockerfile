FROM php:8.3-fpm

# Установка зависимостей
# Установка зависимостей и отключение IPv6
RUN apt-get update && \
    echo "net.ipv6.conf.all.disable_ipv6 = 1" >> /etc/sysctl.conf && \
    echo "net.ipv6.conf.default.disable_ipv6 = 1" >> /etc/sysctl.conf && \
    echo "net.ipv6.conf.lo.disable_ipv6 = 1" >> /etc/sysctl.conf && \
    apt-get install -y \
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
    && docker-php-ext-install pdo_mysql pdo_pgsql \
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

# Копирование и настройка entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Очистка и оптимизация
RUN php artisan optimize:clear || true

# Права
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Render использует порт 10000 по умолчанию
EXPOSE 10000
ENTRYPOINT ["entrypoint.sh"]
