#!/bin/bash

# Deploy script for MI Booking Platform
# Usage: ./deploy.sh [environment]
# Environments: production, staging

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/mi-booking"
BACKUP_DIR="/var/backups/mi-booking"

echo "🚀 Starting deployment to $ENVIRONMENT..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database before deployment
echo "📦 Creating database backup..."
docker exec mi-booking-db mysqldump -u root -p${DB_PASSWORD} mi_booking > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql || true

# Pull latest changes
echo "📥 Pulling latest changes..."
cd $PROJECT_DIR
git pull origin main

# Build and start containers
echo "🐳 Building and starting containers..."
docker-compose -f docker-compose.yml pull
docker-compose -f docker-compose.yml up -d --build

# Run migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T backend php artisan migrate --force

# Clear and cache config
echo "⚡ Optimizing application..."
docker-compose exec -T backend php artisan optimize:clear
docker-compose exec -T backend php artisan optimize

# Check health
echo "🏥 Checking health..."
sleep 10

if curl -f http://localhost/api/v1/health-check > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    exit 1
fi

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "🎉 Deployment to $ENVIRONMENT completed!"
