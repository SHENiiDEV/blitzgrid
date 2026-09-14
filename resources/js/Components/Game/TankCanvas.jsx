import React, { useEffect, useRef, useState } from 'react';

// Math helpers
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpAngle(a, b, t) {
    let diff = (b - a) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    return a + diff * t;
}

export default function TankCanvas({
    socket,
    playerId,
    worldWidth = 2800,
    worldHeight = 2800,
    obstacles = [],
    onPlayerStateUpdate,
    onKillEvent,
    onGameOver,
}) {
    const canvasRef = useRef(null);

    // Entity buffer for client-side interpolation
    const tanksRef = useRef(new Map()); // id -> { current, target, lastUpdate }
    const bulletsRef = useRef([]);
    const powerupsRef = useRef([]);
    const particlesRef = useRef([]);
    const tracksRef = useRef([]); // Tread marks

    // Local inputs
    const inputRef = useRef({
        w: false,
        s: false,
        a: false,
        d: false,
        angle: 0,
        fire: false,
    });

    const cameraRef = useRef({ x: worldWidth / 2, y: worldHeight / 2 });
    const myTankRef = useRef(null);

    // 1. Setup Keyboard & Mouse Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            let changed = false;

            if (['w', 'arrowup'].includes(key) && !inputRef.current.w) {
                inputRef.current.w = true;
                changed = true;
            }
            if (['s', 'arrowdown'].includes(key) && !inputRef.current.s) {
                inputRef.current.s = true;
                changed = true;
            }
            if (['a', 'arrowleft'].includes(key) && !inputRef.current.a) {
                inputRef.current.a = true;
                changed = true;
            }
            if (['d', 'arrowright'].includes(key) && !inputRef.current.d) {
                inputRef.current.d = true;
                changed = true;
            }
            if (e.code === 'Space' && !inputRef.current.fire) {
                inputRef.current.fire = true;
                changed = true;
            }

            if (changed && socket) {
                socket.emit('input_state', inputRef.current);
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            let changed = false;

            if (['w', 'arrowup'].includes(key)) {
                inputRef.current.w = false;
                changed = true;
            }
            if (['s', 'arrowdown'].includes(key)) {
                inputRef.current.s = false;
                changed = true;
            }
            if (['a', 'arrowleft'].includes(key)) {
                inputRef.current.a = false;
                changed = true;
            }
            if (['d', 'arrowright'].includes(key)) {
                inputRef.current.d = false;
                changed = true;
            }
            if (e.code === 'Space') {
                inputRef.current.fire = false;
                changed = true;
            }

            if (changed && socket) {
                socket.emit('input_state', inputRef.current);
            }
        };

        const handleMouseMove = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mouseScreenX = e.clientX - rect.left;
            const mouseScreenY = e.clientY - rect.top;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const angle = Math.atan2(mouseScreenY - centerY, mouseScreenX - centerX);
            inputRef.current.angle = angle;

            if (socket) {
                socket.emit('input_state', inputRef.current);
            }
        };

        const handleMouseDown = (e) => {
            if (e.button === 0) { // Left click
                inputRef.current.fire = true;
                if (socket) socket.emit('input_state', inputRef.current);
            }
        };

        const handleMouseUp = (e) => {
            if (e.button === 0) {
                inputRef.current.fire = false;
                if (socket) socket.emit('input_state', inputRef.current);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [socket]);

    // 2. Setup Socket Listeners
    useEffect(() => {
        if (!socket) return;

        const handleWorldState = (state) => {
            const now = performance.now();

            // Update Tank Buffer
            const activeIds = new Set();
            state.tanks.forEach((serverTank) => {
                activeIds.add(serverTank.id);

                if (serverTank.id === playerId) {
                    myTankRef.current = serverTank;
                    if (onPlayerStateUpdate) {
                        onPlayerStateUpdate(serverTank);
                    }
                    if (serverTank.isDead && onGameOver) {
                        onGameOver(serverTank);
                    }
                }

                const existing = tanksRef.current.get(serverTank.id);
                if (existing) {
                    existing.target = { ...serverTank };
                    existing.lastUpdate = now;
                } else {
                    tanksRef.current.set(serverTank.id, {
                        current: { ...serverTank },
                        target: { ...serverTank },
                        lastUpdate: now,
                    });
                }
            });

            // Cleanup removed tanks
            for (const id of tanksRef.current.keys()) {
                if (!activeIds.has(id)) {
                    tanksRef.current.delete(id);
                }
            }

            bulletsRef.current = state.bullets || [];
            powerupsRef.current = state.powerups || [];

            // Trigger events (explosions, kill feeds)
            if (state.events && state.events.length > 0) {
                state.events.forEach((ev) => {
                    if (ev.type === 'event_kill') {
                        createExplosion(ev.x, ev.y, 40, '#ff0055');
                        if (onKillEvent) onKillEvent(ev);
                    } else if (ev.type === 'tank_hit') {
                        createExplosion(ev.x, ev.y, 12, ev.color || '#00f0ff');
                    } else if (ev.type === 'hit_obstacle') {
                        createExplosion(ev.x, ev.y, 8, '#ffffff');
                    }
                });
            }
        };

        socket.on('world_state', handleWorldState);

        return () => {
            socket.off('world_state', handleWorldState);
        };
    }, [socket, playerId]);

    // Spawn Particles Helper
    const createExplosion = (x, y, count = 20, color = '#00f0ff') => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 250;
            particlesRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 5,
                color,
                alpha: 1,
                decay: 0.8 + Math.random() * 1.5,
            });
        }
    };

    // 3. 60 FPS Canvas Rendering & Interpolation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let lastFrameTime = performance.now();

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const render = (now) => {
            const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
            lastFrameTime = now;

            // Interpolate Tanks
            const lerpFactor = 0.25; // Smooth 60hz interpolation
            for (const entry of tanksRef.current.values()) {
                const { current, target } = entry;
                current.x = lerp(current.x, target.x, lerpFactor);
                current.y = lerp(current.y, target.y, lerpFactor);
                current.hullAngle = lerpAngle(current.hullAngle, target.hullAngle, lerpFactor);
                current.turretAngle = lerpAngle(current.turretAngle, target.turretAngle, 0.4);
                current.hp = target.hp;
                current.shield = target.shield;
                current.isDead = target.isDead;
                current.buffs = target.buffs;

                // Leave tread tracks if moving
                if (Math.hypot(target.vx || 0, target.vy || 0) > 20 && Math.random() < 0.3) {
                    tracksRef.current.push({
                        x: current.x,
                        y: current.y,
                        angle: current.hullAngle,
                        alpha: 0.35,
                    });
                    if (tracksRef.current.length > 200) {
                        tracksRef.current.shift();
                    }
                }
            }

            // Smooth Camera Follow
            const myTank = tanksRef.current.get(playerId)?.current || myTankRef.current;
            if (myTank) {
                cameraRef.current.x = lerp(cameraRef.current.x, myTank.x, 0.15);
                cameraRef.current.y = lerp(cameraRef.current.y, myTank.y, 0.15);
            }

            const camX = cameraRef.current.x;
            const camY = cameraRef.current.y;
            const screenW = canvas.width;
            const screenH = canvas.height;

            // Clear Screen
            ctx.fillStyle = '#050814';
            ctx.fillRect(0, 0, screenW, screenH);

            ctx.save();
            // Transform view centered on camera
            ctx.translate(screenW / 2 - camX, screenH / 2 - camY);

            // 1. Draw World Arena Grid
            drawArenaGrid(ctx, worldWidth, worldHeight);

            // 2. Draw Tread Tracks
            drawTracks(ctx, tracksRef.current, dt);

            // 3. Draw Obstacles
            drawObstacles(ctx, obstacles);

            // 4. Draw Powerups
            drawPowerups(ctx, powerupsRef.current, now);

            // 5. Draw Tanks
            for (const entry of tanksRef.current.values()) {
                const tank = entry.current;
                if (!tank.isDead) {
                    drawTank(ctx, tank, tank.id === playerId);
                }
            }

            // 6. Draw Bullets
            drawBullets(ctx, bulletsRef.current);

            // 7. Draw & Update Particles
            updateAndDrawParticles(ctx, particlesRef.current, dt);

            ctx.restore();

            // 8. Draw Screen Overlay HUD Reticle & Laser line from player to mouse
            if (myTank && !myTank.isDead) {
                drawAimGuide(ctx, screenW / 2, screenH / 2, inputRef.current.angle);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [worldWidth, worldHeight, obstacles, playerId]);

    // Canvas Sub-renderers
    const drawArenaGrid = (ctx, w, h) => {
        // Outer boundary border
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 20;
        ctx.strokeRect(0, 0, w, h);
        ctx.shadowBlur = 0;

        // Grid lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 100;
        for (let x = 0; x <= w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y <= h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    };

    const drawTracks = (ctx, tracks, dt) => {
        for (let i = tracks.length - 1; i >= 0; i--) {
            const t = tracks[i];
            t.alpha -= dt * 0.05; // Fade over time
            if (t.alpha <= 0) {
                tracks.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(t.angle);
            ctx.fillStyle = `rgba(0, 240, 255, ${t.alpha * 0.15})`;
            ctx.fillRect(-18, -14, 36, 6);
            ctx.fillRect(-18, 8, 36, 6);
            ctx.restore();
        }
    };

    const drawObstacles = (ctx, obstacles) => {
        obstacles.forEach((obs) => {
            ctx.save();
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.3)';
            ctx.shadowBlur = 10;

            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

            // Tech diagonal hazard stripes or core glow
            if (obs.type === 'core') {
                ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
                ctx.fillRect(obs.x + 20, obs.y + 20, obs.w - 40, obs.h - 40);
                ctx.strokeStyle = '#00f0ff';
                ctx.strokeRect(obs.x + 20, obs.y + 20, obs.w - 40, obs.h - 40);
            }

            ctx.restore();
        });
    };

    const drawPowerups = (ctx, powerups, now) => {
        powerups.forEach((p) => {
            const pulse = 1 + Math.sin(now * 0.006) * 0.15;
            ctx.save();
            ctx.translate(p.x, p.y);

            let color = '#22c55e'; // health
            let label = '+';
            if (p.type === 'shield') { color = '#00f0ff'; label = '🛡️'; }
            else if (p.type === 'speed') { color = '#eab308'; label = '⚡'; }
            else if (p.type === 'overdrive') { color = '#ec4899'; label = '🔥'; }

            // Glowing aura ring
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, 18 * pulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fill();

            // Icon / text
            ctx.fillStyle = color;
            ctx.font = 'bold 16px "Chakra Petch", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 1);

            ctx.restore();
        });
    };

    const drawTank = (ctx, tank, isMe) => {
        const skin = tank.skin || {};
        const primaryColor = skin.color_primary || '#00f0ff';
        const secondaryColor = skin.color_secondary || '#ff007f';
        const glowColor = skin.color_glow || primaryColor;

        ctx.save();
        ctx.translate(tank.x, tank.y);

        // 1. Draw Energy Shield Aura if active
        if (tank.shield > 0) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
            ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, 36, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // 2. Draw Overdrive Aura
        if (tank.buffs?.overdrive) {
            ctx.save();
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(0, 0, 38, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Draw Tank Hull (Rotates with hullAngle)
        ctx.save();
        ctx.rotate(tank.hullAngle);

        // Treads (Left & Right)
        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        // Left tread
        ctx.fillRect(-22, -22, 44, 10);
        ctx.strokeRect(-22, -22, 44, 10);
        // Right tread
        ctx.fillRect(-22, 12, 44, 10);
        ctx.strokeRect(-22, 12, 44, 10);

        // Main Hull Chassis
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isMe ? 12 : 6;

        ctx.beginPath();
        ctx.roundRect(-18, -14, 36, 28, 4);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Hull Tech Accent Stripes
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(-12, -10, 6, 20);
        ctx.fillRect(6, -10, 4, 20);

        ctx.restore(); // Done hull

        // 4. Draw Turret (Rotates independently with turretAngle)
        ctx.save();
        ctx.rotate(tank.turretAngle);

        // Turret Barrel
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.fillRect(0, -4, 28, 8);
        ctx.strokeRect(0, -4, 28, 8);

        // Barrel muzzle ring
        ctx.fillStyle = glowColor;
        ctx.fillRect(24, -5, 5, 10);

        // Turret Center Dome
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Turret Core Light
        ctx.fillStyle = isMe ? '#00f0ff' : '#ff0055';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // Done turret

        // 5. Draw Nametag & Health Bars floating above tank
        ctx.save();
        const hpPercent = Math.max(0, tank.hp / tank.maxHp);
        const barWidth = 46;
        const barHeight = 5;

        // Nametag
        ctx.fillStyle = isMe ? '#00f0ff' : '#f8fafc';
        ctx.font = 'bold 11px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tank.name + (isMe ? ' (YOU)' : ''), 0, -36);

        // Health Bar Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(-barWidth / 2, -30, barWidth, barHeight);

        // Health Bar Fill
        ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';
        ctx.fillRect(-barWidth / 2, -30, barWidth * hpPercent, barHeight);

        // Shield Bar Fill (if shield > 0)
        if (tank.shield > 0) {
            const shieldPercent = Math.min(1, tank.shield / tank.maxShield);
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(-barWidth / 2, -32, barWidth * shieldPercent, 2);
        }

        ctx.restore();

        ctx.restore();
    };

    const drawBullets = (ctx, bullets) => {
        bullets.forEach((b) => {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.angle);

            const color = b.color || '#00f0ff';
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;

            // Plasma bullet pill
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Trail
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(-14, -1.5, 12, 3);

            ctx.restore();
        });
    };

    const updateAndDrawParticles = (ctx, particles, dt) => {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.alpha -= p.decay * dt;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    };

    const drawAimGuide = (ctx, screenCenterX, screenCenterY, angle) => {
        const guideLen = 70;
        const targetX = screenCenterX + Math.cos(angle) * guideLen;
        const targetY = screenCenterY + Math.sin(angle) * guideLen;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(screenCenterX, screenCenterY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        // Crosshair reticle
        ctx.strokeStyle = '#00f0ff';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    };

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair select-none"
        />
    );
}
