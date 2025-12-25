export const prerender = false;

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/validations";
import { verifyPassword, setSessionCookie, verifyCsrfToken } from "@/lib/auth";
import { z } from "zod";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password, csrfToken } = body;

    // Verify CSRF token
    if (!verifyCsrfToken(cookies, csrfToken)) {
      return new Response(JSON.stringify({ error: "Token CSRF invalide" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    loginSchema.parse({ email, password });

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await verifyPassword(password, user.password))) {
      return new Response(JSON.stringify({ error: "Identifiants invalides" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    setSessionCookie(cookies, user.id);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
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

    console.error("Erreur POST /api/auth/login:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
