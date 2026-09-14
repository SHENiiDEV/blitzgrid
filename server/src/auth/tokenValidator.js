import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';

export function validateGameToken(token) {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
        return decoded;
    } catch (err) {
        // Support dev mock tokens for testing
        if (token.startsWith('mock_')) {
            return {
                user_id: 'mock_user',
                username: token.replace('mock_', 'Player_'),
                name: token.replace('mock_', 'Player '),
                skin: {
                    name: 'Neon Vanguard',
                    slug: 'neon-vanguard',
                    color_primary: '#00f0ff',
                    color_secondary: '#ff007f',
                    color_glow: '#00f0ff',
                    bullet_color: '#00f0ff',
                },
            };
        }
        console.warn('⚠️ Token validation failed:', err.message);
        return null;
    }
}
