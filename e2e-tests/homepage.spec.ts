import { test, expect } from "@playwright/test";

test.describe("Homepage Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Horizon Slavia/i);
  });

  test("hero section is visible", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("navigation menu works", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const links = nav.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test("accordion items expand and collapse", async ({ page }) => {
    const accordionButton = page.locator("button[aria-expanded]").first();
    if ((await accordionButton.count()) === 0) return;

    const initialState = await accordionButton.getAttribute("aria-expanded");

    await accordionButton.click();
    await page.waitForTimeout(300);

    const newState = await accordionButton.getAttribute("aria-expanded");
    expect(newState).not.toBe(initialState);
  });

  test("contact form is present", async ({ page }) => {
    const form = page.locator("form.contact-form");
    await expect(form).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("all images load successfully", async ({ page }) => {
    const images = await page.locator("img").all();

    for (const img of images) {
      const isLoaded = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalHeight > 0,
      );
      expect(isLoaded).toBeTruthy();
    }
  });
});

test.describe("Responsive Design Tests", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name}: page renders correctly`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");

      const body = await page.locator("body").boundingBox();
      expect(body).toBeTruthy();
      expect(body!.width).toBeLessThanOrEqual(viewport.width);

      const horizontalScroll = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });
      expect(horizontalScroll).toBeFalsy();
    });
  }
});

test.describe("Performance Tests", () => {
  test("page loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });
});
