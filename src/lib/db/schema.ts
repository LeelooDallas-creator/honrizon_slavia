import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// ========================================
// TABLE USERS (Administrateurs)
// ========================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ========================================
// TABLE COUNTRIES (Pays d'Europe de l'Est)
// ========================================
export const countries = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ========================================
// TABLE ARTICLES (Contenus éditoriaux)
// ========================================
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  type: varchar("type", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  countryId: uuid("country_id").references(() => countries.id),
  readingTime: integer("reading_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

// Types TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
