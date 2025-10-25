/**
 * Security utilities for Converto Business OS
 * Includes honeypot, rate limiting, and input validation
 */

// Honeypot field names (hidden fields that bots fill)
export const HONEYPOT_FIELDS: string[] = ['website', 'url', 'homepage', 'site'];

// Rate limiting configuration
export const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  signup: { max: 5, window: 60 * 60 * 1000 }, // 5 per hour
  contact: { max: 3, window: 60 * 60 * 1000 }, // 3 per hour
  api: { max: 100, window: 60 * 1000 }, // 100 per minute
};

// Input validation patterns
export const VALIDATION_PATTERNS: Record<string, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  company: /^[a-zA-Z0-9\s\-\.\&]{2,100}$/,
  name: /^[a-zA-ZäöåÄÖÅ\s]{2,50}$/,
};

// Security headers
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Check if request is from a bot using honeypot
 */
export function isBotRequest(formData: FormData): boolean {
  for (const field of HONEYPOT_FIELDS) {
    const value = formData.get(field);
    if (value && value.toString().trim() !== '') {
      return true;
    }
  }
  return false;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email);
}

/**
 * Validate company name
 */
export function isValidCompany(company: string): boolean {
  return VALIDATION_PATTERNS.company.test(company);
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Get client IP for rate limiting
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Rate limiting check
 */
export function checkRateLimit(
  ip: string,
  action: keyof typeof RATE_LIMITS,
  store: Map<string, { count: number; resetTime: number }>
): boolean {
  const limit = RATE_LIMITS[action];
  const key = `${ip}:${action}`;
  const now = Date.now();

  const current = store.get(key);

  if (!current || now > current.resetTime) {
    store.set(key, { count: 1, resetTime: now + limit.window });
    return true;
  }

  if (current.count >= limit.max) {
    return false;
  }

  current.count++;
  return true;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}
