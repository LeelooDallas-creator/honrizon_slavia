export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { z } from 'zod';

// ========================================
// POST /api/auth/login
// Authentifier un utilisateur
// ========================================
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Récupérer et valider les données
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Chercher l'utilisateur par email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    // Vérifier que l'utilisateur existe et que le mot de passe est correct
    if (!user || !(await verifyPassword(password, user.password))) {
      return new Response(
        JSON.stringify({ error: 'Identifiants invalides' }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Créer la session
    setSessionCookie(cookies, user.id);

    // Retourner les infos de l'utilisateur (sans le mot de passe)
    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Données invalides',
          details: error.errors 
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.error('❌ Erreur POST /api/auth/login:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
