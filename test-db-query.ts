import { db } from './src/lib/db';
import { articles } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function testDatabase() {
  console.log('=== TEST DE LA BASE DE DONNÉES ===\n');

  try {
    console.log('1. Récupération de tous les articles...');
    const allArticles = await db.select().from(articles);
    console.log(`   ✅ ${allArticles.length} articles trouvés\n`);

    console.log('2. Articles par type:');
    const articlesByType = allArticles.reduce((acc, article) => {
      acc[article.type] = (acc[article.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    Object.entries(articlesByType).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
    console.log('');

    console.log('3. Articles par statut:');
    const articlesByStatus = allArticles.reduce((acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    Object.entries(articlesByStatus).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });
    console.log('');

    console.log('4. Test de récupération article "guide-survie"...');
    const [guideArticle] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, 'guide-survie'));

    if (guideArticle) {
      console.log(`   ✅ Article trouvé: "${guideArticle.title}"`);
      console.log(`   - Type: ${guideArticle.type}`);
      console.log(`   - Status: ${guideArticle.status}`);
      console.log(`   - Contenu (premiers 100 caractères): ${guideArticle.content.substring(0, 100)}...`);
      console.log(`   - Contient des tableaux Markdown: ${guideArticle.content.includes('|') ? 'Oui' : 'Non'}`);
      console.log(`   - Contient des H3: ${guideArticle.content.includes('###') ? 'Oui' : 'Non'}`);
    } else {
      console.log('   ❌ Article non trouvé');
    }
    console.log('');

    console.log('5. Test des articles de type "ressource"...');
    const ressourceArticles = allArticles.filter(a => a.type === 'ressource');
    console.log(`   ✅ ${ressourceArticles.length} articles de type ressource`);
    ressourceArticles.forEach(article => {
      console.log(`   - ${article.slug}`);
    });
    console.log('');

    console.log('=== TOUS LES TESTS SONT PASSÉS ===\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testDatabase();
