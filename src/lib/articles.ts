import { db } from './db';
import { articles, countries } from './db/schema';
import { eq, and } from 'drizzle-orm';
import type { DropdownItem } from '@/components/organisms/Header/Header.types';

/**
 * Get all published articles grouped by type
 */
export async function getPublishedArticles() {
  const publishedArticles = await db
    .select({
      article: articles,
      country: countries,
    })
    .from(articles)
    .leftJoin(countries, eq(articles.countryId, countries.id))
    .where(eq(articles.status, 'published'))
    .orderBy(articles.publishedAt);

  return publishedArticles;
}

/**
 * Get published articles by type
 */
export async function getPublishedArticlesByType(type: 'inspiration' | 'carnet' | 'ressource') {
  const publishedArticles = await db
    .select({
      article: articles,
      country: countries,
    })
    .from(articles)
    .leftJoin(countries, eq(articles.countryId, countries.id))
    .where(and(
      eq(articles.type, type),
      eq(articles.status, 'published')
    ))
    .orderBy(articles.publishedAt);

  return publishedArticles;
}

/**
 * Convert articles to dropdown items for navigation menu
 */
export function articlesToDropdownItems(
  articlesData: Array<{ article: any; country: any | null }>,
  defaultImage: any
): DropdownItem[] {
  return articlesData.map(({ article, country }) => ({
    subtitle: article.title,
    href: `/articles/${article.slug}`,
    image: article.coverImageUrl || defaultImage,
    description: article.excerpt || '',
  }));
}
