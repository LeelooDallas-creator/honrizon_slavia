import bcrypt from 'bcryptjs';
import type { AstroCookies } from 'astro';

// ========================================
// CONFIGURATION
// ========================================
const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes

// ========================================
// GESTION DES MOTS DE PASSE
// ========================================

/**
 * Hasher un mot de passe avec bcrypt (cost 12)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Vérifier qu'un mot de passe correspond au hash
 */
export async function verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ========================================
// GESTION DES SESSIONS
// ========================================

interface SessionPayload {
  userId: string;
  exp: number; // Timestamp d'expiration
}

/**
 * Créer un token de session
 */
export function createSession(userId: string): string {
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_DURATION,
  };
  
  // En production, utilise un vrai JWT ou un store de sessions
  // Pour la v1, on encode simplement en base64
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Vérifier et décoder un token de session
 */
export function verifySession(token: string): { userId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const payload: SessionPayload = JSON.parse(decoded);
    
    // Vérifier l'expiration
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return { userId: payload.userId };
  } catch (error) {
    return null;
  }
}

/**
 * Récupérer la session depuis les cookies
 */
export function getSession(cookies: AstroCookies): { userId: string } | null {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  return verifySession(token);
}

/**
 * Vérifier l'authentification (lance une erreur 401 si non connecté)
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
 * Créer un cookie de session sécurisé
 */
export function setSessionCookie(cookies: AstroCookies, userId: string): void {
  const token = createSession(userId);
  
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // Pas accessible via JavaScript (sécurité XSS)
    secure: import.meta.env.PROD, // HTTPS uniquement en production
    sameSite: 'strict', // Protection CSRF
    maxAge: 30 * 60, // 30 minutes en secondes
    path: '/',
  });
}

/**
 * Supprimer le cookie de session
 */
export function deleteSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
