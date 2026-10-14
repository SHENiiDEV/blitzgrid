#!/usr/bin/env bash
# =========================================================================
# BLITZGRID // Production VPS Deployment Script
# Target Domain: blitzgrid.co.uk
# Path: /var/www/blitzgrid
# =========================================================================

set -euo pipefail

PROJECT_DIR="/var/www/blitzgrid"
cd "$PROJECT_DIR"

echo "⚡ [1/7] Fetching latest repository code..."
if [ -d ".git" ]; then
    git pull --ff-only origin main
fi

echo "📦 [2/7] Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

echo "🎨 [3/7] Building Frontend React / Inertia Assets..."
npm ci
npm run build
rm -f public/hot

echo "🎮 [4/7] Installing Node.js Game Server Dependencies..."
cd "$PROJECT_DIR/server"
npm ci
cd "$PROJECT_DIR"

echo "🗄️ [5/7] Preparing Database & Running Migrations..."
touch "$PROJECT_DIR/database/database.sqlite"
php artisan config:clear
php artisan app:check-production
php artisan migrate --force
php artisan db:seed --class=Database\\Seeders\\DatabaseSeeder --force

echo "⚡ [6/7] Optimizing Laravel Caches..."
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔒 [7/7] Setting permissions & restarting Game Server..."
chown -R www-data:www-data "$PROJECT_DIR/storage" "$PROJECT_DIR/bootstrap/cache" "$PROJECT_DIR/database"
chmod -R 770 "$PROJECT_DIR/storage" "$PROJECT_DIR/bootstrap/cache" "$PROJECT_DIR/database"
chmod 660 "$PROJECT_DIR/database/database.sqlite"

install -m 644 "$PROJECT_DIR/deploy/systemd/blitzgrid-gameserver.service" /etc/systemd/system/blitzgrid-gameserver.service
systemctl daemon-reload
systemctl enable blitzgrid-gameserver
systemctl restart blitzgrid-gameserver
systemctl is-active --quiet blitzgrid-gameserver
echo "✅ blitzgrid-gameserver restarted successfully."

echo "================================================="
echo "🚀 BLITZGRID DEPLOYMENT COMPLETE -> https://blitzgrid.co.uk"
echo "================================================="
