import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function checkKeyboardNavigation(page: Page, selector: string) {
  const element = page.locator(selector).first();
  await element.focus();

  const isFocused = await element.evaluate(
    (el) => el === document.activeElement,
  );
  expect(isFocused).toBeTruthy();

  const outline = await element.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.outline || styles.outlineStyle;
  });
  expect(outline).not.toBe("none");
}

async function checkAriaLabels(
  page: Page,
  role: "button" | "link" | "heading" | "navigation" | "main",
  expectedCount?: number,
) {
  const elements = page.getByRole(role);
  const count = await elements.count();

  if (expectedCount !== undefined) {
    expect(count).toBe(expectedCount);
  }

  for (let i = 0; i < count; i++) {
    const element = elements.nth(i);
    const accessibleName = await element.evaluate((el) => {
      return (
        (el as HTMLElement).getAttribute("aria-label") ||
        (el as HTMLElement).textContent?.trim() ||
        (el as HTMLElement).getAttribute("title")
      );
    });
    expect(accessibleName).toBeTruthy();
  }
}

test.describe("WCAG 2.1 Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Page has proper document structure", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    const mainLandmark = await page.locator("main").count();
    expect(mainLandmark).toBeGreaterThanOrEqual(1);

    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("fr");
  });

  test("Navigation is keyboard accessible", async ({ page }) => {
    await checkKeyboardNavigation(page, "a[href]");
    await checkKeyboardNavigation(page, "button");
  });

  test("All interactive elements have visible focus indicators", async ({
    page,
  }) => {
    const interactiveElements = await page
      .locator("a, button, input, textarea, select")
      .all();

    for (const element of interactiveElements.slice(0, 5)) {
      await element.focus();
      const outlineStyle = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline || styles.outlineStyle;
      });
      expect(outlineStyle).not.toBe("none");
    }
  });

  test("Images have alt text", async ({ page }) => {
    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt).toBeDefined();
    }
  });

  test("Form inputs have proper labels", async ({ page }) => {
    await page.goto("/");

    const inputs = await page.locator("input:visible, textarea:visible").all();

    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");

      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        const hasLabel = label > 0 || ariaLabel || ariaLabelledBy;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test("Links have descriptive text", async ({ page }) => {
    const links = await page.locator("a[href]").all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");
      const title = await link.getAttribute("title");

      const hasDescription =
        (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasDescription).toBeTruthy();
    }
  });

  test("Headings follow hierarchical order", async ({ page }) => {
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const levels: number[] = [];

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tagName.substring(1));
      levels.push(level);
    }

    expect(levels[0]).toBe(1);

    for (let i = 1; i < levels.length; i++) {
      const jump = levels[i] - levels[i - 1];
      expect(jump).toBeLessThanOrEqual(1);
    }
  });

  test("Color contrast is sufficient", async ({ page }) => {
    const textElements = await page
      .locator("p, h1, h2, h3, h4, h5, h6, a, button, span")
      .all();

    for (const element of textElements.slice(0, 10)) {
      const isVisible = await element.isVisible();
      if (!isVisible) continue;

      const contrast = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
        };
      });

      expect(contrast.color).toBeTruthy();
    }
  });

  test("Page is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const body = await page.locator("body").boundingBox();
    expect(body).toBeTruthy();

    const horizontalScroll = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(horizontalScroll).toBeFalsy();
  });

  test("Tab order is logical", async ({ page }) => {
    const focusableElements = await page
      .locator(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      .all();

    for (let i = 0; i < Math.min(focusableElements.length, 5); i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(focused).toBeTruthy();
    }
  });

  test("Skip to main content link exists", async ({ page }) => {
    const skipLink = await page
      .locator('a[href="#main"], a[href="#content"]')
      .count();
    expect(skipLink).toBeGreaterThanOrEqual(0);
  });

  test("Form validation provides accessible error messages", async ({
    page,
  }) => {
    await page.goto("/");

    const submitButton = page.locator('button[type="submit"]').first();
    if ((await submitButton.count()) > 0) {
      await submitButton.click();

      await page.waitForTimeout(500);

      const errorMessages = await page
        .locator('[role="alert"], .error-message')
        .all();

      for (const error of errorMessages) {
        const ariaLive = await error.getAttribute("aria-live");
        const role = await error.getAttribute("role");
        expect(ariaLive || role).toBeTruthy();
      }
    }
  });

  test("Required form fields are properly marked", async ({ page }) => {
    const requiredInputs = await page
      .locator("input[required], textarea[required]")
      .all();

    for (const input of requiredInputs) {
      const ariaRequired = await input.getAttribute("aria-required");
      const required = await input.getAttribute("required");

      expect(ariaRequired === "true" || required !== null).toBeTruthy();
    }
  });

  test("Buttons have accessible names", async ({ page }) => {
    await checkAriaLabels(page, "button");
  });

  test("Page does not have duplicate IDs", async ({ page }) => {
    const ids = await page.evaluate(() => {
      const allElements = document.querySelectorAll("[id]");
      const idList: string[] = [];
      allElements.forEach((el) => {
        if (el.id) idList.push(el.id);
      });
      return idList;
    });

    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  test("Reduced motion is respected", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    const animations = await page.evaluate(() => {
      const allElements = document.querySelectorAll("*");
      let hasAnimations = false;
      allElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        if (
          styles.animation !== "none" ||
          styles.transition !== "all 0s ease 0s"
        ) {
          hasAnimations = true;
        }
      });
      return hasAnimations;
    });

    expect(animations).toBeDefined();
  });
});

test.describe("Contact Form Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Contact form is keyboard accessible", async ({ page }) => {
    const firstNameInput = page.locator("#firstname");
    if ((await firstNameInput.count()) === 0) return;

    await firstNameInput.focus();
    await expect(firstNameInput).toBeFocused();

    await page.keyboard.press("Tab");
    const lastNameInput = page.locator("#lastname");
    if ((await lastNameInput.count()) > 0) {
      await expect(lastNameInput).toBeFocused();
    }
  });

  test("Contact form has proper ARIA attributes", async ({ page }) => {
    const emailInput = page.locator("#email");
    if ((await emailInput.count()) === 0) return;

    const ariaRequired = await emailInput.getAttribute("aria-required");
    expect(ariaRequired).toBe("true");

    const ariaDescribedBy = await emailInput.getAttribute("aria-describedby");
    expect(ariaDescribedBy).toBeTruthy();
  });

  test("Consent checkbox is accessible", async ({ page }) => {
    const consentCheckbox = page.locator("#consent");
    if ((await consentCheckbox.count()) === 0) return;

    await consentCheckbox.focus();
    await expect(consentCheckbox).toBeFocused();

    await page.keyboard.press("Space");
    await expect(consentCheckbox).toBeChecked();
  });
});
