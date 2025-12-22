export const prerender = false;

import type { APIRoute } from 'astro';
import { deleteSessionCookie } from '@/lib/auth';

// ========================================
// POST /api/auth/logout
// Déconnecter un utilisateur
// ========================================
export const POST: APIRoute = async ({ cookies }) => {
  // Supprimer le cookie de session
  deleteSessionCookie(cookies);

  return new Response(
    JSON.stringify({ success: true }), 
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
