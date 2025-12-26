export const prerender = false;

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { changePasswordSchema } from "@/lib/validations";
import {
  verifyPassword,
  hashPassword,
  requireAuth,
  verifyCsrfToken,
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verify authentication
    const { userId } = requireAuth(cookies);

    // Rate limiting per user (3 attempts per hour)
    const rateLimitResult = checkRateLimit(userId, "login", 3, 60 * 60 * 1000);

    if (!rateLimitResult.allowed) {
      const waitMinutes = Math.ceil((rateLimitResult.resetAt - Date.now()) / 60000);
      return new Response(
        JSON.stringify({
          error: `Trop de tentatives. Réessayez dans ${waitMinutes} minute${waitMinutes > 1 ? "s" : ""}.`,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmNewPassword, csrfToken } =
      body;

    // Verify CSRF token
    if (!verifyCsrfToken(cookies, csrfToken)) {
      return new Response(JSON.stringify({ error: "Token CSRF invalide" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate input
    const validatedData = changePasswordSchema.parse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Le mot de passe actuel est incorrect" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Update password in database
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Reset rate limit on successful password change
    resetRateLimit(userId, "login");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Mot de passe modifié avec succès",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
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

    console.error("Erreur POST /api/auth/change-password:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
