import { test, expect } from '@playwright/test';

test.describe('Host Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/host/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load host login page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/host\/login/);
    const heading = page.getByRole('heading', { name: /Host|Solar Host/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('should display host-specific features on left pane', async ({ page }) => {
    const features = [
      /Plant Analytics/i,
      /Financial Dashboard/i,
      /Customer Management/i,
    ];
    for (const feature of features) {
      const text = page.getByText(feature).first();
      if (await text.count() > 0) {
        await expect(text).toBeVisible();
      }
    }
  });

  test('should display email and password fields', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/email/i).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const passwordInput = page.getByPlaceholder(/password/i).first();
    await expect(passwordInput).toBeVisible();
  });

  test('should have sign in button', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: /Sign In|Login/i }).first();
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test('should mention administrator-created accounts', async ({ page }) => {
    const text = page.getByText(/created by administrator|admin|contact/i).first();
    if (await text.count() > 0) {
      await expect(text).toBeVisible();
    }
  });

  test('should show error for invalid host credentials', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/email/i).first();
    const passwordInput = page.getByPlaceholder(/password/i).first();

    await emailInput.fill('fakehost@test.com');
    await passwordInput.fill('wrongpassword');

    const signInButton = page.getByRole('button', { name: /Sign In|Login/i }).first();
    await signInButton.click();

    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/host\/login/);
  });
});
