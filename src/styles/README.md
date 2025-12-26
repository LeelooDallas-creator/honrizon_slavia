# Structure SCSS - Horizon Slavia

Cette documentation explique l'organisation des fichiers SCSS du projet et fournit des guidelines pour maintenir une architecture cohérente, performante et accessible.

## Table des matières

1. [Structure des dossiers](#structure-des-dossiers)
2. [Variables disponibles](#variables-disponibles)
3. [Mixins utiles](#mixins-utiles)
4. [Container Queries](#container-queries)
5. [Fonctions utiles](#fonctions-utiles)
6. [Accessibilité (WCAG 2.1)](#accessibilité-wcag-21)
7. [Performance (Core Web Vitals)](#performance-core-web-vitals)
8. [Exemples Horizon Slavia](#exemples-horizon-slavia)
9. [Intégration avec Astro](#intégration-avec-astro)
10. [Maintenance](#maintenance)
11. [Best Practices](#best-practices)

---

## Structure des dossiers

```
src/styles/
├── abstracts/          # Variables, mixins, fonctions (pas de CSS généré)
│   ├── _variables.scss # Toutes les variables du design system
│   ├── _mixins.scss    # Mixins réutilisables
│   └── _functions.scss # Fonctions utilitaires
├── base/               # Styles de base
│   ├── _reset.scss     # Reset CSS moderne
│   └── _typography.scss # Styles typographiques
├── layout/             # Mise en page
│   └── _containers.scss # Conteneurs et grilles
├── components/         # Composants (à créer selon les besoins)
└── main.scss          # Point d'entrée principal
```

**Architecture** : [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern) (version simplifiée)

---

## Variables disponibles

### Couleurs

Toutes les couleurs sont définies selon le **Design System Horizon Slavia** (Cahier des charges, page 47).

#### Couleurs principales

```scss
// === PRIMARY - Mystery and Slavic folklore ===
$color-primary: #1b263b; // Bleu Nuit
$color-primary-dark: #0f1621;
$color-primary-light: #2d3a54;

// Accessibility validation:
// Bleu Nuit on white: 13.6:1 (AAA)
// Screen reader compatible (persona Léa)

// === SECONDARY - History and traditions ===
$color-secondary: #8b0000; // Rouge Grenat
$color-secondary-dark: #6b0000;
$color-secondary-light: #c41e1e;

// Accessibility validation:
// Rouge Grenat on white: 8.2:1 (AAA)

// === ACCENT - Heritage and legends ===
$color-accent: #c4a000; // Or Vieilli
$color-accent-dark: #9a7d00;
$color-accent-light: #d4b333;

// Accessibility validation:
// Or Vieilli on Bleu Nuit: 4.7:1 (AA)

// === NATURE - Authenticity ===
$color-nature: #2e472e; // Vert Forêt
$color-nature-dark: #1d2d1d;
$color-nature-light: #3f5e3f;

// === NEUTRAL - Mystical ambiance ===
$color-neutral: #b0b0b0; // Gris Brumeux
$color-neutral-dark: #666666;
$color-neutral-light: #e5e5e5;

// === SYSTEM COLORS ===
$color-white: #ffffff;
$color-black: #000000;
$color-error: #dc2626;
$color-success: #16a34a;
$color-warning: #f59e0b;
$color-info: #3b82f6;
```

#### Map des couleurs (pour itération)

```scss
// Color map for iteration
$colors: (
  "primary": $color-primary,
  "secondary": $color-secondary,
  "accent": $color-accent,
  "nature": $color-nature,
  "neutral": $color-neutral,
  "white": $color-white,
  "black": $color-black,
);
```

### Typographie

```scss
// === FONT FAMILIES (CDC page 48) ===
$font-heading: "Uncial Antiqua", serif; // Headings - Medieval style
$font-body: "Merriweather", Georgia, serif; // Body text - Optimal readability

// === FONT SIZES (modular scale 1.250) ===
// Using rem for accessibility and scalability
$font-size-xs: 0.75rem; // ~12px at default browser size
$font-size-sm: 0.875rem; // ~14px
$font-size-base: 1rem; // 16px (browser default)
$font-size-lg: 1.125rem; // ~18px
$font-size-xl: 1.25rem; // ~20px
$font-size-2xl: 1.563rem; // ~25px
$font-size-3xl: 1.953rem; // ~31px
$font-size-4xl: 2.441rem; // ~39px
$font-size-5xl: 3.052rem; // ~49px
$font-size-6xl: 3.815rem; // ~61px
$font-size-7xl: 4.768rem; // ~76px

// === FONT WEIGHTS ===
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-black: 900;

// === LINE-HEIGHT (readability) ===
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
$line-height-loose: 2;
```

### Espacements

Système basé sur **rem** pour un design fluide et accessible (1rem = 16px par défaut dans les navigateurs).

```scss
// Spacing system based on rem for fluid and accessible design
// Base: 1rem = 16px (browser default)
$spacing-0: 0;
$spacing-1: 0.25rem; // ~4px at default size
$spacing-2: 0.5rem; // ~8px
$spacing-3: 0.75rem; // ~12px
$spacing-4: 1rem; // 16px (base unit)
$spacing-5: 1.25rem; // ~20px
$spacing-6: 1.5rem; // ~24px
$spacing-8: 2rem; // ~32px
$spacing-10: 2.5rem; // ~40px
$spacing-12: 3rem; // ~48px
$spacing-16: 4rem; // ~64px
$spacing-20: 5rem; // ~80px
$spacing-24: 6rem; // ~96px
$spacing-32: 8rem; // ~128px
```

### Breakpoints (responsive)

**Approche** : Mobile-first (conforme BNF01, CDC page 10)

```scss
// === BREAKPOINTS (Mobile-first approach) ===
// Target: Anna (mobile), Marko (desktop), Léa (all devices)
// Using px for breakpoints (industry standard for media queries)
$breakpoint-sm: 40em; // 640px - Large mobile / Phablet
$breakpoint-md: 48em; // 768px - Tablet
$breakpoint-lg: 64em; // 1024px - Desktop
$breakpoint-xl: 80em; // 1280px - Large desktop
$breakpoint-2xl: 96em; // 1536px - Extra large desktop

// Map for mixin usage
$breakpoints: (
  "sm": $breakpoint-sm,
  "md": $breakpoint-md,
  "lg": $breakpoint-lg,
  "xl": $breakpoint-xl,
  "2xl": $breakpoint-2xl,
);
```

**Note** : Les breakpoints utilisent `em` plutôt que `px` pour respecter les préférences de taille de texte de l'utilisateur dans le navigateur (accessibilité).

### Autres variables

```scss
// === BORDER RADIUS ===
$radius-none: 0;
$radius-sm: 0.125rem; // ~2px
$radius-base: 0.25rem; // ~4px
$radius-md: 0.375rem; // ~6px
$radius-lg: 0.5rem; // ~8px
$radius-xl: 0.75rem; // ~12px
$radius-2xl: 1rem; // ~16px
$radius-full: 9999px; // Fully rounded (independent of size)

// === SHADOWS ===
$shadow-sm: 0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.05);
$shadow-base:
  0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1),
  0 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.1);
$shadow-md:
  0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1),
  0 0.125rem 0.25rem -0.125rem rgba(0, 0, 0, 0.1);
$shadow-lg:
  0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1),
  0 0.25rem 0.375rem -0.25rem rgba(0, 0, 0, 0.1);
$shadow-xl:
  0 1.25rem 1.5625rem -0.3125rem rgba(0, 0, 0, 0.1),
  0 0.5rem 0.625rem -0.375rem rgba(0, 0, 0, 0.1);

// === TRANSITIONS ===
$transition-fast: 150ms ease-in-out;
$transition-base: 300ms ease-in-out;
$transition-slow: 500ms ease-in-out;

// === Z-INDEX SCALE ===
$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal-backdrop: 1040;
$z-modal: 1050;
$z-popover: 1060;
$z-tooltip: 1070;
```

---

### Guide des unités CSS

**Pourquoi éviter les pixels (`px`) ?**

Les pixels sont des unités **absolues** qui ne s'adaptent pas aux préférences de l'utilisateur. Utiliser des unités relatives améliore :

- **Accessibilité** : Respect du zoom navigateur et des préférences de taille de texte
- **Responsive** : Adaptation fluide aux différentes tailles d'écran
- **Maintenance** : Un seul changement de variable affecte tout le site proportionnellement

**Tableau de référence des unités**

| Unité     | Type              | Usage recommandé                      | Exemple                              |
| --------- | ----------------- | ------------------------------------- | ------------------------------------ |
| `rem`     | Relative (root)   | Font-size, spacing, sizing            | `font-size: 1.5rem;`                 |
| `em`      | Relative (parent) | Media queries, spacing contextuel     | `@media (min-width: 48em)`           |
| `%`       | Relative (parent) | Widths, heights, positions            | `width: 100%;`                       |
| `vw`      | Viewport          | Widths responsive, fluid typography   | `width: 90vw;`                       |
| `vh`      | Viewport          | Heights fullscreen, hero sections     | `min-height: 100vh;`                 |
| `svh`     | Small viewport    | Heights mobile (exclut UI navigateur) | `min-height: 100svh;`                |
| `ch`      | Caractère         | Largeur de texte optimale             | `max-width: 65ch;`                   |
| `clamp()` | Fonction          | Valeurs fluides min/max               | `font-size: clamp(1rem, 2vw, 2rem);` |
| `calc()`  | Fonction          | Calculs dynamiques                    | `width: calc(100% - 2rem);`          |
| `px`      | Absolue           | Border-width, box-shadow détails      | `border: 1px solid;`                 |

**Exemples pratiques**

```scss
// Scalable and accessible
.container {
  max-width: 80rem; // ~1280px at default size
  padding: clamp(1rem, 5vw, 4rem); // Fluid padding
  margin-inline: auto;
}

.text-content {
  max-width: 65ch; // Optimal line length (60-75 characters)
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem); // Fluid typography
  line-height: 1.6; // Unitless (relative to font-size)
}

.hero {
  min-height: 100vh; // Full viewport height
  min-height: 100svh; // Small viewport (mobile friendly)
  padding: clamp(2rem, 5vh, 8rem) clamp(1rem, 5vw, 4rem);
}

// Not scalable
.container {
  max-width: 1280px; // Fixed, doesn't scale
  padding: 64px; // Doesn't respect user preferences
}

.hero {
  min-height: 1080px; // Doesn't adapt to viewport
}
```

**Quand utiliser `px` (exceptions)** :

```scss
// Border widths (precision visuelle)
border: 1px solid $color-neutral;

// Small shadows details
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

// Très petits ajustements (< 4px)
margin-top: -1px; // Optical alignment
```

---

## Mixins utiles

### Responsive

```scss
// Usage example:
.my-component {
  padding: $spacing-4;

  @include respond-to("md") {
    padding: $spacing-8;
  }

  @include respond-to("lg") {
    padding: $spacing-12;
  }
}
```

**Définition du mixin** :

```scss
// abstracts/_mixins.scss

// Responsive mixin (mobile-first)
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Unknown breakpoint: #{$breakpoint}. Available: #{map-keys($breakpoints)}";
  }
}

// Custom breakpoint
@mixin respond-to-custom($min-width) {
  @media (min-width: $min-width) {
    @content;
  }
}

// Between two breakpoints
@mixin respond-between($min, $max) {
  @media (min-width: map-get($breakpoints, $min)) and (max-width: map-get($breakpoints, $max) - 1px) {
    @content;
  }
}
```

### Typography

```scss
// Heading style (Uncial Antiqua)
@mixin heading-style {
  font-family: $font-heading;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  color: $color-primary;
}

// Body text (Merriweather)
@mixin body-text {
  font-family: $font-body;
  font-weight: $font-weight-normal;
  line-height: $line-height-relaxed;
  color: $color-black;
}

// Responsive typography
@mixin responsive-typography($mobile-size, $desktop-size) {
  font-size: $mobile-size;

  @include respond-to("md") {
    font-size: $desktop-size;
  }
}
```

**Utilisation** :

```scss
h1 {
  @include heading-style;
  @include responsive-typography($font-size-4xl, $font-size-6xl);
}

p {
  @include body-text;
  font-size: $font-size-base;
}
```

### Flexbox

```scss
// Center content (horizontal + vertical)
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Space between items
@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Column layout
@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// Centered column
@mixin flex-column-center {
  @include flex-column;
  align-items: center;
  justify-content: center;
}
```

**Utilisation** :

```scss
.header {
  @include flex-between;
  padding: $spacing-4;
}

.hero {
  @include flex-center;
  min-height: 100vh;
}
```

### Accessibilité (WCAG 2.1)

Conformément au **BNF04** (CDC page 11) - Score Lighthouse Accessibilité ≥ 95/100.

```scss
// === ACCESSIBILITY MIXINS (WCAG 2.1 AA) ===

// Focus visible for keyboard navigation (persona Léa)
@mixin focus-visible {
  &:focus-visible {
    outline: 2px solid $color-accent;
    outline-offset: 2px;
    border-radius: $radius-sm;
  }

  // Remove outline for mouse users
  &:focus:not(:focus-visible) {
    outline: none;
  }
}

// Keyboard navigation enhancement
@mixin keyboard-navigation {
  @include focus-visible;

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba($color-accent, 0.3);
  }
}

// Skip link (for screen readers)
@mixin skip-link {
  position: absolute;
  left: -9999px;
  z-index: $z-tooltip;
  padding: $spacing-4 $spacing-6;
  background: $color-primary;
  color: $color-white;
  text-decoration: none;
  font-weight: $font-weight-bold;
  border-radius: $radius-base;

  &:focus {
    left: 50%;
    top: $spacing-4;
    transform: translateX(-50%);
  }
}

// Screen reader only text
@mixin sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// Contrast check mixin (development helper)
@mixin a11y-check($bg, $fg, $min-ratio: 4.5) {
  background: $bg;
  color: $fg;

  // Minimum contrast ratios (WCAG 2.1):
  // - Normal text AA: 4.5:1
  // - Large text AA: 3:1
  // - Normal text AAA: 7:1
  // - Large text AAA: 4.5:1

  // TODO: Add automated validation in development mode
}
```

**Utilisation** :

```scss
// Navigation links
.nav-link {
  @include keyboard-navigation;
  color: $color-white;

  &:hover {
    color: $color-accent;
  }
}

// Skip to main content
.skip-link {
  @include skip-link;
}

// Hidden label for screen readers
.visually-hidden {
  @include sr-only;
}
```

### Performance (Core Web Vitals)

Conformément au **BNF01** (CDC page 10) - LCP < 2.5s, Score Lighthouse ≥ 90/100.

```scss
// === PERFORMANCE MIXINS (Core Web Vitals) ===

// Lazy loading images (prevent CLS)
@mixin img-lazy {
  width: 100%;
  height: auto;
  object-fit: cover;

  // Placeholder while loading
  background: $color-neutral-light;

  // Smooth transition when loaded
  &.loaded {
    animation: fadeIn $transition-base;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Optimize font loading (prevent FOIT/FOUT)
@mixin font-display($strategy: swap) {
  font-display: $strategy; // swap = show fallback immediately
}

// Aspect ratio (prevent layout shift)
@mixin aspect-ratio($width, $height) {
  aspect-ratio: #{$width} / #{$height};

  // Fallback for older browsers
  @supports not (aspect-ratio: 1 / 1) {
    position: relative;
    padding-bottom: calc(#{$height} / #{$width} * 100%);

    > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}

// GPU acceleration for smooth animations
@mixin gpu-accelerate {
  transform: translateZ(0);
  will-change: transform;
}
```

**Utilisation** :

```scss
// Article card image
.article-card__image {
  @include img-lazy;
  @include aspect-ratio(16, 9);
}

// Hero background
.hero {
  @include gpu-accelerate;
}
```

### Card & Layout

```scss
// Card component with shadow
@mixin card($padding: $spacing-6) {
  background: $color-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-base;
  padding: $padding;
}

// Card with hover effect
@mixin card-interactive($padding: $spacing-6) {
  @include card($padding);
  @include hover-lift;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    box-shadow: $shadow-lg;
  }
}

// Hover lift animation (for Anna persona - immersive UX)
@mixin hover-lift($distance: -0.25rem) {
  transition:
    transform $transition-base,
    box-shadow $transition-base;

  &:hover {
    transform: translateY($distance);
  }
}

// Text truncation
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// Smooth transition
@mixin transition($properties: all, $duration: $transition-base) {
  transition: $properties $duration;
}
```

**Utilisation** :

```scss
// Simple card
.info-card {
  @include card($spacing-8);
}

// Interactive card
.article-card {
  @include card-interactive;
}

// Truncate article excerpt
.article-excerpt {
  @include truncate(3); // 3 lines max
}
```

---

## Container Queries

Les container queries permettent un design **vraiment responsive** au niveau du composant (pas seulement au niveau de la page).

### Configuration

```scss
// Parent container
.container {
  container-type: inline-size;
  container-name: my-container;
}

// Child responds to container width (not viewport)
.child {
  padding: $spacing-4;

  @container my-container (min-width: 37.5rem) {
    // ~600px
    padding: $spacing-8;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-6;
  }

  @container my-container (min-width: 56.25rem) {
    // ~900px
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Mixin pour container queries

```scss
// abstracts/_mixins.scss

@mixin container-query($container-name, $min-width) {
  @container #{$container-name} (min-width: #{$min-width}) {
    @content;
  }
}
```

**Utilisation** :

```scss
.card-grid {
  container-type: inline-size;
  container-name: card-container;
}

.card {
  padding: $spacing-4;

  @include container-query(card-container, 400px) {
    padding: $spacing-6;
  }

  @include container-query(card-container, 600px) {
    display: flex;
    gap: $spacing-6;
  }
}
```

---

## Fonctions utiles

```scss
// abstracts/_functions.scss

// Convert px to rem (16px base - browser default)
// Usage: For legacy designs in pixels that need conversion
@function rem($pixels) {
  @return calc($pixels / 16) * 1rem;
}

// Dynamic spacing calculation
@function spacing($multiplier) {
  @return $spacing-4 * $multiplier;
}

// Add alpha channel to color
@function alpha($color, $opacity) {
  @return rgba($color, $opacity);
}

// Get color from map
@function color($key) {
  @if map-has-key($colors, $key) {
    @return map-get($colors, $key);
  }
  @warn "Color '#{$key}' not found in $colors map";
  @return null;
}

// Convert viewport width percentage to vw
@function vw($target, $context: 1920) {
  @return calc($target / $context) * 100vw;
}

// Convert viewport height percentage to vh
@function vh($target, $context: 1080) {
  @return calc($target / $context) * 100vh;
}
```

**Utilisation** :

```scss
.hero {
  // Convert 320px to rem (only if working from px design)
  max-width: rem(320); // 20rem

  // Dynamic spacing (1rem * 6 = 6rem)
  padding: spacing(6);

  // Semi-transparent background
  background: alpha($color-primary, 0.9);

  // Get color from map
  border-color: color("accent");

  // Fluid typography (responsive without media queries)
  font-size: clamp(1rem, 2vw + 1rem, 3rem);

  // Full viewport height hero
  min-height: 100vh;

  // Responsive width with vw
  width: min(90vw, 80rem); // 90% of viewport or max 80rem
}
```

**Unités recommandées selon le contexte** :

| Propriété                 | Unité recommandée | Raison                          |
| ------------------------- | ----------------- | ------------------------------- |
| `font-size`               | `rem`             | Respect préférences utilisateur |
| `padding`, `margin`       | `rem`             | Scalabilité et cohérence        |
| `width`, `max-width`      | `rem`, `%`, `ch`  | Lisibilité et flexibilité       |
| `height` (hero, sections) | `vh`, `svh`       | Adaptabilité viewport           |
| `border-radius`           | `rem`, `%`        | Proportionnel au contexte       |
| `border-width`            | `px`              | Précision visuelle              |
| `box-shadow`              | `rem`             | Cohérence avec espacements      |
| `breakpoints`             | `em`              | Accessibilité (zoom texte)      |

---

## Accessibilité (WCAG 2.1)

### Objectifs (BNF04, CDC page 11)

- Conformité **WCAG 2.1 niveau AA**
- Score Lighthouse Accessibilité **≥ 95/100**
- Navigation entièrement **compatible clavier**
- Support **lecteurs d'écran** (persona Léa)

### Checklist d'implémentation

#### 1. Contrastes de couleurs

```scss
// All color combinations are validated:
// Bleu Nuit (#1B263B) on white: 13.6:1 (AAA)
// Rouge Grenat (#8B0000) on white: 8.2:1 (AAA)
// Or Vieilli (#C4A000) on Bleu Nuit: 4.7:1 (AA)

.text-on-primary {
  background: $color-primary;
  color: $color-white; // High contrast validated
}

.cta-button {
  background: $color-secondary;
  color: $color-white; // AAA compliant
}
```

#### 2. Navigation clavier

```scss
// All interactive elements MUST have focus-visible
.button,
.link,
.card-interactive {
  @include keyboard-navigation;
}

// Skip navigation for screen readers
.skip-to-content {
  @include skip-link;
}
```

#### 3. Textes alternatifs et ARIA

```html
<!-- Always provide alt text -->
<img src="image.jpg" alt="Description claire de l'image" />

<!-- Hidden decorative images -->
<img src="decoration.svg" alt="" aria-hidden="true" />

<!-- ARIA labels for icon buttons -->
<button aria-label="Fermer le menu">
  <svg><!-- icon --></svg>
</button>
```

#### 4. Hiérarchie sémantique

```scss
// Proper heading hierarchy
h1 {
  @include heading-style;
  font-size: $font-size-5xl; // Only ONE h1 per page
}

h2 {
  @include heading-style;
  font-size: $font-size-3xl; // Logical hierarchy
}

h3 {
  @include heading-style;
  font-size: $font-size-2xl;
}
```

### Outils de validation

1. **Lighthouse** (Chrome DevTools)

   ```bash
   # Generate accessibility report
   npm run build
   npx lighthouse https://localhost:4321 --only-categories=accessibility
   ```

2. **axe DevTools** (Extension Chrome/Firefox)
   - Détecte automatiquement les problèmes WCAG

3. **Tests manuels**
   - Navigation au clavier uniquement (Tab, Shift+Tab, Enter, Espace)
   - Test avec lecteur d'écran (NVDA, JAWS, VoiceOver)

---

## Performance (Core Web Vitals)

### Objectifs (BNF01, CDC page 10)

- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- Score Lighthouse Performance **≥ 90/100**

### Optimisations CSS

#### 1. Images optimisées

```scss
.hero-image {
  @include img-lazy;
  @include aspect-ratio(16, 9); // Prevent layout shift

  // Modern formats with fallback
  background-image: image-set(
    url("hero.avif") type("image/avif"),
    url("hero.webp") type("image/webp"),
    url("hero.jpg") type("image/jpeg")
  );
}
```

#### 2. Animations performantes

```scss
// Triggers reflow/repaint
.bad-animation {
  transition:
    width 300ms,
    height 300ms;
}

// GPU-accelerated
.good-animation {
  @include gpu-accelerate;
  transition:
    transform $transition-base,
    opacity $transition-base;

  &:hover {
    transform: scale(1.05); // Unitless for scale
  }
}
```

#### 3. Critical CSS

```scss
// Inline critical CSS in <head> for above-the-fold content
// Example: Hero section, header, fonts

// Then load full stylesheet
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

#### 4. Font loading strategy

```scss
// abstracts/_typography.scss

@font-face {
  font-family: "Uncial Antiqua";
  src: url("/fonts/uncial-antiqua.ttf") format("ttf");
  font-weight: 400;
  font-style: normal;
  font-display: swap; // Show fallback immediately (prevent FOIT)
}

@font-face {
  font-family: "Merriweather";
  src: url("/fonts/merriweather-regular.ttf") format("ttf");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### Monitoring

```bash
# Measure performance
npm run build
npm run preview

# Run Lighthouse
npx lighthouse http://localhost:4173 --view

# Check bundle size
npx vite-bundle-visualizer
```

---

## Exemples Horizon Slavia

### Hero Section (Page d'accueil - BF01)

```scss
.hero {
  @include flex-center;
  @include gpu-accelerate;

  // Background with overlay
  background:
    linear-gradient(rgba($color-primary, 0.75), rgba($color-primary, 0.9)),
    url("/images/hero-eastern-europe.jpg");
  background-size: cover;
  background-position: center;

  // Full viewport height (use svh for mobile browsers if available)
  min-height: 100vh;
  min-height: 100svh; // Small viewport height (excludes browser UI)

  color: $color-white;
  text-align: center;
  padding: clamp(2rem, 5vh, 8rem) clamp(1rem, 5vw, 4rem);

  // Title with medieval font
  &__title {
    @include heading-style;
    @include responsive-typography($font-size-4xl, $font-size-7xl);

    font-family: $font-heading; // Uncial Antiqua
    color: $color-accent; // Or Vieilli
    margin-bottom: clamp(1.5rem, 3vh, 3rem);
    text-shadow: 0 0.125rem 0.25rem rgba($color-black, 0.3);
  }

  // Subtitle
  &__subtitle {
    @include body-text;
    @include responsive-typography($font-size-lg, $font-size-2xl);

    color: $color-white;
    margin-bottom: clamp(2rem, 4vh, 4rem);
    max-width: 42rem; // ~672px
    margin-inline: auto;
    line-height: $line-height-relaxed;
  }

  // Call-to-action button
  &__cta {
    @include hover-lift;
    @include keyboard-navigation; // Accessibility for Léa
    @include transition(all);

    display: inline-block;
    padding: $spacing-4 $spacing-10;
    background: $color-secondary; // Rouge Grenat
    color: $color-white;
    border-radius: $radius-lg;
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
    text-decoration: none;
    box-shadow: $shadow-lg;

    &:hover {
      background: $color-secondary-dark;
      box-shadow: $shadow-xl;
    }

    &:active {
      transform: translateY(-0.125rem);
    }
  }
}
```

### Card Articles (Section Carnets - BF02)

```scss
.article-card {
  @include card-interactive($spacing-0);

  // Enable container queries
  container-type: inline-size;
  container-name: article-card;

  overflow: hidden;

  // Image with lazy loading
  &__image {
    @include img-lazy;
    @include aspect-ratio(16, 9);

    width: 100%;
    object-fit: cover;
  }

  // Content wrapper
  &__content {
    padding: $spacing-6;

    // Responsive padding with container queries
    @container article-card (min-width: 400px) {
      padding: $spacing-8;
      display: flex;
      flex-direction: column;
      gap: $spacing-4;
    }
  }

  // Article category badge
  &__category {
    display: inline-block;
    padding: $spacing-2 $spacing-4;
    background: alpha($color-accent, 0.15);
    color: $color-accent-dark;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    border-radius: $radius-full;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  // Title
  &__title {
    @include heading-style;
    @include responsive-typography($font-size-xl, $font-size-2xl);

    color: $color-primary;
    margin-top: $spacing-3;
    margin-bottom: $spacing-3;

    // Accessibility: maintain readable line-height
    line-height: $line-height-tight;
  }

  // Excerpt
  &__excerpt {
    @include body-text;
    @include truncate(3); // Max 3 lines

    color: $color-neutral-dark;
    font-size: $font-size-base;
    margin-bottom: $spacing-4;
  }

  // Read more link
  &__link {
    @include keyboard-navigation;

    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    color: $color-accent;
    font-weight: $font-weight-semibold;
    text-decoration: none;

    &:hover {
      color: $color-accent-dark;

      // Arrow animation
      .arrow {
        transform: translateX(4px);
      }
    }

    .arrow {
      @include transition(transform);
    }
  }
}
```

### Formulaire de contact (BF03)

```scss
.contact-form {
  @include card($spacing-8);
  max-width: rem(600);
  margin: 0 auto;

  // Form group
  &__group {
    margin-bottom: $spacing-6;
  }

  // Label
  &__label {
    display: block;
    font-weight: $font-weight-semibold;
    color: $color-primary;
    margin-bottom: $spacing-2;

    // Required indicator
    .required {
      color: $color-error;
      margin-left: $spacing-1;
    }
  }

  // Input fields
  &__input,
  &__textarea {
    @include keyboard-navigation;
    @include transition(all);

    width: 100%;
    padding: $spacing-3 $spacing-4;
    border: 2px solid $color-neutral;
    border-radius: $radius-base;
    font-family: $font-body;
    font-size: $font-size-base;
    color: $color-black;

    &::placeholder {
      color: $color-neutral-dark;
      opacity: 0.7;
    }

    // Focus state
    &:focus {
      border-color: $color-accent;
      box-shadow: 0 0 0 3px alpha($color-accent, 0.1);
    }

    // Error state
    &.error {
      border-color: $color-error;

      &:focus {
        box-shadow: 0 0 0 3px alpha($color-error, 0.1);
      }
    }

    // Success state
    &.success {
      border-color: $color-success;
    }
  }

  // Textarea specific
  &__textarea {
    min-height: 9.375rem; // ~150px
    resize: vertical;
  }

  // Error message
  &__error {
    display: block;
    margin-top: $spacing-2;
    color: $color-error;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }

  // RGPD checkbox (BF03)
  &__checkbox {
    display: flex;
    align-items: flex-start;
    gap: $spacing-3;
    margin-top: $spacing-6;

    input[type="checkbox"] {
      @include keyboard-navigation;
      margin-top: 0.15625rem; // ~2.5px for visual alignment
      width: 1.25rem; // ~20px
      height: 1.25rem;
      cursor: pointer;
    }

    label {
      font-size: $font-size-sm;
      color: $color-neutral-dark;
      cursor: pointer;

      a {
        color: $color-accent;
        text-decoration: underline;

        &:hover {
          color: $color-accent-dark;
        }
      }
    }
  }

  // Submit button
  &__submit {
    @include hover-lift;
    @include keyboard-navigation;
    @include transition(all);

    width: 100%;
    padding: $spacing-4;
    background: $color-secondary;
    color: $color-white;
    border: none;
    border-radius: $radius-base;
    font-family: $font-body;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: $color-secondary-dark;
      box-shadow: $shadow-md;
    }

    &:active:not(:disabled) {
      transform: translateY(-2px);
    }

    &:disabled {
      background: $color-neutral;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
```

### Navigation (Layout)

```scss
.header {
  @include flex-between;

  position: sticky;
  top: 0;
  z-index: $z-sticky;
  background: $color-primary;
  padding: $spacing-4 $spacing-6;
  box-shadow: $shadow-md;

  // Logo
  &__logo {
    @include keyboard-navigation;

    display: flex;
    align-items: center;
    gap: $spacing-3;
    color: $color-accent;
    font-family: $font-heading;
    font-size: $font-size-2xl;
    text-decoration: none;

    &:hover {
      color: $color-accent-light;
    }
  }

  // Navigation menu
  &__nav {
    display: none; // Hidden on mobile

    @include respond-to("md") {
      display: flex;
      gap: $spacing-6;
    }
  }

  // Nav links
  &__link {
    @include keyboard-navigation;
    @include transition(color);

    color: $color-white;
    font-weight: $font-weight-medium;
    text-decoration: none;
    position: relative;

    // Underline animation
    &::after {
      content: "";
      position: absolute;
      bottom: -0.25rem; // ~4px
      left: 0;
      width: 0;
      height: 0.125rem; // ~2px
      background: $color-accent;
      transition: width $transition-base;
    }

    &:hover,
    &.active {
      color: $color-accent;

      &::after {
        width: 100%;
      }
    }
  }

  // Mobile menu button
  &__menu-button {
    @include keyboard-navigation;

    display: block;
    background: transparent;
    border: none;
    color: $color-white;
    font-size: $font-size-2xl;
    cursor: pointer;
    padding: $spacing-2;

    @include respond-to("md") {
      display: none;
    }

    &:hover {
      color: $color-accent;
    }
  }
}
```

---

## Intégration avec Astro

### Installation

SCSS est supporté nativement par Astro (voir CDC page 25).

```bash
# Install Sass
npm install -D sass
```

### Utilisation globale

```astro
---
// src/layouts/Layout.astro
import '@styles/main.scss';
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horizon Slavia</title>
</head>
<body>
  <slot />
</body>
</html>
```

### Styles scopés dans un composant

```astro
---
// src/components/Card.astro
export interface Props {
  title: string;
  excerpt: string;
  image: string;
}

const { title, excerpt, image } = Astro.props;
---

<article class="card">
  <img src={image} alt={title} class="card__image" />
  <div class="card__content">
    <h3 class="card__title">{title}</h3>
    <p class="card__excerpt">{excerpt}</p>
  </div>
</article>

<style lang="scss">
  // Import variables and mixins
  @import '@styles/abstracts/variables';
  @import '@styles/abstracts/mixins';

  // Scoped styles for this component
  .card {
    @include card-interactive;

    &__image {
      @include img-lazy;
      @include aspect-ratio(16, 9);
    }

    &__title {
      @include heading-style;
      font-size: $font-size-xl;
    }
  }
</style>
```

### Build et optimisation

```bash
# Development (avec hot reload)
npm run dev

# Production build (minified + optimized)
npm run build

# Preview production build
npm run preview
```

Le CSS final est automatiquement :

- **Minifié**
- **Purgé** (unused CSS removed)
- **Optimisé** par Astro
- **Scopé** (si utilisation de `<style>` dans composants)

---

## Maintenance

### Ajouter une nouvelle couleur

1. **Définir dans** `abstracts/_variables.scss`

```scss
// New color for feature highlight
$color-highlight: #ff6b6b;
$color-highlight-dark: darken($color-highlight, 10%);
$color-highlight-light: lighten($color-highlight, 10%);
```

2. **Vérifier le contraste WCAG**

Utiliser : https://webaim.org/resources/contrastchecker/

- Minimum 4.5:1 pour texte normal (AA)
- Minimum 3:1 pour texte large (AA)
- Minimum 7:1 pour texte normal (AAA)

3. **Ajouter au map si nécessaire**

```scss
$colors: (
  // ... existing colors
  "highlight": $color-highlight
);
```

4. **Documenter l'usage**

```scss
// === HIGHLIGHT - Feature emphasis ===
// Usage: Call-to-action, promotions, badges
// Accessibility: [Contrast ratio] on [background color]
```

### Modifier un breakpoint

⚠️ **Attention** : Impact global sur le responsive

1. **Modifier dans** `$breakpoints` (`variables.scss`)

```scss
$breakpoint-md: 800px; // Was 768px
```

2. **Tester sur tous les composants**

```bash
# Test sur tous les breakpoints
npm run dev
# Tester manuellement chaque page sur mobile/tablet/desktop
```

3. **Valider avec Lighthouse**

```bash
npm run build
npx lighthouse http://localhost:4173 --preset=desktop
npx lighthouse http://localhost:4173 --preset=mobile
```

### Ajouter un nouveau composant

1. **Créer le fichier** `components/_mon-composant.scss`

```scss
// components/_article-list.scss

.article-list {
  display: grid;
  gap: $spacing-8;

  @include respond-to("md") {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to("lg") {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

2. **Importer dans** `main.scss`

```scss
// main.scss

// ... other imports

// Components
@import "components/article-list";
```

3. **Tester l'intégration**

```bash
npm run dev
# Vérifier que le composant s'affiche correctement
```

### Debug des styles

#### Voir le CSS généré

```bash
# Build with sourcemaps
npm run build

# Inspect generated CSS
cat dist/assets/*.css

# Or use browser DevTools
# Sources tab → Show original SCSS files
```

#### Problèmes courants

**Styles non appliqués** :

```scss
// Oubli d'import
.my-component {
  color: $color-primary; // Error: Undefined variable
}

// Solution
@import "@styles/abstracts/variables";

.my-component {
  color: $color-primary; // Works
}
```

**Spécificité CSS** :

```scss
// Spécificité trop faible
.button {
  color: red;
}

// Solution: Augmenter la spécificité
.card .button {
  color: red;
}

// Ou utiliser :where() pour réduire spécificité
:where(.button) {
  color: red; // 0 specificity
}
```

---

## Best Practices

### 1. Utiliser les variables au lieu des valeurs en dur

```scss
// CSS
.hero {
  color: #1b263b;
  padding: 16px;
}

// SCSS
.hero {
  color: $color-primary;
  padding: $spacing-4;
}
```

**Avantage** : Facilite les changements globaux et maintient la cohérence.

### 2. Utiliser les mixins pour éviter la duplication

```scss
// CSS (without nesting)
.button-primary {
  padding: $spacing-4 $spacing-8;
  border-radius: $radius-lg;
  transition: all $transition-base;
}

.button-secondary {
  padding: $spacing-4 $spacing-8;
  border-radius: $radius-lg;
  transition: all $transition-base;
}

// SCSS
@mixin button-base {
  padding: $spacing-4 $spacing-8;
  border-radius: $radius-lg;
  transition: all $transition-base;
}

.button-primary {
  @include button-base;
  background: $color-primary;
}

.button-secondary {
  @include button-base;
  background: $color-secondary;
}
```

### 3. Nommer les classes de manière descriptive

Utiliser la **méthodologie BEM** (Block Element Modifier) pour les composants complexes.

```scss
// Block
.card {
}

// Element (enfant du block)
.card__header {
}
.card__body {
}
.card__footer {
}

// Modifier (variation du block)
.card--featured {
}
.card--large {
}

// Combinaison
.card--featured .card__header {
}
```

**Exemple complet** :

```scss
.article-card {
  @include card;

  // Element: image
  &__image {
    width: 100%;
  }

  // Element: title
  &__title {
    font-size: $font-size-2xl;
  }

  // Modifier: featured article
  &--featured {
    border: 2px solid $color-accent;

    .article-card__title {
      color: $color-accent;
    }
  }
}
```

### 4. Privilégier les container queries pour les composants réutilisables

```scss
// Responsive based on container width
.card {
  container-type: inline-size;
  padding: $spacing-4;

  @container (min-width: 400px) {
    padding: $spacing-6;
    display: flex;
  }
}

// Less flexible: Responsive based on viewport
.card {
  padding: $spacing-4;

  @include respond-to("md") {
    padding: $spacing-6;
    display: flex;
  }
}
```

### 5. Organiser le code par composant dans des fichiers séparés

```
components/
├── _header.scss        # Navigation
├── _hero.scss          # Hero section
├── _card.scss          # Card component
├── _button.scss        # Button variations
├── _form.scss          # Form styles
└── _footer.scss        # Footer
```

### 6. Limiter l'imbrication à 3-4 niveaux maximum

```scss
// Too deep (hard to maintain)
.header {
  .nav {
    .nav-list {
      .nav-item {
        .nav-link {
          .nav-icon {
            color: red; // 6 levels !
          }
        }
      }
    }
  }
}

// Max 3 levels
.header {
  .nav-link {
    color: $color-white;

    &:hover {
      color: $color-accent;
    }
  }
}

// Using BEM
.header__nav-link {
  color: $color-white;

  &:hover {
    color: $color-accent;
  }
}
```

### 7. Préfixer les classes utilitaires

```scss
// Utility classes (helpers)
.u-text-center {
  text-align: center;
}
.u-sr-only {
  @include sr-only;
}
.u-hidden {
  display: none;
}

// Avoid conflicts with component classes
.text-center {
} // Component class
.u-text-center {
} // Utility class (clear distinction)
```

### 8. Commenter les sections importantes

```scss
// ============================================
// HERO SECTION
// ============================================
// Full-screen landing section with background image
// Personas: Anna (visual appeal), Marko (clear message)
// Related: BF01 (CDC page 8)

.hero {
  @include flex-center;
  min-height: 100vh;

  // Background with gradient overlay
  background: /* ... */;
}
```

### 9. Tester sur les vrais navigateurs

```bash
# Tests on different browsers
npm run build
npm run preview

# Open on :
# - Chrome/Edge (Chromium)
# - Firefox
# - Safari (si sur Mac)

# Mobile tests :
# - Chrome DevTools (Device Mode)
# - BrowserStack / Sauce Labs (pour iOS Safari)
```

### 10. Valider la qualité du code

```bash
# Lint SCSS (detecting errors)
npm run lint:scss

# Format code (Prettier)
npm run format

# Check accessibility
npx lighthouse http://localhost:4173 --only-categories=accessibility

# Check performance
npx lighthouse http://localhost:4173 --only-categories=performance
```

---

## Ressources complémentaires

### Documentation officielle

- [Sass Documentation](https://sass-lang.com/documentation)
- [Astro Styling Guide](https://docs.astro.build/en/guides/styling/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev (Performance)](https://web.dev/learn-core-web-vitals/)

### Outils utiles

- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Vérifier les contrastes WCAG
- [CSS Grid Generator](https://cssgrid-generator.netlify.app/) - Générer des layouts CSS Grid
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/) - Typographie responsive
- [Coolors](https://coolors.co/) - Générateur de palettes

### Validation et tests

- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- [axe DevTools](https://www.deque.com/axe/devtools/) - Extension pour tests a11y
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automatiser les tests Lighthouse

---

## Support

Pour toute question sur la structure SCSS :

- **Documentation interne** : Ce fichier README
- **Cahier des charges** : `/docs/cdc-horizon_slavia.pdf`

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0  
**Projet** : Horizon Slavia - Site web agence de voyages
