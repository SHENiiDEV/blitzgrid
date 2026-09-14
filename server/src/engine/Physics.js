export class Physics {
    /**
     * Calculate Euclidean distance between two points
     */
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Squared distance (avoids sqrt for fast threshold checks)
     */
    static distanceSq(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    /**
     * Normalize angle to range [-PI, PI]
     */
    static normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }

    /**
     * Shortest difference between two angles
     */
    static angleDifference(target, current) {
        return this.normalizeAngle(target - current);
    }

    /**
     * Rotate angle towards target by maxDelta
     */
    static rotateTowards(current, target, maxDelta) {
        const diff = this.angleDifference(target, current);
        if (Math.abs(diff) <= maxDelta) {
            return target;
        }
        return current + Math.sign(diff) * maxDelta;
    }

    /**
     * Circle vs Circle collision detection
     */
    static circleCircleOverlap(x1, y1, r1, x2, y2, r2) {
        const distSq = this.distanceSq(x1, y1, x2, y2);
        const radiusSum = r1 + r2;
        return distSq < (radiusSum * radiusSum);
    }

    /**
     * Circle vs Axis-Aligned Bounding Box (Obstacle) collision detection & response
     */
    static circleAABBCollision(cx, cy, radius, box) {
        // Find closest point on box to circle center
        const closestX = Math.max(box.x, Math.min(cx, box.x + box.w));
        const closestY = Math.max(box.y, Math.min(cy, box.y + box.h));

        const dx = cx - closestX;
        const dy = cy - closestY;
        const distSq = dx * dx + dy * dy;

        if (distSq < radius * radius) {
            const dist = Math.sqrt(distSq) || 0.0001;
            const overlap = radius - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            return {
                collided: true,
                penetration: overlap,
                normalX: nx,
                normalY: ny,
                resolvedX: cx + nx * overlap,
                resolvedY: cy + ny * overlap,
            };
        }

        return { collided: false };
    }

    /**
     * Line segment to circle intersection (bullet hit test)
     */
    static lineCircleIntersection(p1x, p1y, p2x, p2y, cx, cy, radius) {
        const dx = p2x - p1x;
        const dy = p2y - p1y;
        const lenSq = dx * dx + dy * dy;

        if (lenSq === 0) {
            return this.distanceSq(p1x, p1y, cx, cy) <= radius * radius;
        }

        // Project circle center onto line segment
        const t = Math.max(0, Math.min(1, ((cx - p1x) * dx + (cy - p1y) * dy) / lenSq));
        const projX = p1x + t * dx;
        const projY = p1y + t * dy;

        return this.distanceSq(cx, cy, projX, projY) <= radius * radius;
    }
}
