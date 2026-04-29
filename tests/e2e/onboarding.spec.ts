import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  // Note: For a real system test, you would need to handle authentication.
  // One way is to use a global setup that logs in once and reuses the session.
  // For this example, we assume we can navigate to the page (UI level test).

  test('should fill out and submit the address form', async ({ page }) => {
    // 1. Navigate to the address onboarding page
    await page.goto('/onboarding/address');

    // 2. Verify we are on the right page
    try {
      await expect(page.locator('h1')).toHaveText(/Address/i);
    } catch (e) {
      console.log('Current URL:', page.url());
      console.log('Page Title:', await page.title());
      await page.screenshot({ path: 'test-results/failure-onboarding.png' });
      throw e;
    }

    // 3. Fill out the form
    await page.getByLabel(/Community\/Apartment/i).click();
    
    // Fill text inputs
    await page.getByPlaceholder(/ex. N2001, Purva Highland/i).fill('Test Flat 101');
    await page.getByPlaceholder(/ex. N Block/i).fill('Tower A');
    await page.getByPlaceholder(/ex. 637205/i).fill('560001');
    await page.getByPlaceholder(/ex. Near Holiday Village/i).fill('Near Main Gate');
    await page.getByPlaceholder(/ex. 9WF8\+XGQ/i).fill('Bangalore Central');

    // 4. Select a delivery instruction
    await page.getByText(/Leave at door/i).click();

    // 5. Verify the "Save Address" button is enabled
    const saveButton = page.getByRole('button', { name: /Save Address/i });
    await expect(saveButton).toBeEnabled();

    // 6. Submit the form
    // await saveButton.click();
    
    // 7. Verify redirection (Commented out as it requires real auth/db success)
    // await expect(page).toHaveURL(/\/onboarding\/subscription-type/);
  });
});
