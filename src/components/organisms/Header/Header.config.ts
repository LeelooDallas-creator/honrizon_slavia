// ============================================
// HEADER - Configuration des items de navigation
// ============================================

import type { DropdownItem } from './Header.types';
import legendes from "@assets/logo.jpg";
import europeCentrale from "@assets/logo.jpg";
import ressources from "@assets/logo.jpg";

// ============================================
// INSPIRATIONS - Dropdown items
// ============================================
export const inspirationItems: DropdownItem[] = [
  {
    subtitle: "Au coeur des légendes",
    href: "/legendes",
    image: legendes,
    description: "Découvrez des récits oubliés et des mythes fascinants de l'Europe de l'Est.",
  },
];

// ============================================
// CARNETS - Dropdown items
// ============================================
export const carnetItems: DropdownItem[] = [
  {
    subtitle: "Europe centrale",
    href: "/europe-centrale",
    image: europeCentrale,
    description: "Récits de voyage et guides pratiques pour l'Europe centrale.",
  },
];

// ============================================
// RESSOURCES - Dropdown items
// ============================================
export const ressourcesItems: DropdownItem[] = [
  {
    subtitle: "Guide de survie",
    href: "/ressources/guide-survie",
    image: ressources,
    description: "Lexiques linguistiques essentiels pour voyager en Europe de l'Est.",
  },
  {
    subtitle: "Checklist du voyageur",
    href: "/ressources/checklist-depart",
    image: ressources,
    description: "Préparez votre départ avec notre liste complète.",
  },
  {
    subtitle: "Contacts d'urgence",
    href: "/ressources/contacts-urgence",
    image: ressources,
    description: "Numéros utiles et ambassades dans chaque pays.",
  },
];