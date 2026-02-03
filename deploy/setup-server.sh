#!/bin/bash

# Setup script for new server
# Run as root on fresh Ubuntu 22.04 server

set -e

echo "🔧 Setting up MI Booking server..."

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ${USER}

# Install Docker Compose
echo "📦 Installing Docker Compose..."
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install other tools
apt-get install -y git nginx certbot python3-certbot-nginx

# Create project directory
mkdir -p /var/www/mi-booking
cd /var/www/mi-booking

# Clone repository (you'll need to update this with your repo)
# git clone https://github.com/yourusername/mi-booking.git .

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /var/www/mi-booking"
echo "2. Copy .env.example to .env and configure"
echo "3. Run: docker-compose up -d"
echo "4. Configure SSL: certbot --nginx -d your-domain.com"
