import { test, expect } from '@playwright/test';

test.describe('Authentication UI', () => {
  test('should load the vendor login page', async ({ page }) => {
    // Navigate to the auth page
    await page.goto('/vendor/auth');

    // Check for the "Welcome back" or "Create an account" heading
    // Using a more flexible regex for either login or signup state
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/Welcome back|Create an account/);
  });

  test('should display phone auth after clicking phone tab', async ({ page }) => {
    await page.goto('/vendor/auth');

    // Click on the Phone tab
    const phoneTab = page.getByRole('button', { name: /Phone/i });
    await phoneTab.click();

    // Verify phone number field appears
    const phoneLabel = page.getByText(/Phone Number \(India Only\)/i);
    await expect(phoneLabel).toBeVisible();
  });

  test('should switch between sign in and sign up', async ({ page }) => {
    await page.goto('/vendor/auth');

    // Click "Sign up for free"
    const signUpLink = page.getByRole('button', { name: /Sign up for free/i });
    await signUpLink.click();

    // Verify header changed to "Create an account"
    const heading = page.locator('h1');
    await expect(heading).toHaveText(/Create an account/i);

    // Click "Sign in"
    const signInLink = page.getByRole('button', { name: /Sign in/i });
    await signInLink.click();

    // Verify header changed to "Welcome back"
    await expect(heading).toHaveText(/Welcome back/i);
  });
});
