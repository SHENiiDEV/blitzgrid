# BLITZGRID // Cyberpunk 2D Multiplayer Tank Battle Arena

<p align="center">
  <strong>High-Octane Real-Time Multiplayer Tank Combat & Progressive Chassis Evolution System</strong>
</p>

---

## ⚡ Tech Stack

- **Frontend & UI:** React 18, Inertia.js, Tailwind CSS, Lucide Icons, Canvas 2D Renderer.
- **Backend & Auth:** Laravel 12 (PHP 8.4), SQLite / MySQL / PostgreSQL, Sanctum / Session Auth.
- **Real-Time Multiplayer Engine:** Node.js, Socket.IO, 30 TPS authoritative tick rate with delta compression and client-side interpolation.
- **Production Deployment:** Nginx + PHP-FPM 8.4 + Systemd Daemon, Certbot SSL.

---

## 🎮 Key Features

- **Real-Time Authoritative Physics:** 30 TPS server tick loop with collision detection, bullet physics, dynamic obstacle destruction, and laser / plasma weapon trajectories.
- **Chassis Rarity & Progression:**
  - Common: Up to Level 25
  - Rare: Up to Level 50
  - Epic: Up to Level 75
  - Legendary: Up to Level 100
  - Mythic: Up to Level 1000 with infinite stat scaling
- **Garage & Customization:** Real-time stat simulator, hull leveling, weapon upgrades, engine tuning, and armor plating.
- **Leaderboards & Match Analytics:** Live competitive rankings, kill/death tracker, match duration records, and country badges.
- **Production-Ready VPS Deployment:** Automated setup scripts, Nginx reverse proxy with WebSocket support, and systemd service templates under `deploy/`.

---

## 🛠️ Local Development

### 1. Requirements
- PHP 8.4+
- Composer
- Node.js 18+ & NPM

### 2. Installation
```bash
# Clone repository
git clone https://github.com/SHENiiDEV/blitzgrid.git
cd blitzgrid

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed

# Build assets
npm run build
```

### 3. Running Locally
```bash
# Terminal 1: Laravel Web App
php artisan serve

# Terminal 2: Node.js WebSocket Game Engine
node server/src/index.js

# Terminal 3: Vite Dev Server (optional for frontend hot reload)
npm run dev
```

---

## 🚀 Production Deployment

See detailed VPS deployment documentation in [`deploy/README.md`](deploy/README.md).

---

## 📄 License
Open-sourced software licensed under the MIT License.
