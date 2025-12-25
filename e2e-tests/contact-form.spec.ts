import { test, expect } from "@playwright/test";

test.describe("Contact Form Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("form fields are present and visible", async ({ page }) => {
    await expect(page.locator("#firstname")).toBeVisible();
    await expect(page.locator("#lastname")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#subject")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();
    await expect(page.locator("#consent")).toBeVisible();
  });

  test("required field validation works", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);

    const firstnameError = page.locator("#firstname-error");
    const errorText = await firstnameError.textContent();
    expect(errorText).toBeTruthy();
  });

  test("email validation works", async ({ page }) => {
    await page.fill("#email", "invalid-email");
    await page.locator("#email").blur();

    await page.waitForTimeout(300);

    const emailError = page.locator("#email-error");
    const errorText = await emailError.textContent();
    expect(errorText).toContain("email");
  });

  test("consent checkbox is required", async ({ page }) => {
    await page.fill("#firstname", "Jean");
    await page.fill("#lastname", "Dupont");
    await page.fill("#email", "jean.dupont@example.com");
    await page.fill("#subject", "Test");
    await page.fill("#message", "Ceci est un message de test.");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);

    const statusDiv = page.locator(".form-status");
    const hasError = await statusDiv.isVisible();
    expect(hasError).toBeTruthy();
  });

  test("form submission works with valid data", async ({ page }) => {
    await page.fill("#firstname", "Jean");
    await page.fill("#lastname", "Dupont");
    await page.fill("#email", "jean.dupont@example.com");
    await page.fill("#subject", "Demande d'information");
    await page.fill(
      "#message",
      "Bonjour, je souhaite obtenir plus d'informations sur vos services.",
    );
    await page.check("#consent");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(1500);

    const statusDiv = page.locator(".form-status");
    await expect(statusDiv).toBeVisible();

    const statusText = await statusDiv.textContent();
    expect(statusText).toContain("succès");
  });

  test("form fields are cleared after successful submission", async ({
    page,
  }) => {
    await page.fill("#firstname", "Marie");
    await page.fill("#lastname", "Martin");
    await page.fill("#email", "marie.martin@example.com");
    await page.fill("#subject", "Question");
    await page.fill("#message", "Ceci est une question de test.");
    await page.check("#consent");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(1500);

    const firstnameValue = await page.locator("#firstname").inputValue();
    expect(firstnameValue).toBe("");
  });

  test("submit button is disabled during submission", async ({ page }) => {
    await page.fill("#firstname", "Test");
    await page.fill("#lastname", "User");
    await page.fill("#email", "test@example.com");
    await page.fill("#subject", "Test Subject");
    await page.fill("#message", "Test message content.");
    await page.check("#consent");

    const submitButton = page.locator('button[type="submit"]');

    const clickPromise = submitButton.click();

    await page.waitForTimeout(100);

    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBeTruthy();

    await clickPromise;
  });

  test("error messages are accessible via ARIA", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);

    const errorSpan = page.locator("#firstname-error");
    const role = await errorSpan.getAttribute("role");
    const ariaLive = await errorSpan.getAttribute("aria-live");

    expect(role).toBe("alert");
    expect(ariaLive).toBe("polite");
  });

  test("privacy policy link is present and working", async ({ page }) => {
    const privacyLink = page.locator('a[href="/mentions-legales"]');
    await expect(privacyLink).toBeVisible();

    const target = await privacyLink.getAttribute("target");
    expect(target).toBe("_blank");

    const rel = await privacyLink.getAttribute("rel");
    expect(rel).toContain("noopener");
  });
});

test.describe("Contact Form Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("can navigate through form fields with Tab", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedElement).toBeTruthy();
  });

  test("can toggle consent checkbox with keyboard", async ({ page }) => {
    const consentCheckbox = page.locator("#consent");
    await consentCheckbox.focus();
    await expect(consentCheckbox).toBeFocused();

    await page.keyboard.press("Space");
    await expect(consentCheckbox).toBeChecked();

    await page.keyboard.press("Space");
    await expect(consentCheckbox).not.toBeChecked();
  });

  test("can submit form with Enter key", async ({ page }) => {
    await page.fill("#firstname", "Keyboard");
    await page.fill("#lastname", "Test");
    await page.fill("#email", "keyboard@test.com");
    await page.fill("#subject", "Testing keyboard");
    await page.fill("#message", "This is a keyboard test message.");
    await page.check("#consent");

    await page.locator("#message").focus();
    await page.keyboard.press("Enter");

    await page.waitForTimeout(1500);

    const statusDiv = page.locator(".form-status");
    await expect(statusDiv).toBeVisible();
  });
});
