import * as dotenv from 'dotenv';
dotenv.config();

import { db } from './index';
import { users, countries, articles } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Début du seed...');

  try {
    // ========================================
    // 1. CRÉER UN UTILISATEUR ADMIN
    // ========================================
    console.log('👤 Création de l\'utilisateur admin...');
    
    const [admin] = await db.insert(users).values({
      email: 'admin@horizon-slavia.fr',
      password: await bcrypt.hash('Admin123!', 12),
      firstName: 'Lise',
      lastName: 'Barbey',
    }).returning();

    console.log(`✅ Admin créé : ${admin.email}`);

    // ========================================
    // 2. CRÉER LES PAYS D'EUROPE DE L'EST
    // ========================================
    console.log('🌍 Création des pays...');

    const countriesData = [
      { name: 'Pologne', slug: 'pologne' },
      { name: 'République tchèque', slug: 'republique-tcheque' },
      { name: 'Slovaquie', slug: 'slovaquie' },
      { name: 'Hongrie', slug: 'hongrie' },
      { name: 'Roumanie', slug: 'roumanie' },
      { name: 'Bulgarie', slug: 'bulgarie' },
      { name: 'Croatie', slug: 'croatie' },
      { name: 'Serbie', slug: 'serbie' },
    ];

    const createdCountries = await db.insert(countries).values(countriesData).returning();
    console.log(`✅ ${createdCountries.length} pays créés`);

    const pologne = createdCountries.find(c => c.slug === 'pologne')!;
    const tcheque = createdCountries.find(c => c.slug === 'republique-tcheque')!;
    const hongrie = createdCountries.find(c => c.slug === 'hongrie')!;
    const roumanie = createdCountries.find(c => c.slug === 'roumanie')!;

    // ========================================
    // 3. CRÉER DES ARTICLES DE TEST
    // ========================================
    console.log('📝 Création des articles de test...');

    const articlesData = [
      {
        title: 'Les traditions de Noël en Pologne',
        slug: 'traditions-noel-pologne',
        excerpt: 'Découvrez la magie du Wigilia, le réveillon de Noël polonais et ses 12 plats traditionnels.',
        content: `# Les traditions de Noël en Pologne

Le Wigilia (réveillon de Noël) est l'une des célébrations les plus importantes en Pologne.

## Les 12 plats du Wigilia

Parmi les plats incontournables :
- Le barszcz (soupe de betterave)
- Les pierogi (raviolis polonais)
- La carpe frite
- Le kutia (dessert aux grains de blé)`,
        type: 'carnet',
        status: 'published',
        authorId: admin.id,
        countryId: pologne.id,
        readingTime: 5,
        publishedAt: new Date(),
      },
      {
        title: 'Prague en 3 jours : itinéraire optimisé',
        slug: 'prague-3-jours-itineraire',
        excerpt: 'Un guide complet pour découvrir les incontournables de Prague en un long week-end.',
        content: `# Prague en 3 jours

Prague, la ville aux cent clochers.

## Jour 1 : Le centre historique
- Place de la Vieille-Ville
- Horloge astronomique
- Pont Charles`,
        type: 'inspiration',
        status: 'published',
        authorId: admin.id,
        countryId: tcheque.id,
        readingTime: 8,
        publishedAt: new Date(),
      },
      {
        title: 'Les châteaux médiévaux de Hongrie',
        slug: 'chateaux-medievaux-hongrie',
        excerpt: 'Partez à la découverte des forteresses qui ont façonné l\'histoire hongroise.',
        content: `# Les châteaux médiévaux de Hongrie

La Hongrie regorge de châteaux impressionnants.

## Le château de Buda
Surplombant le Danube à Budapest.`,
        type: 'carnet',
        status: 'published',
        authorId: admin.id,
        countryId: hongrie.id,
        readingTime: 6,
        publishedAt: new Date(),
      },
      {
        title: 'Checklist voyage en Europe de l\'Est',
        slug: 'checklist-voyage-europe-est',
        excerpt: 'La liste complète pour ne rien oublier avant votre départ.',
        content: `# Checklist voyage

## Documents essentiels
- [ ] Passeport ou carte d'identité
- [ ] Carte européenne d'assurance maladie`,
        type: 'ressource',
        status: 'draft',
        authorId: admin.id,
        readingTime: 3,
      },
      {
        title: 'La cuisine roumaine authentique',
        slug: 'cuisine-roumaine-authentique',
        excerpt: 'Découvrez les saveurs traditionnelles de la gastronomie roumaine.',
        content: `# La cuisine roumaine

Un mélange d'influences turques, hongroises et slaves.

## Plats traditionnels
- Sarmale : choux farcis
- Mămăligă : polenta roumaine`,
        type: 'inspiration',
        status: 'draft',
        authorId: admin.id,
        countryId: roumanie.id,
        readingTime: 4,
      },
    ];

    const createdArticles = await db.insert(articles).values(articlesData).returning();
    console.log(`✅ ${createdArticles.length} articles créés`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n�� Résumé :');
    console.log(`- ${createdCountries.length} pays créés`);
    console.log(`- ${createdArticles.length} articles créés`);
    console.log(`- 1 utilisateur admin`);
    console.log('\n🔐 Identifiants admin :');
    console.log(`Email : admin@horizon-slavia.fr`);
    console.log(`Mot de passe : Admin123!`);
    console.log('\n👉 Tu peux maintenant te connecter sur /admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
    process.exit(1);
  }
}

// Appeler la fonction seed
seed();
