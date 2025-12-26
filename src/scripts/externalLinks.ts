/**
 * Add target="_blank" to all external links (starting with http)
 * Also adds rel="noopener noreferrer" for security
 */
export function addTargetBlankToExternalLinks() {
  const content = document.querySelector(".mdx-content");
  if (!content) return;

  const links = content.querySelectorAll('a[href^="http"]');
  links.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}
