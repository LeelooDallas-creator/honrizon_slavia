export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { articleSchema } from '@/lib/validations';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

// ========================================
// GET /api/articles/:id
// Récupérer un article spécifique
// ========================================
export const GET: APIRoute = async ({ params }) => {
  try {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, params.id!));

    if (!article) {
      return new Response(
        JSON.stringify({ error: 'Article non trouvé' }), 
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erreur GET /api/articles/:id:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// ========================================
// PUT /api/articles/:id
// Modifier un article existant
// ========================================
export const PUT: APIRoute = async ({ params, request }) => {
  try {
const session = requireAuth(cookies);

    const body = await request.json();
    const data = articleSchema.parse(body);

    const [updated] = await db
      .update(articles)
      .set({
        ...data,
        updatedAt: new Date(),
        publishedAt: data.status === 'published' ? new Date() : null,
      })
      .where(eq(articles.id, params.id!))
      .returning();

    if (!updated) {
      return new Response(
        JSON.stringify({ error: 'Article non trouvé' }), 
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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

    console.error('❌ Erreur PUT /api/articles/:id:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// ========================================
// DELETE /api/articles/:id
// Supprimer un article
// ========================================
export const DELETE: APIRoute = async ({ params }) => {
  try {
const session = requireAuth(cookies);

    const result = await db
      .delete(articles)
      .where(eq(articles.id, params.id!))
      .returning();

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Article non trouvé' }), 
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Status 204 = No Content (succès sans body)
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('❌ Erreur DELETE /api/articles/:id:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
