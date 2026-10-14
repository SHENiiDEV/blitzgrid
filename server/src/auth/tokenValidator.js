import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';

export function validateGameToken(token) {
    if (typeof token !== 'string' || token.length > 8192) return null;

    try {
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: 'blitzgrid-portal',
        });
        if (!Number.isSafeInteger(decoded.user_id) || decoded.user_id <= 0 || decoded.is_guest || !Number.isFinite(decoded.exp)) return null;
        return decoded;
    } catch {
        return null;
    }
}
