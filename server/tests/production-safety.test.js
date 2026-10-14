import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';

process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.GAME_SERVER_API_SECRET = randomBytes(32).toString('hex');
const { validateGameToken } = await import('../src/auth/tokenValidator.js');
const { setupSocketHandlers, syncPlayerMatchStats } = await import('../src/socket/handler.js');
const skin = { name: 'Owned skin', stats: { max_hp: 100, speed: 1 } };
const signedToken = (payload = {}, options = {}) => jwt.sign(
    { user_id: 1, username: 'Player', skin, ...payload },
    process.env.JWT_SECRET,
    { issuer: 'blitzgrid-portal', expiresIn: '2h', ...options },
);

test('rejects mock, malformed, expired, guest and wrongly signed tokens', () => {
    for (const token of ['mock_commander', null, {}, 'bad-token', signedToken({}, { expiresIn: -1 }), signedToken({ is_guest: true }), signedToken({ user_id: '1' }), signedToken({}, { issuer: 'wrong' })]) {
        assert.equal(validateGameToken(token), null);
    }
    assert.equal(validateGameToken(jwt.sign({ user_id: 1 }, 'wrong-key')), null);
    assert.equal(validateGameToken(signedToken()).user_id, 1);
});

test('uses signed skin stats and rejects repeated auth_join on one socket', () => {
    const handlers = {};
    let connection;
    const players = [];
    const world = { width: 1000, height: 1000, obstacles: [], addPlayer: player => players.push(player) };
    setupSocketHandlers({ on: (_, callback) => { connection = callback; } }, world);
    connection({ id: 'socket_123', on: (name, callback) => { handlers[name] = callback; }, emit: () => {} });

    handlers.auth_join({ token: signedToken(), skin: { stats: { max_hp: 999999, speed: 999 } } });
    handlers.auth_join({ token: signedToken() });

    assert.equal(players.length, 1);
    assert.equal(players[0].maxHp, 100);
    assert.equal(players[0].currentSpeed, 260);
});

test('retries the same result ID after a failed callback and preserves new kills', async t => {
    const sent = [];
    t.mock.method(axios, 'post', async (url, payload, options) => {
        sent.push({ ...payload });
        assert.equal(options.headers.Authorization, `Bearer ${process.env.GAME_SERVER_API_SECRET}`);
        if (sent.length === 1) throw { code: 'ETIMEDOUT' };
        return { data: { success: true } };
    });
    t.mock.method(console, 'error', () => {});
    const player = { userId: 1, name: 'Player', kills: 3, deaths: 1, damageDealt: 100, score: 100, joinedAt: Date.now(), lastSavedKills: 0, lastSavedDeaths: 0, lastSavedDamage: 0, lastSavedScore: 0 };

    await syncPlayerMatchStats(player);
    player.kills = 4;
    await syncPlayerMatchStats(player);
    await syncPlayerMatchStats(player);

    assert.equal(sent[0].result_id, sent[1].result_id);
    assert.notEqual(sent[1].result_id, sent[2].result_id);
    assert.equal(sent[2].kills, 1);
    assert.equal(player.lastSavedKills, 4);
});

test('idle sync does not call the rewards API', async t => {
    let called = false;
    t.mock.method(axios, 'post', async () => { called = true; });

    await syncPlayerMatchStats({ kills: 0, deaths: 0, damageDealt: 0, score: 0, joinedAt: 0 });

    assert.equal(called, false);
});
