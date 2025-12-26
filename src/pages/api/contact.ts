import type { APIRoute } from "astro";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50),
  lastname: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50),
  email: z.string().email("Adresse email invalide"),
  subject: z
    .string()
    .min(3, "Le sujet doit contenir au moins 3 caractères")
    .max(200),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000),
  consent: z.literal("on").or(z.literal("true")).or(z.boolean()),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const clientIP = clientAddress || "unknown";
    const rateLimitResult = checkRateLimit(clientIP, "contact", 10, 60 * 60 * 1000);

    if (!rateLimitResult.allowed) {
      const waitMinutes = Math.ceil((rateLimitResult.resetAt - Date.now()) / 60000);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Trop de soumissions. Réessayez dans ${waitMinutes} minute${waitMinutes > 1 ? "s" : ""}.`,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const emailData = {
      from: validatedData.email,
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
      subject: validatedData.subject,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
    };

    console.log("Contact form submission:", emailData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Votre message a été envoyé avec succès !",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Données invalides",
          errors: error.errors.map((e: z.ZodIssue) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message:
          "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
