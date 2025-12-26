import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(255, "Le titre ne peut pas dépasser 255 caractères"),

  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(255, "Le slug ne peut pas dépasser 255 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets",
    ),

  excerpt: z
    .string()
    .max(500, "Le résumé ne peut pas dépasser 500 caractères")
    .optional(),

  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères"),

  coverImageUrl: z
    .string()
    .url("L'URL de l'image doit être valide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),

  pdfUrl: z
    .string()
    .url("L'URL du PDF doit être valide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),

  type: z.enum(["inspiration", "carnet", "ressource"], {
    errorMap: () => ({
      message: 'Le type doit être "inspiration", "carnet" ou "ressource"',
    }),
  }),

  status: z.enum(["draft", "published"], {
    errorMap: () => ({ message: 'Le statut doit être "draft" ou "published"' }),
  }),

  countryId: z
    .string()
    .uuid("L'ID du pays doit être un UUID valide")
    .optional()
    .nullable(),

  readingTime: z
    .number()
    .int("Le temps de lecture doit être un nombre entier")
    .min(1, "Le temps de lecture doit être d'au moins 1 minute")
    .max(60, "Le temps de lecture ne peut pas dépasser 60 minutes")
    .optional()
    .nullable(),
});

export type ArticleInput = z.infer<typeof articleSchema>;

export const loginSchema = z.object({
  email: z.string().email("L'adresse email n'est pas valide"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email("L'adresse email n'est pas valide"),

    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),

    confirmPassword: z.string(),

    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(100, "Le prénom ne peut pas dépasser 100 caractères"),

    lastName: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),

    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
      .regex(
        /[A-Z]/,
        "Le nouveau mot de passe doit contenir au moins une majuscule",
      )
      .regex(
        /[a-z]/,
        "Le nouveau mot de passe doit contenir au moins une minuscule",
      )
      .regex(
        /[0-9]/,
        "Le nouveau mot de passe doit contenir au moins un chiffre",
      ),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Allows updating only certain article fields
export const articleUpdateSchema = articleSchema.partial();

export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;
