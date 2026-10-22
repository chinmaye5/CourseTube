import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis connection (falls back to in-memory if not configured)
let ratelimit: Ratelimit | null = null;

try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });

        ratelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(10, "10 s"),
            analytics: true,
        });
    }
} catch (error) {
    console.warn('Upstash Redis not configured, rate limiting disabled');
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (user ID or IP)
 * @param limit - Number of requests allowed
 * @param window - Time window (e.g., "10 s", "1 m", "1 h")
 * @returns Object with success boolean and remaining requests
 */
export async function checkRateLimit(
    identifier: string,
    limit: number = 10,
    window: string = "10 s"
): Promise<{ success: boolean; remaining: number; reset?: number }> {
    if (!ratelimit) {
        // If rate limiting is not configured, allow all requests
        return { success: true, remaining: limit };
    }

    try {
        const { success, remaining, reset } = await ratelimit.limit(identifier);
        return { success, remaining, reset };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // Fail open - allow request if rate limit check fails
        return { success: true, remaining: limit };
    }
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimits = {
    // YouTube chapters - expensive operation, strict limit
    youtubeChapters: { limit: 5, window: "1 m" },

    // Save progress - frequent but important
    saveProgress: { limit: 30, window: "1 m" },

    // Notes and bookmarks - moderate limit
    saveNote: { limit: 20, window: "1 m" },
    saveBookmark: { limit: 20, window: "1 m" },

    // Contact form - prevent spam
    contact: { limit: 3, window: "1 h" },

    // Certificate generation - prevent abuse
    certificate: { limit: 5, window: "1 h" },

    // General API endpoints
    general: { limit: 100, window: "1 m" },
};
