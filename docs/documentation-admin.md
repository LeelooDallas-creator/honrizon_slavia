# Documentation Technique - Horizon Slavia

## Table des matières
1. [Architecture de la Base de Données](#1-architecture-de-la-base-de-données)
2. [Routes API et Endpoints](#2-routes-api-et-endpoints)
3. [Processus d'Authentification](#3-processus-dauthentification)
4. [Flux Utilisateur](#4-flux-utilisateur)
5. [Mesures de Sécurité](#5-mesures-de-sécurité)
6. [Guide des Captures d'Écran](#6-guide-des-captures-décran)
7. [Scénarios de Démonstration](#7-scénarios-de-démonstration)

---

## 1. Architecture de la Base de Données

### 1.1 Technologies Utilisées
- **SGBD** : PostgreSQL
- **ORM** : Drizzle ORM v0.45.1
- **Gestion des Migrations** : Drizzle Kit

### 1.2 Schéma de Base de Données

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS (Administrateurs)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ id            : uuid (PK)                                                    │
│ email         : varchar(255) UNIQUE NOT NULL                                │
│ password      : varchar(255) NOT NULL (bcrypt hashed)                       │
│ firstName     : varchar(100)                                                 │
│ lastName      : varchar(100)                                                 │
│ createdAt     : timestamp DEFAULT now()                                     │
│ updatedAt     : timestamp DEFAULT now()                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ authorId (FK)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  ARTICLES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ id            : uuid (PK)                                                    │
│ title         : varchar(255) NOT NULL                                       │
│ slug          : varchar(255) UNIQUE NOT NULL                                │
│ excerpt       : text (résumé optionnel)                                     │
│ content       : text NOT NULL (format Markdown)                             │
│ coverImageUrl : varchar(500)                                                 │
│ pdfUrl        : varchar(500) (ressource téléchargeable)                     │
│ type          : varchar(20) ['inspiration', 'carnet', 'ressource']          │
│ status        : varchar(20) ['draft', 'published'] DEFAULT 'draft'          │
│ authorId      : uuid (FK → users.id)                                        │
│ countryId     : uuid (FK → countries.id) NULLABLE                           │
│ readingTime   : integer (minutes estimées)                                  │
│ createdAt     : timestamp DEFAULT now()                                     │
│ updatedAt     : timestamp DEFAULT now()                                     │
│ publishedAt   : timestamp NULLABLE                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ countryId (FK)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 COUNTRIES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ id            : uuid (PK)                                                    │
│ name          : varchar(100) NOT NULL                                       │
│ slug          : varchar(100) UNIQUE NOT NULL                                │
│ createdAt     : timestamp DEFAULT now()                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Relations
- **ARTICLES → USERS** : Many-to-One (un article a un seul auteur)
- **ARTICLES → COUNTRIES** : Many-to-One (un article peut être associé à un pays)

### 1.4 Données Pré-remplies (Seeding)
Le fichier [src/lib/db/seed.ts](../src/lib/db/seed.ts) initialise :
- **8 pays** d'Europe de l'Est : Pologne, République tchèque, Slovaquie, Hongrie, Roumanie, Bulgarie, Croatie, Serbie
- **1 utilisateur admin** par défaut :
  - Email : `admin@horizon-slavia.fr`
  - Mot de passe : `Admin123!`
- **5 articles exemples** avec statuts variés (draft/published)

### 1.5 Fichiers Clés
- Schéma : [src/lib/db/schema.ts](../src/lib/db/schema.ts)
- Configuration : [drizzle.config.ts](../drizzle.config.ts)
- Seeding : [src/lib/db/seed.ts](../src/lib/db/seed.ts)
- Migrations : [drizzle/](../drizzle/)

---

## 2. Routes API et Endpoints

Toutes les routes API utilisent le mode SSR (`prerender = false`) et sont situées dans [src/pages/api/](../src/pages/api/)

### 2.1 Authentification

#### POST `/api/auth/login`
**Fichier** : [src/pages/api/auth/login.ts](../src/pages/api/auth/login.ts)

**Description** : Authentifie un utilisateur et crée une session sécurisée.

**Body** :
```json
{
  "email": "admin@horizon-slavia.fr",
  "password": "Admin123!",
  "csrfToken": "..."
}
```

**Réponse Succès (200)** :
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@horizon-slavia.fr",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

**Réponse Erreur (401)** :
```json
{
  "error": "Email ou mot de passe incorrect"
}
```

**Sécurité** :
- Validation Zod des entrées
- Vérification du token CSRF
- Hachage bcrypt (cost factor 12)
- Cookie de session HTTP-only, secure, sameSite=strict
- Comparaison timing-safe

---

#### POST `/api/auth/logout`
**Fichier** : [src/pages/api/auth/logout.ts](../src/pages/api/auth/logout.ts)

**Description** : Déconnecte l'utilisateur et supprime la session.

**Body** :
```json
{
  "csrfToken": "..."
}
```

**Réponse Succès (200)** :
```json
{
  "success": true
}
```

**Sécurité** :
- Vérification du token CSRF
- Suppression du cookie de session

---

### 2.2 Gestion des Articles

#### GET `/api/articles`
**Fichier** : [src/pages/api/articles/index.ts](../src/pages/api/articles/index.ts)

**Description** : Récupère tous les articles avec informations pays/auteur.

**Authentification** : Requise

**Query Parameters** (optionnels) :
- `type` : 'inspiration' | 'carnet' | 'ressource'
- `status` : 'draft' | 'published'

**Réponse Succès (200)** :
```json
[
  {
    "id": "uuid",
    "title": "Découvrir Prague",
    "slug": "decouvrir-prague",
    "excerpt": "Guide complet...",
    "content": "# Prague\n\nContenu markdown...",
    "coverImageUrl": "/images/prague.jpg",
    "pdfUrl": "/uploads/pdfs/guide-prague.pdf",
    "type": "carnet",
    "status": "published",
    "authorId": "uuid",
    "countryId": "uuid",
    "readingTime": 10,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z",
    "publishedAt": "2024-01-20T15:30:00Z",
    "country": {
      "id": "uuid",
      "name": "République tchèque",
      "slug": "republique-tcheque"
    },
    "author": {
      "firstName": "Admin",
      "lastName": "User"
    }
  }
]
```

---

#### POST `/api/articles`
**Fichier** : [src/pages/api/articles/index.ts](../src/pages/api/articles/index.ts)

**Description** : Crée un nouvel article.

**Authentification** : Requise

**Body** :
```json
{
  "title": "Nouveau Guide",
  "slug": "nouveau-guide",
  "excerpt": "Résumé de l'article",
  "content": "Contenu Markdown complet",
  "coverImageUrl": "/images/cover.jpg",
  "pdfUrl": "/uploads/pdfs/guide.pdf",
  "type": "carnet",
  "status": "published",
  "countryId": "uuid",
  "readingTime": 15,
  "csrfToken": "..."
}
```

**Réponse Succès (201)** :
```json
{
  "id": "uuid",
  "title": "Nouveau Guide",
  ...
}
```

**Sécurité** :
- Validation Zod complète
- Vérification CSRF
- `authorId` automatiquement défini depuis la session
- Gestion automatique de `publishedAt` si status='published'

---

#### GET `/api/articles/[id]`
**Fichier** : [src/pages/api/articles/[id].ts](../src/pages/api/articles/[id].ts)

**Description** : Récupère un article par son ID.

**Authentification** : Requise

**Réponse Succès (200)** : Objet article complet

**Réponse Erreur (404)** :
```json
{
  "error": "Article non trouvé"
}
```

---

#### PUT `/api/articles/[id]`
**Fichier** : [src/pages/api/articles/[id].ts](../src/pages/api/articles/[id].ts)

**Description** : Met à jour un article existant.

**Authentification** : Requise

**Body** : Mêmes champs que POST (CSRF requis)

**Réponse Succès (200)** : Article mis à jour

**Sécurité** :
- Validation UUID
- Validation Zod
- Vérification CSRF
- Mise à jour automatique de `updatedAt`
- Gestion de `publishedAt` selon le statut

---

#### DELETE `/api/articles/[id]`
**Fichier** : [src/pages/api/articles/[id].ts](../src/pages/api/articles/[id].ts)

**Description** : Supprime définitivement un article.

**Authentification** : Requise

**Réponse Succès (204)** : No Content

**Sécurité** :
- Validation UUID
- Vérification CSRF
- Suppression permanente (pas de soft delete)

---

### 2.3 Upload de Fichiers

#### POST `/api/upload`
**Fichier** : [src/pages/api/upload.ts](../src/pages/api/upload.ts)

**Description** : Upload de fichiers PDF sécurisé.

**Authentification** : Requise

**Body** : FormData avec fichier PDF (max 10MB)

**Réponse Succès (200)** :
```json
{
  "url": "/uploads/pdfs/1705320000000-guide-sanitized.pdf"
}
```

**Sécurité** :
- Validation du type MIME (`application/pdf`)
- Validation de l'extension (`.pdf` uniquement)
- Limite de taille : 10MB
- Sanitization du nom de fichier :
  - Suppression des accents
  - Suppression des caractères spéciaux
  - Limitation à 50 caractères
  - Préfixe timestamp (prévention collisions)
- Prévention du path traversal
- Vérification CSRF

---

## 3. Processus d'Authentification

### 3.1 Architecture de Sécurité

**Fichier principal** : [src/lib/auth.ts](../src/lib/auth.ts)

**Type de système** : Sessions HMAC signées (approche similaire à JWT)

### 3.2 Flux de Connexion

```
┌─────────────┐                                    ┌─────────────┐
│             │  1. POST /api/auth/login           │             │
│   Client    │───────────────────────────────────▶│   Serveur   │
│             │    {email, password, csrfToken}    │             │
└─────────────┘                                    └─────────────┘
                                                           │
                                                           │ 2. Validation CSRF
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │  Validation │
                                                    │     Zod     │
                                                    └─────────────┘
                                                           │
                                                           │ 3. Format email/password OK
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │  Recherche  │
                                                    │     User    │
                                                    │   en BDD    │
                                                    └─────────────┘
                                                           │
                                                           │ 4. User trouvé
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │   bcrypt    │
                                                    │   compare   │
                                                    │  (cost 12)  │
                                                    └─────────────┘
                                                           │
                                                           │ 5. Password valide
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │  Création   │
                                                    │   Session   │
                                                    │             │
                                                    │ {userId,exp}│
                                                    └─────────────┘
                                                           │
                                                           │ 6. Base64 + HMAC-SHA256
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │   Token:    │
                                                    │ payload.sig │
                                                    └─────────────┘
                                                           │
                                                           │ 7. Set Cookie HTTP-only
                                                           │
┌─────────────┐                                           │
│             │◀──────────────────────────────────────────┘
│   Client    │  Set-Cookie: session=token; HttpOnly;
│             │  Secure; SameSite=strict; MaxAge=1800
└─────────────┘
```

### 3.3 Structure du Token de Session

**Format** : `{base64_payload}.{hmac_signature}`

**Payload** (JSON encodé en Base64) :
```json
{
  "userId": "uuid",
  "exp": 1705323600000
}
```

**Signature** : HMAC-SHA256 du payload avec `SESSION_SECRET`

**Durée de vie** : 30 minutes (1800 secondes)

### 3.4 Configuration du Cookie

```typescript
{
  httpOnly: true,      // Inaccessible en JavaScript (XSS)
  secure: true,        // HTTPS uniquement en production
  sameSite: 'strict',  // Protection CSRF
  maxAge: 1800,        // 30 minutes
  path: '/'
}
```

### 3.5 Vérification de Session

**Middleware** : `requireAuth(cookies)` - utilisé dans toutes les routes protégées

**Processus** :
1. Extraction du cookie `session`
2. Parsing du token (`payload.signature`)
3. Recalcul de la signature HMAC
4. **Comparaison timing-safe** (prévention timing attacks)
5. Vérification de l'expiration
6. Retour `{ userId }` ou erreur 401

### 3.6 Protection CSRF

**Génération** :
- Token aléatoire de 32 octets (cryptographiquement sécurisé)
- Stocké dans cookie HTTP-only (durée : 1 heure)
- Généré au chargement de la page de login et des pages admin

**Vérification** :
- Extraction du cookie `csrfToken`
- Extraction du token depuis :
  - Corps de la requête (`body.csrfToken`) pour login
  - Header custom (`X-CSRF-Token`) pour API
- **Comparaison timing-safe**

**Endpoints protégés** :
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/articles`
- PUT `/api/articles/[id]`
- DELETE `/api/articles/[id]`
- POST `/api/upload`

### 3.7 Sécurité des Mots de Passe

**Hachage** : bcryptjs avec cost factor 12

**Fonctions** :
- `hashPassword(plain)` : Crée le hash pour stockage
- `verifyPassword(plain, hash)` : Vérification en temps constant

**Politique** :
- Minimum 8 caractères
- Validation côté serveur (Zod schema)

### 3.8 Flux de Déconnexion

```
┌─────────────┐                                    ┌─────────────┐
│             │  1. POST /api/auth/logout          │             │
│   Client    │───────────────────────────────────▶│   Serveur   │
│             │    {csrfToken}                      │             │
└─────────────┘                                    └─────────────┘
                                                           │
                                                           │ 2. Validation CSRF
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │  Suppression│
                                                    │   Cookie    │
                                                    │   session   │
                                                    └─────────────┘
                                                           │
┌─────────────┐                                           │
│             │◀──────────────────────────────────────────┘
│   Client    │  Set-Cookie: session=deleted; MaxAge=0
└─────────────┘
```

### 3.9 Gestion des Redirections

**Page Login** ([/admin/login](../src/pages/admin/login.astro)) :
- Si session valide → redirection vers `/admin`
- Sinon → affichage du formulaire

**Pages Admin** :
- Si session invalide → redirection vers `/admin/login`
- Sinon → accès autorisé

### 3.10 Fonctions d'Authentification

| Fonction | Usage | Comportement si échec |
|----------|-------|----------------------|
| `requireAuth(cookies)` | Routes API protégées | Throw Response 401 |
| `getSession(cookies)` | Pages admin (redirections) | Return null |
| `createSession(userId)` | Login réussi | N/A |
| `verifyCsrfToken(cookies, token)` | Toutes mutations | Return false |
| `generateCsrfToken()` | Pages login/admin | N/A |

---

## 4. Flux Utilisateur

### 4.1 Diagramme de Flux Administrateur

```
                              ┌─────────────────────┐
                              │   Accès /admin      │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │  Session valide ?   │
                              └──────────┬──────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │ NON                                   OUI │
                   ▼                                           ▼
        ┌─────────────────────┐                   ┌─────────────────────┐
        │ Redirection vers    │                   │   Dashboard Admin   │
        │   /admin/login      │                   │                     │
        └──────────┬──────────┘                   │ - Liste articles    │
                   │                               │ - Filtres type/pays │
                   ▼                               │ - Actions CRUD      │
        ┌─────────────────────┐                   └──────────┬──────────┘
        │ Page de Connexion   │                              │
        │                     │                              │
        │ - Email             │              ┌───────────────┴───────────────┐
        │ - Mot de passe      │              │                               │
        │ - Token CSRF        │              ▼                               ▼
        └──────────┬──────────┘   ┌─────────────────────┐       ┌─────────────────────┐
                   │              │  Créer un Article   │       │  Éditer un Article  │
                   │              │   /admin/articles/  │       │  /admin/articles/   │
                   │              │        new          │       │    [id]/edit        │
                   ▼              └──────────┬──────────┘       └──────────┬──────────┘
        ┌���────────────────────┐             │                               │
        │ Validation Backend  │             │                               │
        │                     │             ▼                               ▼
        │ - Zod schema        │  ┌─────────────────────────────────────────────┐
        │ - bcrypt compare    │  │         Formulaire d'Article                │
        │ - CSRF check        │  │                                             │
        └──────────┬──────────┘  │ - Titre / Slug                              │
                   │              │ - Type (carnet/inspiration/ressource)      │
                   │              │ - Extrait (500 car max)                    │
                   │              │ - Contenu Markdown (textarea 15 rows)      │
                   │              │ - Upload PDF (async, progress indicator)   │
        ┌──────────┴──────────┐  │ - Pays (select, optionnel)                 │
        │ Échec               │  │ - Temps de lecture (1-60 min)              │
        ▼                     │  │ - Statut (draft/published)                 │
┌─────────────────────┐       │  └──────────┬──────────────────────┬──────────┘
│ Message d'erreur    │       │             │                      │
│ + retour formulaire │       │             │ Soumettre            │ Annuler
└─────────────────────┘       │             ▼                      ▼
                              │  ┌─────────────────────┐  ┌─────────────────────┐
        ┌─────────────────────┘  │ POST/PUT /api/      │  │ Retour Dashboard    │
        │ Succès                 │     articles        │  └─────────────────────┘
        ▼                         │                     │
┌─────────────────────┐          │ - Validation Zod    │
│ Cookie session créé │          │ - CSRF check        │
│ Redirection /admin  │          │ - Upload PDF si     │
└─────────────────────┘          │   nécessaire        │
                                 └──────────┬──────────┘
                                            │
                              ┌─────────────┴─────────────┐
                              │ Succès                    │
                              ▼                           │ Échec
                   ┌─────────────────────┐                ▼
                   │ Redirection vers    │     ┌─────────────────────┐
                   │    Dashboard        │     │ Affichage erreurs   │
                   │                     │     │ par champ (Zod)     │
                   │ Message succès      │     └─────────────────────┘
                   └─────────────────────┘


                   ┌─────────────────────────────────────────────────┐
                   │          Actions depuis Dashboard               │
                   └─────────────────────────────────────────────────┘
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                              ▼                     ▼
                   ┌─────────────────────┐  ┌─────────────────────┐
                   │  Bouton "Éditer"    │  │ Bouton "Supprimer"  │
                   └──────────┬──────────┘  └──────────┬──────────┘
                              │                        │
                              │                        ▼
                              │             ┌─────────────────────┐
                              │             │  Modal de           │
                              │             │  Confirmation       │
                              │             │                     │
                              │             │ - Affichage titre   │
                              │             │ - Checkbox confirm  │
                              │             │ - Bouton désactivé  │
                              │             │   tant que non      │
                              │             │   coché             │
                              │             └──────────┬──────────┘
                              │                        │
                              │                        │ Confirmer
                              │                        ▼
                              │             ┌─────────────────────┐
                              │             │ DELETE /api/        │
                              │             │  articles/[id]      │
                              │             │                     │
                              │             │ - CSRF check        │
                              │             │ - UUID validation   │
                              │             └──────────┬──────────┘
                              │                        │
                              │                        │ Succès
                              │                        ▼
                              │             ┌─────────────────────┐
                              │             │ Rechargement page   │
                              │             │ Message succès      │
                              │             └─────────────────────┘
                              │
                              ▼
                   (Retour au formulaire d'édition)


                   ┌─────────────────────────────────────────────────┐
                   │              Déconnexion                        │
                   └─────────────────────────────────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ Bouton Logout       │
                              │  (Header Admin)     │
                              └─────��────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ POST /api/auth/     │
                              │      logout         │
                              │                     │
                              │ - CSRF check        │
                              │ - Suppression       │
                              │   cookie session    │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ Redirection vers    │
                              │   /admin/login      │
                              └─────────────────────┘
```

### 4.2 Points de Décision Clés

| Étape | Vérification | Action si Échec | Action si Succès |
|-------|--------------|-----------------|------------------|
| Accès `/admin` | Session valide ? | Redirect `/admin/login` | Affichage Dashboard |
| Login | Credentials + CSRF | Erreur affichée | Session créée, redirect `/admin` |
| Création article | Validation Zod + CSRF | Erreurs par champ | Article créé, redirect Dashboard |
| Édition article | Article existe + CSRF | 404 | Formulaire pré-rempli |
| Suppression | Confirmation + CSRF | Modal reste ouverte | Suppression + refresh |
| Upload PDF | Type/taille valides | Erreur affichée | URL retournée |

### 4.3 États de Chargement

**Formulaire d'article** :
- Upload PDF : Indicateur de progression + spinner
- Soumission : Bouton désactivé + texte "Envoi..."

**Modal de suppression** :
- Confirmation requise : Bouton désactivé jusqu'à checkbox
- Suppression en cours : Spinner + "Suppression..."

**Dashboard** :
- Liste articles : Skeleton loaders (si implémenté)
- Messages flash : Succès (vert) / Erreur (rouge)

---

## 5. Mesures de Sécurité

### 5.1 Vue d'Ensemble

Le projet implémente une **approche de sécurité en profondeur** avec 10 couches de protection.

### 5.2 Sécurité de l'Authentification

| Mesure | Implémentation | Fichier |
|--------|----------------|---------|
| **Hachage bcrypt** | Cost factor 12 | [src/lib/auth.ts](../src/lib/auth.ts) |
| **Sessions signées** | HMAC-SHA256 | [src/lib/auth.ts](../src/lib/auth.ts) |
| **Expiration courte** | 30 minutes | [src/lib/auth.ts](../src/lib/auth.ts) |
| **Cookies HTTP-only** | Inaccessible JS | Tous les endpoints auth |
| **Secure flag** | HTTPS uniquement (prod) | Configuration cookies |
| **SameSite strict** | Anti-CSRF | Configuration cookies |
| **Comparaison timing-safe** | Prévention timing attacks | [src/lib/auth.ts](../src/lib/auth.ts) |

**Protection contre** :
- Rainbow tables (bcrypt salt automatique)
- Brute force (cost factor élevé)
- XSS (HTTP-only cookies)
- CSRF (SameSite + token dédié)
- Timing attacks (comparaisons constantes)

---

### 5.3 Protection CSRF

**Type** : Double Submit Cookie Pattern

| Aspect | Détail |
|--------|--------|
| **Génération** | Crypto.randomBytes(32) |
| **Stockage** | Cookie HTTP-only (1h) |
| **Transmission** | Body (login) + Header (API) |
| **Vérification** | Timing-safe comparison |
| **Régénération** | À chaque chargement page admin |

**Endpoints protégés** :
- Tous les POST/PUT/DELETE
- Login/Logout
- Upload de fichiers

**Code de vérification** :
```typescript
// src/lib/auth.ts
export function verifyCsrfToken(cookies: AstroCookies, token: string): boolean {
  const storedToken = cookies.get('csrfToken')?.value
  if (!storedToken || !token) return false
  return timingSafeEqual(Buffer.from(storedToken), Buffer.from(token))
}
```

---

### 5.4 Validation des Entrées

**Outil** : Zod v3.24.1

**Schémas définis** :

#### Login Schema
```typescript
{
  email: z.string().email(),
  password: z.string().min(8)
}
```

#### Article Schema
```typescript
{
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  pdfUrl: z.string().optional(),
  type: z.enum(['inspiration', 'carnet', 'ressource']),
  status: z.enum(['draft', 'published']),
  countryId: z.string().uuid().optional(),
  readingTime: z.number().int().min(1).max(60)
}
```

**Validations UUID** :
- Tous les paramètres d'URL `[id]` : validation via Zod avant requête BDD

**Protection contre** :
- Injection SQL (via ORM paramétré)
- XSS (validation format)
- Overflow (limites de longueur)
- Type juggling (typage strict)

---

### 5.5 Sécurité des Uploads

**Endpoint** : [POST /api/upload](../src/pages/api/upload.ts)

| Contrôle | Implémentation |
|----------|----------------|
| **Type MIME** | Whitelist : `application/pdf` uniquement |
| **Extension** | Validation `.pdf` |
| **Taille** | 10 MB max |
| **Nom de fichier** | Sanitization complète |
| **Path traversal** | Vérification destination |
| **Authentification** | Session requise |
| **CSRF** | Token requis |

**Sanitization du nom** :
```typescript
// Exemple : "Rapport d'activité 2024 (final).pdf"
// Devient : "1705320000000-rapport-dactivite-2024-final.pdf"

- Suppression accents (é → e)
- Suppression caractères spéciaux
- Remplacement espaces par tirets
- Limite 50 caractères
- Préfixe timestamp (évite collisions)
```

**Stockage** : `/public/uploads/pdfs/`

**URL publique** : `/uploads/pdfs/{timestamp}-{nom-sanitized}.pdf`

---

### 5.6 Sécurité de la Base de Données

| Mesure | Implémentation |
|--------|----------------|
| **ORM** | Drizzle (requêtes paramétrées) |
| **Pas de SQL brut** | 100% du code via ORM |
| **Contraintes UNIQUE** | email, slug |
| **Contraintes FK** | Intégrité référentielle |
| **Connection string** | Variable d'environnement |
| **Validation avant insertion** | Schémas Zod |

**Protection contre** :
- Injection SQL (paramétrage automatique)
- Duplication (contraintes UNIQUE)
- Orphelins (foreign keys)
- Exposition credentials (`.env` gitignored)

---

### 5.7 Autorisation et Contrôle d'Accès

| Route/Action | Contrôle |
|--------------|----------|
| **Toutes pages `/admin/*`** | Session valide |
| **Toutes API `/api/*`** | Session valide (sauf login) |
| **Création article** | `authorId` = `session.userId` |
| **Édition/Suppression** | Session valide (pas de vérif ownership) |

**Note** : Le système actuel ne vérifie pas si l'auteur modifie son propre article (admin unique).

**Implémentation** :
```typescript
// Middleware requireAuth
const { userId } = requireAuth(request.cookies) // Throw 401 si échec

// Auto-attribution auteur
const article = await db.insert(articles).values({
  ...data,
  authorId: userId // Depuis session, pas depuis body
})
```

**Protection contre** :
- Accès non authentifié (middleware)
- Usurpation d'identité auteur (authorId forcé)
- Élévation de privilèges (validation session)

---

### 5.8 Sécurité Frontend

| Aspect | Mesure | Implémentation |
|--------|--------|----------------|
| **XSS** | Pas de `dangerouslySetInnerHTML` | Tous les templates Astro |
| **CSP-friendly** | Scripts via `define:vars` | [src/pages/admin/*.astro](../src/pages/admin/) |
| **Secrets** | Token CSRF en input hidden | Formulaires |
| **Validation UX** | Client-side (non sécuritaire) | Serveur révalide toujours |
| **Confirmations** | Modals pour actions destructives | [DeleteModal.astro](../src/components/admin/DeleteModal.astro) |

**Pas de données sensibles** :
- Password jamais envoyé côté client
- Session token uniquement en cookie HTTP-only
- CSRF token non exposé en variable globale JS

---

### 5.9 Gestion des Erreurs

**Principe** : Ne jamais divulguer d'informations système

| Scénario | Message Utilisateur | Log Serveur |
|----------|---------------------|-------------|
| **Credentials invalides** | "Email ou mot de passe incorrect" | Email + tentative |
| **Article non trouvé** | "Article non trouvé" | ID + requête |
| **Erreur BDD** | "Erreur serveur" | Stack trace complète |
| **Token CSRF invalide** | "Token de sécurité invalide" | IP + timestamp |
| **Validation échouée** | Détails par champ (Zod) | Données soumises |

**Try-catch** dans toutes les routes API :
```typescript
try {
  // Logique métier
} catch (error) {
  console.error('[API Error]', error) // Log serveur
  return new Response(
    JSON.stringify({ error: 'Erreur serveur' }), // Message générique
    { status: 500 }
  )
}
```

---

### 5.10 Configuration Environnement

**Fichier** : `.env` (gitignored)

**Variables requises** :
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/horizon_slavia
SESSION_SECRET=random-32-char-string-minimum
PUBLIC_SITE_URL=https://horizon-slavia.fr
```

**Validation au démarrage** :
- `SESSION_SECRET` doit être défini (sinon erreur)
- `DATABASE_URL` testée lors de la première connexion

**Bonnes pratiques** :
- Secrets jamais commités (`.gitignore`)
- Rotation régulière du `SESSION_SECRET`
- Différents secrets dev/prod

---

### 5.11 Mesures Additionnelles

| Mesure | Implémentation |
|--------|----------------|
| **Meta robots** | `<meta name="robots" content="noindex, nofollow">` sur pages admin |
| **Stack traces** | Désactivées en production |
| **Rate limiting** | Via reverse proxy (Nginx/Cloudflare) |
| **HTTPS** | Cookie Secure flag en prod |
| **Hooks qualité** | Husky + lint-staged (pre-commit) |

---

### 5.12 Tests de Sécurité

**Framework** : Playwright (E2E)

**Scénarios testés** :
- Accès admin sans session → redirection login
- Login credentials invalides → erreur
- Login credentials valides → session créée
- CSRF token manquant → rejet
- Upload fichier non-PDF → rejet

**Fichiers** :
- [e2e-tests/admin-auth.spec.ts](../e2e-tests/admin-auth.spec.ts) (si existe)

---

### 5.13 Résumé des 10 Couches de Sécurité

1. **Authentification forte** : bcrypt + sessions HMAC
2. **Protection CSRF** : Double Submit Cookie
3. **Validation entrées** : Zod schemas + UUID checks
4. **Upload sécurisé** : Whitelist + sanitization + taille
5. **BDD sécurisée** : ORM paramétré + contraintes
6. **Autorisation stricte** : Middleware sur toutes routes
7. **Frontend sécurisé** : Pas de XSS + CSP-friendly
8. **Gestion erreurs** : Messages génériques publics
9. **Configuration** : Variables environnement + secrets
10. **Mesures complémentaires** : Meta tags + HTTPS + tests

---

**Contact support** :
- Documentation complète : [docs/DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md)
- Code source : [GitHub - honrizon_slavia](../)

---

**Date de création** : 24 décembre 2025
**Version** : 1.0
**Auteur** : Leeloo Dallas
