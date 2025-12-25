/**
 * Transform all H2 headings into collapsible accordions
 * Only one accordion can be open at a time (mutually exclusive)
 */
export function initAutoAccordions() {
  const content = document.querySelector(".ressource-with-accordions");
  if (!content) return;

  const h2Elements = content.querySelectorAll("h2");

  // Convert each H2 into a <details> accordion
  h2Elements.forEach((h2, index) => {
    // Create accordion structure
    const accordion = document.createElement("details");
    accordion.className = "auto-accordion";
    accordion.id = `accordion-${index}`;
    // ACCESSIBILITY: Add ARIA attributes for older screen readers
    accordion.setAttribute("role", "region");
    accordion.setAttribute("aria-labelledby", `accordion-title-${index}`);

    // Create header (clickable part)
    const summary = document.createElement("summary");
    summary.className = "auto-accordion-header";

    // Add arrow icon
    const icon = document.createElement("span");
    icon.className = "auto-accordion-icon";
    icon.textContent = "▶";

    // Add title text (ACCESSIBILITY: Use h3 to preserve heading hierarchy)
    const title = document.createElement("h3");
    title.className = "auto-accordion-title";
    title.id = `accordion-title-${index}`;
    title.textContent = h2.textContent || "";

    summary.appendChild(icon);
    summary.appendChild(title);
    accordion.appendChild(summary);

    // Create content container
    const accordionContent = document.createElement("div");
    accordionContent.className = "auto-accordion-content";

    // Move all elements after H2 into accordion until next H2 or HR
    let nextElement = h2.nextElementSibling;
    const elementsToMove = [];

    while (
      nextElement &&
      nextElement.tagName !== "H2" &&
      nextElement.tagName !== "HR"
    ) {
      elementsToMove.push(nextElement);
      nextElement = nextElement.nextElementSibling;
    }

    elementsToMove.forEach((el) => {
      accordionContent.appendChild(el);
    });

    accordion.appendChild(accordionContent);
    h2.replaceWith(accordion);
  });

  // Make accordions mutually exclusive (only one open at a time)
  const allAccordions =
    content.querySelectorAll<HTMLDetailsElement>(".auto-accordion");
  allAccordions.forEach((accordion) => {
    accordion.addEventListener("toggle", () => {
      if (accordion.open) {
        // Close all other accordions
        allAccordions.forEach((otherAccordion) => {
          if (otherAccordion !== accordion && otherAccordion.open) {
            otherAccordion.open = false;
          }
        });
      }
    });
  });
}
