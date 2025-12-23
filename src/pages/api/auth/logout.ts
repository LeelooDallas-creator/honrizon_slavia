export const prerender = false;

import type { APIRoute } from 'astro';
import { deleteSessionCookie, verifyCsrfToken } from '@/lib/auth';

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    const formData = await request.formData();
    const csrfToken = formData.get('csrf_token') as string;

    // Verify CSRF token
    if (!verifyCsrfToken(cookies, csrfToken)) {
      return new Response(
        JSON.stringify({ error: 'Token CSRF invalide' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    deleteSessionCookie(cookies);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
