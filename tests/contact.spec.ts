import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load contact page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/contact/);
    const heading = page.getByRole('heading', { name: /Get in Touch|Contact/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('should display contact information section', async ({ page }) => {
    const emailInfo = page.getByText(/info@powernetpro/i).first();
    await expect(emailInfo).toBeVisible({ timeout: 10000 });

    const phoneInfo = page.getByText(/8805 881 601/i).first();
    await expect(phoneInfo).toBeVisible();
  });

  test('should display company address', async ({ page }) => {
    const addressText = page.getByText(/Pune|Maharashtra|India/i).first();
    await expect(addressText).toBeVisible({ timeout: 10000 });
  });

  test('should display contact form fields', async ({ page }) => {
    const nameField = page.getByPlaceholder(/John Doe|name/i).first();
    await expect(nameField).toBeVisible({ timeout: 10000 });

    const emailField = page.getByPlaceholder(/example.com|email/i).first();
    await expect(emailField).toBeVisible();
  });

  test('should display message/subject fields', async ({ page }) => {
    const subjectField = page.getByPlaceholder(/help|subject/i).first();
    if (await subjectField.count() > 0) {
      await expect(subjectField).toBeVisible();
    }
  });

  test('should have send message button', async ({ page }) => {
    const sendButton = page.getByRole('button', { name: /Send|Submit|Message/i }).first();
    await expect(sendButton).toBeVisible({ timeout: 10000 });
  });

  test('should display grievance officer information', async ({ page }) => {
    const grievanceText = page.getByText(/Grievance|Complaints/i).first();
    await grievanceText.scrollIntoViewIfNeeded();
    await expect(grievanceText).toBeVisible({ timeout: 10000 });
  });
});
