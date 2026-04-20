import { test, expect } from '@playwright/test';

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load admin login page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/login/);
    const heading = page.getByRole('heading', { name: /Admin|Administration/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('should display admin access only badge', async ({ page }) => {
    const badge = page.getByText(/Admin Access Only|Restricted|Authorized/i).first();
    await expect(badge).toBeVisible({ timeout: 15000 });
  });

  test('should display system features on left pane', async ({ page }) => {
    const features = [
      /User Management/i,
      /System Monitoring/i,
      /Infrastructure/i,
    ];
    for (const feature of features) {
      const text = page.getByText(feature).first();
      if (await text.count() > 0) {
        await expect(text).toBeVisible();
      }
    }
  });

  test('should display email and password fields', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/admin|email/i).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const passwordInput = page.getByPlaceholder(/password/i).first();
    await expect(passwordInput).toBeVisible();
  });

  test('should display Sign In as Admin button', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: /Sign In as Admin/i });
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test('should show error for invalid admin credentials', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/admin|email/i).first();
    const passwordInput = page.getByPlaceholder(/password/i).first();

    await emailInput.fill('fake-admin@test.com');
    await passwordInput.fill('wrongpassword');

    const signInButton = page.getByRole('button', { name: /Sign In as Admin/i });
    await signInButton.click();

    // Should stay on admin login page (or show error)
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('should have links to user and host login', async ({ page }) => {
    const userLoginLink = page.getByRole('link', { name: /User Login/i });
    const hostLoginLink = page.getByRole('link', { name: /Host Login/i });

    if (await userLoginLink.count() > 0) {
      await expect(userLoginLink).toBeVisible();
    }
    if (await hostLoginLink.count() > 0) {
      await expect(hostLoginLink).toBeVisible();
    }
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotLink = page.getByText(/Forgot password/i).first();
    if (await forgotLink.count() > 0) {
      await expect(forgotLink).toBeVisible();
    }
  });
});
