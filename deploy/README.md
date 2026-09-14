# BLITZGRID // VPS Deployment Guide

This guide describes how to deploy **BlitzGrid** on an Ubuntu/Debian VPS with **Nginx**, **PHP-FPM 8.4**, and **Node.js**.

- **Domain:** `blitzgrid.co.uk`
- **Application Path:** `/var/www/blitzgrid`
- **PHP Version:** PHP 8.4-FPM
- **Game Server:** Node.js (Port 3001, proxied via Nginx `/socket.io/`)

---

## 1. Initial VPS Setup & Directory Placement

Clone or transfer the repository into `/var/www/blitzgrid`:

```bash
sudo mkdir -p /var/www/blitzgrid
sudo chown -R $USER:$USER /var/www/blitzgrid

# Upload or clone repository:
git clone <YOUR_GIT_REPO_URL> /var/www/blitzgrid
cd /var/www/blitzgrid
```

---

## 2. Environment Configuration

```bash
cp deploy/.env.production.example .env
php artisan key:generate
```

Review `.env` to make sure `APP_URL=https://blitzgrid.co.uk` and `GAME_SERVER_URL=https://blitzgrid.co.uk`.

---

## 3. Configure Nginx Virtual Host

```bash
# 1. Copy Nginx configuration
sudo cp deploy/nginx/blitzgrid.co.uk.conf /etc/nginx/sites-available/blitzgrid.co.uk

# 2. Enable the site
sudo ln -sf /etc/nginx/sites-available/blitzgrid.co.uk /etc/nginx/sites-enabled/

# 3. Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Setup Node.js Game Server as a Systemd Daemon

```bash
# 1. Copy service file
sudo cp deploy/systemd/blitzgrid-gameserver.service /etc/systemd/system/

# 2. Reload systemd daemon
sudo systemctl daemon-reload

# 3. Enable and start game server
sudo systemctl enable --now blitzgrid-gameserver

# 4. Check status
sudo systemctl status blitzgrid-gameserver
```

---

## 5. Run Automated Deployment Script

```bash
chmod +x deploy/deploy.sh
sudo ./deploy/deploy.sh
```

---

## 6. SSL Certificate (Certbot)

Once the domain DNS A-record points to the server IP:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d blitzgrid.co.uk -d www.blitzgrid.co.uk
```
