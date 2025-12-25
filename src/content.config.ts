import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const ressources = defineCollection({
  loader: glob({ base: "./src/content/ressources", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { ressources };
