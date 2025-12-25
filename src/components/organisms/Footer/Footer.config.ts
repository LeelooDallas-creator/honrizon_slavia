// ============================================
// FOOTER - Configuration
// ============================================

export interface FooterLink {
  label: string;
  href: string;
  icon?: string; // optionnel
}

export interface SocialLink {
  name: string;
  href: string;
  ariaLabel: string;
}

// ============================================
// CONTACT LINKS
// ============================================
export const contactLinks: FooterLink[] = [
  {
    label: "Formulaire de contact",
    href: "/contact",
  },
  {
    label: "contact@horizonslavia.fr",
    href: "mailto:contact@horizonslavia.fr",
  },
  {
    label: "+33 1 23 45 67 89",
    href: "tel:+33123456789",
  },
];

// ============================================
// INFORMATIONS LINKS
// ============================================
export const informationLinks: FooterLink[] = [
  {
    label: "À propos",
    href: "/a-propos",
  },
  {
    label: "Mentions légales",
    href: "/mentions-legales",
  },
  {
    label: "CGV",
    href: "/cgv",
  },
  {
    label: "Politique de confidentialité",
    href: "/politique-confidentialite",
  },
  {
    label: "Gestion des cookies",
    href: "/cookies",
  },
];

// ============================================
// SOCIAL LINKS
// ============================================
export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    ariaLabel: "Suivez-nous sur Facebook",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    ariaLabel: "Suivez-nous sur Instagram",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    ariaLabel: "Suivez-nous sur YouTube",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    ariaLabel: "Suivez-nous sur Pinterest",
  },
];

// ============================================
// FOOTER CONTENT
// ============================================
export const footerDescription =
  "Explorez l'Europe de l'Est authentique à travers nos carnets de voyage, inspirations culturelles et ressources pratiques. Votre guide pour des aventures mémorables dans les pays slaves.";

export const footerCreditText = "Conçu avec passion pour l'Europe de l'Est";
