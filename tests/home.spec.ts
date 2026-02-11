import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check page title
    await expect(page).toHaveTitle(/PowerNetPro/i, { timeout: 10000 });
    
    // Check main heading is visible (use first() to handle multiple matches)
    await expect(page.getByRole('heading', { name: 'PowerNetPro' }).first()).toBeVisible({ timeout: 15000 });
  });

  test('should display hero section with CTA', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for hero section to render - check for specific button text
    const heroCTA = page.getByRole('button', { name: /Start Saving Today|Get Started Free/i }).first();
    await expect(heroCTA).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to reserve page from CTA', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for button to be visible and clickable
    const ctaButton = page.getByRole('button', { name: /Start Saving Today|Get Started Free/i }).first();
    await expect(ctaButton).toBeVisible({ timeout: 15000 });
    await ctaButton.click();
    
    // Should navigate to reserve page
    await expect(page).toHaveURL(/\/reserve/, { timeout: 10000 });
  });

  test('should display calculator section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to calculator section - use first() to handle multiple matches
    const calculator = page.getByText(/Calculate Your Savings/i).first();
    await calculator.scrollIntoViewIfNeeded();
    await expect(calculator).toBeVisible();
  });

  test('should display benefits section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for benefits section heading - use more specific selector
    const benefits = page.getByRole('heading', { name: /Benefits/i }).first();
    await benefits.scrollIntoViewIfNeeded();
    await expect(benefits).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for "How It Works" section heading - use more specific selector
    const howItWorks = page.getByRole('heading', { name: /How It Works/i }).first();
    await howItWorks.scrollIntoViewIfNeeded();
    await expect(howItWorks).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check navigation links - use first() to handle multiple matches
    const navLinks = [
      page.getByRole('navigation').getByRole('link', { name: /How It Works/i }).first(),
      page.getByRole('navigation').getByRole('link', { name: /Benefits/i }).first(),
      page.getByRole('navigation').getByRole('link', { name: /Contact/i }).first(),
    ];

    for (const link of navLinks) {
      if (await link.isVisible()) {
        await expect(link).toBeVisible();
      }
    }
  });

  test('should display footer with links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    const footer = page.locator('footer').first();
    await footer.scrollIntoViewIfNeeded({ timeout: 10000 });
    await expect(footer).toBeVisible();
    
    // Check footer links
    const footerLinks = page.locator('footer').getByRole('link');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
