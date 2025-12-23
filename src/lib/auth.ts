import bcrypt from 'bcryptjs';
import type { AstroCookies } from 'astro';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const SESSION_SECRET = import.meta.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be defined in environment variables');
}

/**
 * Hash a password with bcrypt (cost 12)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify that a password matches the hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

interface SessionPayload {
  userId: string;
  exp: number; // Expiration timestamp
}

/**
 * Create an HMAC signature for a payload
 */
function createSignature(data: string): string {
  return createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('hex');
}

/**
 * Verify an HMAC signature (timing-safe)
 */
function verifySignature(data: string, signature: string): boolean {
  const expected = createSignature(data);

  // Protection against timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Create a session token signed with HMAC
 */
export function createSession(userId: string): string {
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_DURATION,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = createSignature(data);

  return `${data}.${signature}`;
}

/**
 * Verify and decode a signed session token
 */
export function verifySession(token: string): { userId: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }

    const [data, signature] = parts;

    if (!verifySignature(data, signature)) {
      return null;
    }

    const decoded = Buffer.from(data, 'base64').toString('utf-8');
    const payload: SessionPayload = JSON.parse(decoded);

    // Verify expiration
    if (payload.exp < Date.now()) {
      return null;
    }

    return { userId: payload.userId };
  } catch (error) {
    return null;
  }
}

/**
 * Get session from cookies
 */
export function getSession(cookies: AstroCookies): { userId: string } | null {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Verify authentication (throws 401 if not authenticated)
 */
export function requireAuth(cookies: AstroCookies): { userId: string } {
  const session = getSession(cookies);

  if (!session) {
    throw new Response(
      JSON.stringify({ error: 'Non authentifié' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return session;
}

/**
 * Create a secure session cookie
 */
export function setSessionCookie(cookies: AstroCookies, userId: string): void {
  const token = createSession(userId);

  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // Not accessible via JavaScript (XSS protection)
    secure: import.meta.env.PROD, // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 30 * 60, // 30 minutes in seconds
    path: '/',
  });
}

/**
 * Delete session cookie
 */
export function deleteSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(randomBytes).toString('hex');
}

/**
 * Create and store a CSRF token in cookies
 */
export function setCsrfToken(cookies: AstroCookies): string {
  const token = generateCsrfToken();

  cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  return token;
}

/**
 * Get CSRF token from cookies
 */
export function getCsrfToken(cookies: AstroCookies): string | null {
  return cookies.get(CSRF_COOKIE_NAME)?.value || null;
}

/**
 * Verify that a CSRF token is valid (timing-safe)
 */
export function verifyCsrfToken(cookies: AstroCookies, submittedToken: string): boolean {
  const storedToken = getCsrfToken(cookies);

  if (!storedToken || !submittedToken) {
    return false;
  }

  try {
    return timingSafeEqual(
      Buffer.from(storedToken),
      Buffer.from(submittedToken)
    );
  } catch {
    return false;
  }
}
