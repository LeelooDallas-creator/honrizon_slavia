# Horizon Slavia - Documentation Technique

Documentation complète du projet Horizon Slavia, site web dédié à la découverte de l'Europe de l'Est.

## 📋 Sommaire

- [Stack Technique](#stack-technique)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Base de Données](#base-de-données)
- [API](#api)
- [Tests](#tests)
- [Accessibilité](#accessibilité)
- [Performance](#performance)
- [Commandes](#commandes)

## 🚀 Stack Technique

- **Framework**: Astro 5.16.6 + TypeScript (strict)
- **Styling**: SCSS (architecture 7-in-1)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: HMAC-SHA256 + bcrypt
- **Tests**: Vitest + Playwright
- **Code Quality**: ESLint, Prettier, Husky, Commitlint

## 📦 Installation

```bash
npm install
npx playwright install
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=<clé-aléatoire-longue>
```

**Note**: Ne jamais commiter le fichier `.env`.

### Base de données

```bash
npm run db:generate  # Générer migrations
npm run db:push      # Appliquer migrations
npm run db:studio    # Interface graphique
```

## 🏗️ Architecture

```
src/
├── components/        # Atomic Design (atoms/molecules/organisms)
├── pages/            # Routes (index, admin, articles, api)
├── layouts/          # Layouts réutilisables
├── lib/              # Logique métier (db, auth, validations)
├── styles/           # SCSS modulaire
├── scripts/          # JavaScript utilitaires
├── assets/           # Images optimisées
└── types/            # Types TypeScript

tests/                # Tests unitaires Vitest
e2e-tests/            # Tests E2E Playwright
drizzle/              # Migrations SQL
public/uploads/       # Fichiers uploadés
```

### Design System

**Couleurs** (WCAG AAA/AA) :

- Primaire: `#1B263B` (contraste 13.6:1)
- Secondaire: `#8B0000` (contraste 8.2:1)
- Accent: `#C4A000` (contraste 4.7:1)

**Typographie** :

- Headings: Uncial Antiqua
- Body: Merriweather
- Échelle: 1.250

**Breakpoints** :

- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

## 🗄️ Base de Données

### Schéma

**users**: id, email, password (bcrypt), firstName, lastName, timestamps

**countries**: id, name, slug, createdAt

**articles**: id, title, slug, excerpt, content, coverImageUrl, pdfUrl, type (inspiration|carnet|ressource), status (draft|published), authorId (FK), countryId (FK nullable), readingTime, timestamps, publishedAt

### Requêtes communes

```typescript
import { db } from "@/lib/db";
import { articles, countries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Articles publiés
const published = await db
  .select()
  .from(articles)
  .where(eq(articles.status, "published"))
  .orderBy(desc(articles.publishedAt));

// Article avec pays
const article = await db
  .select()
  .from(articles)
  .leftJoin(countries, eq(articles.countryId, countries.id))
  .where(eq(articles.slug, "slug"));
```

## 🔌 API

Toutes les routes utilisent `export const prerender = false`.

### Auth

- `POST /api/auth/login` - Connexion (cookie session 30min)
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/change-password` - Changement mot de passe (auth requis)

### Articles

- `GET /api/articles` - Liste (auth requis)
- `POST /api/articles` - Création (auth + CSRF)
- `GET /api/articles/[id]` - Détail (auth requis)
- `PUT /api/articles/[id]` - Modification (auth + CSRF)
- `DELETE /api/articles/[id]` - Suppression (auth + CSRF)

### Médias

- `POST /api/upload` - Upload PDF max 10MB (auth + CSRF)

### Contact

- `POST /api/contact` - Formulaire contact (validation RGPD)

## 🧪 Tests

### Unitaires (Vitest)

```bash
npm run unit-tests
vitest              # Mode watch
vitest --coverage   # Coverage
```

Fichiers :

- `tests/validations.spec.ts` - Schemas Zod
- `tests/auth.spec.ts` - Fonctions auth
- `tests/utils.spec.ts` - Utilitaires

### E2E (Playwright)

```bash
npm run e2e-tests           # Tous les tests
npm run test:a11y           # Accessibilité uniquement
npx playwright test --ui    # Mode UI
npx playwright show-report  # Rapport HTML
```

Fichiers :

- `e2e-tests/homepage.spec.ts` - Page d'accueil
- `e2e-tests/contact-form.spec.ts` - Formulaire
- `e2e-tests/accessibility.spec.ts` - WCAG 2.1

### CI Local

```bash
npm run local-ci  # Format, lint, tests, build
```

## ♿ Accessibilité

Conforme **WCAG 2.1 niveau AA**.

### Implémenté

✅ Navigation clavier (Tab, focus visible)
✅ ARIA (labels, required, live, expanded)
✅ Contraste couleurs (min 4.5:1)
✅ Images (alt obligatoire, lazy loading)
✅ Formulaires (labels associés, erreurs accessibles)
✅ Structure sémantique (headings hiérarchiques, landmarks)
✅ Reduced motion (`prefers-reduced-motion`)

### Tests

Automatisés : `npm run test:a11y`

Manuels : NVDA, JAWS, VoiceOver, TalkBack

## 🚀 Performance

### Optimisations

- HTML compressé
- CSS minifié + inliné auto
- JS minifié (Terser)
- Images WebP optimisées
- Lazy loading
- Code splitting (vendor chunks)

### Lighthouse

Objectif : **Score > 90** sur toutes les catégories

```bash
npm run build
npm run preview
# Chrome DevTools > Lighthouse
```

### SEO

- Meta description, canonical URL
- Open Graph, Twitter Card
- Sitemap: `/sitemap-index.xml`
- RSS: `/rss.xml`
- JSON-LD structured data

## 🔐 Sécurité

### Auth

- Passwords: bcrypt (cost 12)
- Sessions: HMAC-SHA256, httpOnly cookies, 30min expiration
- CSRF protection (tokens timing-safe)

### Validation

- Zod sur toutes les entrées
- Sanitization fichiers
- Protection path traversal
- Limites taille fichiers

## 📜 Commandes

| Commande              | Description            |
| --------------------- | ---------------------- |
| `npm run dev`         | Dev server (port 4321) |
| `npm run build`       | Build production       |
| `npm run preview`     | Preview build          |
| `npm run lint`        | ESLint                 |
| `npm run unit-tests`  | Tests Vitest           |
| `npm run e2e-tests`   | Tests Playwright       |
| `npm run test:a11y`   | Tests accessibilité    |
| `npm run local-ci`    | Tous les checks        |
| `npm run commit`      | Commit Commitizen      |
| `npm run db:generate` | Générer migrations     |
| `npm run db:push`     | Appliquer migrations   |
| `npm run db:studio`   | Drizzle Studio UI      |

## 📝 Conventions

### Commits (Conventional Commits)

```bash
npm run commit
```

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Code

- Prettier (auto-format pre-commit)
- ESLint (linting TS/JS)
- TypeScript strict mode

---

**Version**: 0.0.1
**Dernière mise à jour**: Décembre 2024
