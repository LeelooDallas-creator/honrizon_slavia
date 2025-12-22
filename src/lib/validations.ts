import { z } from 'zod';

// ========================================
// SCHÉMA DE VALIDATION ARTICLE
// ========================================
export const articleSchema = z.object({
  // Titre : entre 5 et 255 caractères
  title: z.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),

  // Slug : format kebab-case (lettres minuscules, chiffres, tirets)
  slug: z.string()
    .min(3, 'Le slug doit contenir au moins 3 caractères')
    .max(255, 'Le slug ne peut pas dépasser 255 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'),

  // Résumé : optionnel, max 500 caractères
  excerpt: z.string()
    .max(500, 'Le résumé ne peut pas dépasser 500 caractères')
    .optional(),

  // Contenu : minimum 50 caractères (un article doit avoir du contenu)
  content: z.string()
    .min(50, 'Le contenu doit contenir au moins 50 caractères'),

  // URL de l'image de couverture : optionnelle, doit être une URL valide
  coverImageUrl: z.string()
    .url('L\'URL de l\'image doit être valide')
    .optional(),

  // URL du PDF : optionnelle, doit être une URL valide
  pdfUrl: z.string()
    .url('L\'URL du PDF doit être valide')
    .optional(),

  // Type : doit être l'un des 3 types définis
  type: z.enum(['inspiration', 'carnet', 'ressource'], {
    errorMap: () => ({ message: 'Le type doit être "inspiration", "carnet" ou "ressource"' }),
  }),

  // Statut : draft ou published
  status: z.enum(['draft', 'published'], {
    errorMap: () => ({ message: 'Le statut doit être "draft" ou "published"' }),
  }),

  // ID du pays : optionnel (pour les ressources génériques), doit être un UUID
  countryId: z.string()
    .uuid('L\'ID du pays doit être un UUID valide')
    .optional()
    .nullable(),

  // Temps de lecture : optionnel, entre 1 et 60 minutes
  readingTime: z.number()
    .int('Le temps de lecture doit être un nombre entier')
    .min(1, 'Le temps de lecture doit être d\'au moins 1 minute')
    .max(60, 'Le temps de lecture ne peut pas dépasser 60 minutes')
    .optional()
    .nullable(),
});

// Type TypeScript généré automatiquement depuis le schéma
export type ArticleInput = z.infer<typeof articleSchema>;

// ========================================
// SCHÉMA DE VALIDATION LOGIN
// ========================================
export const loginSchema = z.object({
  // Email : doit être un email valide
  email: z.string()
    .email('L\'adresse email n\'est pas valide'),

  // Mot de passe : minimum 8 caractères
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// Type TypeScript pour le login
export type LoginInput = z.infer<typeof loginSchema>;

// ========================================
// SCHÉMA PARTIEL POUR LA MODIFICATION
// ========================================
// Permet de modifier uniquement certains champs d'un article
export const articleUpdateSchema = articleSchema.partial();

export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;
