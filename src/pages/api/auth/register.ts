export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Registration endpoint - DISABLED
 *
 * This endpoint has been disabled to ensure only one admin account exists.
 * The admin account (sannier.lena@icloud.com) has been created and is the only
 * authorized administrator for this application.
 *
 * If you need to re-enable registration in the future, restore the code from
 * git history or implement additional security measures to control who can register.
 */

export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: 'L\'inscription est désactivée. Un administrateur existe déjà.'
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
