import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { articles, countries, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// ========================================
// GET /api/articles
// Liste tous les articles avec leurs relations
// ========================================
export const GET: APIRoute = async ({ url }) => {
  try {
    // Récupérer les paramètres de requête (optionnel pour filtres futurs)
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    // Requête principale avec jointures
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

    // Retourner les résultats en JSON
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
