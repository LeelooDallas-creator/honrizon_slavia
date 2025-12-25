// ============================================
// HEADER - JavaScript behaviors
// ============================================

/**
 * Gestion du scroll pour header sticky
 * Ajoute la classe 'scrolled' quand on scroll plus de 50px
 */
export function initScrollBehavior() {
  const header = document.querySelector("[data-header]") as HTMLElement;

  if (!header) return;

  const scrollThreshold = 50;

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cleanup function (optionnel, pour les SPA)
  return () => window.removeEventListener("scroll", handleScroll);
}

/**
 * Gestion du menu mobile
 * Toggle du menu hamburger avec gestion de l'accessibilité
 */
export function initMobileMenu() {
  const menuToggle = document.querySelector(
    "[data-menu-toggle]",
  ) as HTMLButtonElement;
  const mobileMenu = document.querySelector(
    "[data-mobile-menu]",
  ) as HTMLElement;

  if (!menuToggle || !mobileMenu) return;

  // Toggle du menu
  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    // Update aria attributes
    menuToggle.setAttribute("aria-expanded", String(newState));
    menuToggle.setAttribute(
      "aria-label",
      newState ? "Fermer le menu" : "Ouvrir le menu",
    );

    // Toggle classe CSS
    mobileMenu.classList.toggle("is-open", newState);

    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = newState ? "hidden" : "";
  };

  // Event listener sur le bouton
  menuToggle.addEventListener("click", toggleMenu);

  // Gestion des sous-menus
  const submenuTriggers = mobileMenu.querySelectorAll(
    "[data-mobile-submenu-trigger]",
  );
  submenuTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const button = trigger as HTMLButtonElement;
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const submenu = button.nextElementSibling as HTMLElement;

      // Toggle submenu
      button.setAttribute("aria-expanded", String(!isExpanded));
      submenu?.classList.toggle("is-open", !isExpanded);
    });
  });

  // Fermer le menu en cliquant sur un lien
  const mobileLinks = mobileMenu.querySelectorAll(
    ".header__mobile-sublink, .header__mobile-link--cta",
  );
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  // Cleanup function (optionnel)
  return () => {
    menuToggle.removeEventListener("click", toggleMenu);
  };
}

/**
 * Initialisation de tous les comportements du Header
 * À appeler une fois le DOM chargé
 */
export function initHeader() {
  // Attendre que le DOM soit prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initScrollBehavior();
      initMobileMenu();
    });
  } else {
    initScrollBehavior();
    initMobileMenu();
  }
}
