# Scripts JavaScript/TypeScript

Ce dossier contient tous les scripts client-side utilisés dans les différents layouts.

## Structure

### `ressourceLayout.ts`
Point d'entrée principal pour les pages de ressources. Importe et initialise tous les modules nécessaires.

**Utilisé par:** `RessourceLayout.astro`

### `accordions.ts`
Transforme les titres H2 en accordéons interactifs avec comportement mutuellement exclusif.

**Fonctionnalités:**
- Convertit automatiquement les H2 en `<details>` / `<summary>`
- Un seul accordéon ouvert à la fois
- Animation fluide à l'ouverture/fermeture

### `checkboxes.ts`
Rend les checkboxes Markdown interactives avec sauvegarde de l'état.

**Fonctionnalités:**
- Active les checkboxes (désactivées par défaut par Markdown)
- Sauvegarde l'état dans localStorage par page
- Style visuel avec barré quand coché

### `externalLinks.ts`
Ajoute `target="_blank"` aux liens externes pour des raisons de sécurité et UX.

**Fonctionnalités:**
- Détecte les liens commençant par "http"
- Ajoute `target="_blank"` et `rel="noopener noreferrer"`

## Utilisation

Pour utiliser ces scripts dans un layout Astro :

```astro
<script>
  import '../scripts/ressourceLayout';
</script>
```

## Développement

Ces fichiers sont en TypeScript pour bénéficier du typage et éviter les erreurs. Astro les compile automatiquement lors du build.
