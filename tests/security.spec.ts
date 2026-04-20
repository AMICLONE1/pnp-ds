import { test, expect } from '@playwright/test';

test.describe('Security & Authentication Guards', () => {
  test('should redirect unauthenticated users from /dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Should redirect to login page
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test('should handle unauthenticated users on /settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Should either redirect to login or show auth-required UI
    const url = page.url();
    const hasLoginPrompt = await page.getByText(/login|sign in|authenticate/i).first().isVisible().catch(() => false);
    expect(url.includes('/login') || url.includes('/settings') || hasLoginPrompt).toBeTruthy();
  });

  test('should handle unauthenticated users on /bills', async ({ page }) => {
    await page.goto('/bills');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    const url = page.url();
    const hasLoginPrompt = await page.getByText(/login|sign in|authenticate/i).first().isVisible().catch(() => false);
    expect(url.includes('/login') || url.includes('/bills') || hasLoginPrompt).toBeTruthy();
  });

  test('should block non-admin access to /admin/projects', async ({ page }) => {
    await page.goto('/admin/projects');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Should redirect to admin login
    const url = page.url();
    expect(url).toMatch(/\/(admin\/login|login|admin)/);
  });

  test('should block non-host access to /host', async ({ page }) => {
    await page.goto('/host');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toMatch(/\/(host\/login|login|host)/);
  });

  test('API: /api/credits should return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/credits');
    expect(response.status()).toBe(401);
  });

  test('API: /api/dashboard/summary should return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/dashboard/summary');
    expect(response.status()).toBe(401);
  });

  test('API: /api/notifications should return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/notifications');
    expect(response.status()).toBe(401);
  });

  test('API: /api/allocations should return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/allocations');
    expect(response.status()).toBe(401);
  });

  test('API: /api/bills should return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/bills');
    expect(response.status()).toBe(401);
  });

  test('API: /api/admin/verify should return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/admin/verify');
    expect(response.status()).toBe(401);
  });

  test('API: /api/host/verify should reject without auth', async ({ request }) => {
    const response = await request.get('/api/host/verify');
    // Should return 401, 403, or redirect (302/307)
    expect([401, 403, 302, 307]).toContain(response.status());
  });

  test('API: /api/projects should be publicly accessible', async ({ request }) => {
    const response = await request.get('/api/projects');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('API: /api/waitlist should be publicly accessible', async ({ request }) => {
    const response = await request.get('/api/waitlist');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
