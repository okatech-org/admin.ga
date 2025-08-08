import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to log in', async ({ page }) => {
    await page.goto('/auth/connexion');

    // Check if the form is visible
    await expect(page.locator('form')).toBeVisible();

    // Fill in the credentials
    await page.fill('input[name="email"]', 'superadmin@administration.ga');
    await page.fill('input[name="password"]', 'demo123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation and check for a welcome message
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Bienvenue');
  });
});
