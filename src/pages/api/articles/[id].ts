export const prerender = false;

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { articleSchema } from "@/lib/validations";
import { z } from "zod";
import { requireAuth, verifyCsrfToken } from "@/lib/auth";

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    requireAuth(cookies);

    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(params.id);

    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, validatedId));

    if (!article) {
      return new Response(JSON.stringify({ error: "Article non trouvé" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    if (error instanceof Response) {
      return error;
    }

    console.error("Erreur GET /api/articles/:id:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    requireAuth(cookies);

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken || !verifyCsrfToken(cookies, csrfToken)) {
      return new Response(JSON.stringify({ error: "Token CSRF invalide" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(params.id);

    const body = await request.json();
    const data = articleSchema.parse(body);

    const [updated] = await db
      .update(articles)
      .set({
        ...data,
        updatedAt: new Date(),
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .where(eq(articles.id, validatedId))
      .returning();

    if (!updated) {
      return new Response(JSON.stringify({ error: "Article non trouvé" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    if (error instanceof Response) {
      return error;
    }

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Données invalides",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.error("Erreur PUT /api/articles/:id:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies, request }) => {
  try {
    requireAuth(cookies);

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken || !verifyCsrfToken(cookies, csrfToken)) {
      return new Response(JSON.stringify({ error: "Token CSRF invalide" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(params.id);

    const result = await db
      .delete(articles)
      .where(eq(articles.id, validatedId))
      .returning();

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Article non trouvé" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Status 204 = No Content (success with no body)
    return new Response(null, { status: 204 });
  } catch {
    if (error instanceof Response) {
      return error;
    }

    console.error("Erreur DELETE /api/articles/:id:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
