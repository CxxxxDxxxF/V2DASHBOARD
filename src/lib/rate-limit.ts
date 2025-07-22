interface RateLimitConfig {
  limit: number
  window: number // in milliseconds
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  checkLimit(identifier: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = `${identifier}:${Math.floor(now / config.window)}`

    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + config.window
      }
    }

    const entry = this.store[key]
    
    if (entry.count >= config.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    entry.count++
    
    return {
      allowed: true,
      remaining: config.limit - entry.count,
      resetTime: entry.resetTime
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter()

export function checkRateLimit(identifier: string, config: RateLimitConfig) {
  return rateLimiter.checkLimit(identifier, config)
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  AUTH: { limit: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  API: { limit: 100, window: 60 * 1000 }, // 100 requests per minute
  UPLOAD: { limit: 10, window: 60 * 1000 }, // 10 uploads per minute
  GENERIC: { limit: 50, window: 60 * 1000 }, // 50 requests per minute
} as const

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback for development
  return '127.0.0.1'
}

// Cleanup on process exit
process.on('exit', () => {
  rateLimiter.destroy()
}) 