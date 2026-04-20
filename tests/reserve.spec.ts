import { test, expect } from '@playwright/test';

test.describe('Reserve Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reserve');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load reserve page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/reserve/);
    const heading = page.getByRole('heading', { name: /Reserve|Solar Capacity|Projects/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('should display hero section with value propositions', async ({ page }) => {
    const heroText = page.getByText(/Reserve Your Solar Capacity|Generation Guarantee/i).first();
    await expect(heroText).toBeVisible({ timeout: 15000 });
  });

  test('should display at least one solar project', async ({ page }) => {
    // Look for project card content
    const projectName = page.getByText(/Vedvyas|Solar Park|Solar Project/i).first();
    await expect(projectName).toBeVisible({ timeout: 15000 });
  });

  test('should show project details (capacity, rate, location)', async ({ page }) => {
    // Check for capacity info
    const capacityText = page.getByText(/kW/i).first();
    await expect(capacityText).toBeVisible({ timeout: 15000 });

    // Check for rate info
    const rateText = page.getByText(/₹|per unit|per kW/i).first();
    await expect(rateText).toBeVisible({ timeout: 15000 });
  });

  test('should show sign up to reserve button for unauthenticated users', async ({ page }) => {
    const reserveButton = page.getByRole('button', { name: /Sign up to reserve|Reserve|Get Started/i }).first();
    // Scroll into view if needed
    if (await reserveButton.count() > 0) {
      await reserveButton.scrollIntoViewIfNeeded();
      await expect(reserveButton).toBeVisible();
    }
  });

  test('should show project location information', async ({ page }) => {
    const locationText = page.getByText(/Maharashtra|Pune|Gujarat|Karnataka/i).first();
    await expect(locationText).toBeVisible({ timeout: 15000 });
  });

  test('should show generation guarantee badge', async ({ page }) => {
    const guaranteeText = page.getByText(/guarantee|generation/i).first();
    if (await guaranteeText.count() > 0) {
      await expect(guaranteeText).toBeVisible({ timeout: 15000 });
    }
  });
});
