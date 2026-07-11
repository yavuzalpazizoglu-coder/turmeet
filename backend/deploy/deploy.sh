#!/usr/bin/env bash
set -e

APP_DIR="/var/www/turmeet/backend"

echo "==> Pulling latest code..."
cd "$APP_DIR"
git pull origin main

echo "==> Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Caching config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Restarting queue workers..."
php artisan queue:restart
supervisorctl reread
supervisorctl update
supervisorctl restart turmeet-worker:*

echo "==> Done."
