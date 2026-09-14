#!/usr/bin/env bash
# =========================================================================
# BLITZGRID // Production VPS Deployment Script
# Target Domain: blitzgrid.co.uk
# Path: /var/www/blitzgrid
# =========================================================================

set -e

PROJECT_DIR="/var/www/blitzgrid"
cd "$PROJECT_DIR"

echo "⚡ [1/7] Fetching latest repository code..."
if [ -d ".git" ]; then
    git pull origin main || true
fi

echo "📦 [2/7] Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

echo "🎨 [3/7] Building Frontend React / Inertia Assets..."
npm ci || npm install
npm run build
rm -f public/hot

echo "🎮 [4/7] Installing Node.js Game Server Dependencies..."
cd "$PROJECT_DIR/server"
npm ci || npm install
cd "$PROJECT_DIR"

echo "🗄️ [5/7] Preparing Database & Running Migrations..."
touch "$PROJECT_DIR/database/database.sqlite"
php artisan migrate --force
php artisan db:seed --class=Database\\Seeders\\DatabaseSeeder --force
php artisan db:seed --class=Database\\Seeders\\LeaderboardSeeder --force

echo "⚡ [6/7] Optimizing Laravel Caches..."
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔒 [7/7] Setting permissions & restarting Game Server..."
chown -R www-data:www-data "$PROJECT_DIR/storage" "$PROJECT_DIR/bootstrap/cache" "$PROJECT_DIR/database"
chmod -R 775 "$PROJECT_DIR/storage" "$PROJECT_DIR/bootstrap/cache" "$PROJECT_DIR/database"
chmod 664 "$PROJECT_DIR/database/database.sqlite"

if systemctl is-active --quiet blitzgrid-gameserver; then
    systemctl restart blitzgrid-gameserver
    echo "✅ blitzgrid-gameserver restarted successfully."
else
    echo "⚠️ blitzgrid-gameserver service is not running. Start it with: systemctl start blitzgrid-gameserver"
fi

echo "================================================="
echo "🚀 BLITZGRID DEPLOYMENT COMPLETE -> https://blitzgrid.co.uk"
echo "================================================="
