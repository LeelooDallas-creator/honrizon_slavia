import { initInteractiveCheckboxes } from '@scripts/checkboxes';
      import { initAutoAccordions } from '@scripts/accordions';
      import { addTargetBlankToExternalLinks } from '@scripts/externalLinks';

      // Initialize in correct order: checkboxes MUST be processed before accordions
      export function initAll() {
        initInteractiveCheckboxes();
        initAutoAccordions();
        addTargetBlankToExternalLinks();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
      } else {
        initAll();
      }