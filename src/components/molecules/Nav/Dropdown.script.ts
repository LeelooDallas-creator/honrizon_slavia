// ============================================
// DROPDOWN - JavaScript behaviors
// ============================================

/**
 * Dropdown component with keyboard navigation and accessibility
 */
export class DropdownComponent {
  private trigger: HTMLButtonElement;
  private panel: HTMLElement;
  private dropdown: HTMLElement;
  private isOpen: boolean = false;

  constructor(dropdown: HTMLElement) {
    this.dropdown = dropdown;
    this.trigger = dropdown.querySelector("[data-dropdown-trigger]")!;
    this.panel = dropdown.querySelector("[data-dropdown-panel]")!;

    if (!this.trigger || !this.panel) {
      console.warn("Dropdown: Missing trigger or panel element");
      return;
    }

    this.init();
  }

  /**
   * Initialize event listeners
   */
  private init() {
    // Click on trigger
    this.trigger.addEventListener("click", () => this.toggle());

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
        this.trigger.focus();
      }
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.dropdown.contains(e.target as Node)) {
        this.close();
      }
    });

    // Keyboard navigation inside panel
    this.panel.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Update position on scroll (if dropdown is open)
    window.addEventListener("scroll", () => {
      if (this.isOpen) {
        this.updateDropdownPosition();
      }
    });

    // Update position on resize
    window.addEventListener("resize", () => {
      if (this.isOpen) {
        this.updateDropdownPosition();
      }
    });
  }

  /**
   * Toggle dropdown open/close
   */
  private toggle() {
    this.isOpen ? this.close() : this.open();
  }

  /**
   * Open dropdown
   */
  private open() {
    this.isOpen = true;
    this.trigger.setAttribute("aria-expanded", "true");
    this.panel.setAttribute("data-state", "open");

    // Calculer la position du dropdown juste sous le header
    this.updateDropdownPosition();

    // Focus first menu item
    const firstItem =
      this.panel.querySelector<HTMLElement>('[role="menuitem"]');
    if (firstItem) {
      firstItem.tabIndex = 0;
      firstItem.focus();
    }

    // Prevent body scroll on mobile
    if (window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    }
  }

  /**
   * Update dropdown position to be below header
   */
  private updateDropdownPosition() {
    const header = document.querySelector("[data-header]");
    if (header) {
      const headerRect = header.getBoundingClientRect();
      const headerBottom = headerRect.bottom;
      this.panel.style.top = `${headerBottom + 8}px`; // +8px pour un petit espace
    }
  }

  /**
   * Close dropdown
   */
  private close() {
    this.isOpen = false;
    this.trigger.setAttribute("aria-expanded", "false");
    this.panel.removeAttribute("data-state");

    // Reset tab indexes
    const items = this.panel.querySelectorAll<HTMLElement>('[role="menuitem"]');
    items.forEach((item) => (item.tabIndex = -1));

    // Restore body scroll
    document.body.style.overflow = "";
  }

  /**
   * Handle keyboard navigation (Arrow keys, Home, End)
   */
  private handleKeyboard(e: KeyboardEvent) {
    const items = Array.from(
      this.panel.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const currentIndex = items.findIndex(
      (item) => item === document.activeElement,
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        this.focusItem(items, nextIndex, currentIndex);
        break;

      case "ArrowUp":
        e.preventDefault();
        const prevIndex =
          currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        this.focusItem(items, prevIndex, currentIndex);
        break;

      case "Home":
        e.preventDefault();
        this.focusItem(items, 0, currentIndex);
        break;

      case "End":
        e.preventDefault();
        this.focusItem(items, items.length - 1, currentIndex);
        break;

      case "Tab":
        // Allow tab to close dropdown and move to next element
        this.close();
        break;
    }
  }

  /**
   * Focus a specific menu item
   */
  private focusItem(items: HTMLElement[], newIndex: number, oldIndex: number) {
    items[newIndex].tabIndex = 0;
    items[newIndex].focus();

    if (oldIndex >= 0 && oldIndex !== newIndex) {
      items[oldIndex].tabIndex = -1;
    }
  }

  /**
   * Destroy dropdown (cleanup)
   */
  public destroy() {
    this.close();
    // Remove event listeners if needed
  }
}

/**
 * Initialize all dropdowns on the page
 */
export function initDropdowns() {
  const dropdowns = document.querySelectorAll<HTMLElement>("[data-dropdown]");

  dropdowns.forEach((dropdown) => {
    new DropdownComponent(dropdown);
  });
}

// Auto-init when DOM is ready
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDropdowns);
  } else {
    initDropdowns();
  }
}
