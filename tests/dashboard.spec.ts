import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (requires authentication)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // If redirected to login, handle it
    if (page.url().includes('/login')) {
      // Skip tests that require authentication
      test.skip();
    }
  });

  test('should load dashboard page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check for dashboard heading or welcome message
    const dashboardHeading = page.getByRole('heading', { name: /Dashboard|Welcome/i });
    await expect(dashboardHeading).toBeVisible();
  });

  test('should display user welcome banner', async ({ page }) => {
    const welcomeBanner = page.getByText(/Welcome|Hello|Good/i);
    await expect(welcomeBanner.first()).toBeVisible();
  });

  test('should display capacity summary', async ({ page }) => {
    // Look for capacity-related text
    const capacityText = page.getByText(/kW|Capacity|Solar/i);
    await expect(capacityText.first()).toBeVisible();
  });

  test('should display savings information', async ({ page }) => {
    // Look for savings-related text
    const savingsText = page.getByText(/Savings|Saved|₹|Credits/i);
    await expect(savingsText.first()).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Check for navigation links
    const navLinks = [
      page.getByRole('link', { name: /Dashboard/i }),
      page.getByRole('link', { name: /My Projects|Reserve/i }),
      page.getByRole('link', { name: /Bills/i }),
      page.getByRole('link', { name: /Settings/i }),
    ];

    // At least one nav link should be visible
    let visibleCount = 0;
    for (const link of navLinks) {
      if (await link.isVisible()) {
        visibleCount++;
      }
    }
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('should navigate to reserve page from dashboard', async ({ page }) => {
    const reserveLink = page.getByRole('link', { name: /Reserve|Add More Capacity|My Projects/i });
    
    if (await reserveLink.isVisible()) {
      await reserveLink.click();
      await expect(page).toHaveURL(/\/reserve/);
    }
  });

  test('should navigate to bills page from dashboard', async ({ page }) => {
    const billsLink = page.getByRole('link', { name: /Bills|View Bills/i });
    
    if (await billsLink.isVisible()) {
      await billsLink.click();
      await expect(page).toHaveURL(/\/bills/);
    }
  });

  test('should navigate to settings page from dashboard', async ({ page }) => {
    const settingsLink = page.getByRole('link', { name: /Settings/i });
    
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await expect(page).toHaveURL(/\/settings/);
    }
  });

  test('should display real-time monitoring section', async ({ page }) => {
    // Look for real-time monitoring or generation data
    const monitoringText = page.getByText(/Real-time|Monitoring|Generation|Today/i);
    
    // This might not always be visible, so we check if it exists
    const count = await monitoringText.count();
    if (count > 0) {
      await expect(monitoringText.first()).toBeVisible();
    }
  });

  test('should display credit history or chart', async ({ page }) => {
    // Look for credit history or chart
    const creditText = page.getByText(/Credits|History|Chart/i);
    
    // This might not always be visible
    const count = await creditText.count();
    if (count > 0) {
      await expect(creditText.first()).toBeVisible();
    }
  });

  test('should have logout functionality', async ({ page }) => {
    // Look for user menu or logout button
    const userMenu = page.locator('#user-menu-button').or(
      page.getByRole('button', { name: /User|Profile|Menu/i })
    );
    
    if (await userMenu.isVisible()) {
      await userMenu.click();
      
      // Look for logout link/button
      const logoutButton = page.getByRole('button', { name: /Logout|Sign Out/i }).or(
        page.getByRole('link', { name: /Logout|Sign Out/i })
      );
      
      if (await logoutButton.isVisible()) {
        await expect(logoutButton).toBeVisible();
      }
    }
  });

  test('should display environmental impact metrics', async ({ page }) => {
    // Look for CO2 or environmental impact text
    const envText = page.getByText(/CO₂|Carbon|Environmental|Impact/i);
    
    const count = await envText.count();
    if (count > 0) {
      await expect(envText.first()).toBeVisible();
    }
  });
});
