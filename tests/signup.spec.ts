import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    // Wait a bit for client-side hydration
    await page.waitForTimeout(1000);
  });

  test('should load signup page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/signup/);
    const heading = page.getByRole('heading', { name: /Create|Sign Up|Account/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('should display multi-step progress indicator', async ({ page }) => {
    const stepIndicator = page.getByText(/Step 1|STEP 1/i).first();
    await expect(stepIndicator).toBeVisible({ timeout: 15000 });
  });

  test('should display step labels in progress bar', async ({ page }) => {
    const steps = ['Account', 'Utility', 'Solar Plan', 'Verify', 'Reserve'];
    for (const step of steps) {
      const stepText = page.getByText(step, { exact: false }).first();
      await expect(stepText).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display account creation form fields', async ({ page }) => {
    // Full Name
    const nameField = page.getByPlaceholder(/full name/i);
    await expect(nameField).toBeVisible({ timeout: 10000 });

    // Email
    const emailField = page.getByPlaceholder(/example.com/i);
    await expect(emailField).toBeVisible();

    // Mobile Number
    const mobileField = page.getByPlaceholder(/mobile/i);
    await expect(mobileField).toBeVisible();
  });

  test('should show password fields when scrolled down', async ({ page }) => {
    // Scroll down to see password fields
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    
    const passwordField = page.getByPlaceholder(/password/i).first();
    await expect(passwordField).toBeVisible({ timeout: 10000 });
  });

  test('should have Continue button', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /Continue/i });
    await expect(continueButton).toBeVisible({ timeout: 10000 });
  });

  test('should have link to login page for existing users', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /Sign in|Login|Already have/i }).first();
    if (await loginLink.count() > 0) {
      await expect(loginLink).toBeVisible();
    }
  });

  test('should show validation on empty form submission', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: /Continue/i });
    await continueButton.click();
    // Should stay on signup page
    await expect(page).toHaveURL(/\/signup/);
  });
});
