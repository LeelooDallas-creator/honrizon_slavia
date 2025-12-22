export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { articles, countries, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { articleSchema } from '@/lib/validations';
import { z } from 'zod';

// ========================================
// GET /api/articles
// Liste tous les articles avec leurs relations
// ========================================
export const GET: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    const results = await db
      .select({
        article: articles,
        country: countries,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(articles)
      .leftJoin(countries, eq(articles.countryId, countries.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.createdAt));

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('❌ Erreur GET /api/articles:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur lors de la récupération des articles' 
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// ========================================
// POST /api/articles
// Créer un nouvel article
// ========================================
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // TODO: Vérifier l'authentification (Ticket 7)
    // const session = requireAuth(cookies);

    const body = await request.json();
    const data = articleSchema.parse(body);

    const [newArticle] = await db.insert(articles).values({
      ...data,
      authorId: 'd1ba2063-2a1c-4384-afe4-239c79d04c61', // TODO: session.userId
      publishedAt: data.status === 'published' ? new Date() : null,
    }).returning();

    return new Response(JSON.stringify(newArticle), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
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
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.error('❌ Erreur POST /api/articles:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur lors de la création de l\'article' 
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

