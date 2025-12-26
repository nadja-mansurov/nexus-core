import { test, expect } from '@playwright/test';

test.describe('Shell App', () => {
  test('should display the "Nexus-Core Shell" heading on the home page', async ({ page }) => {
    // 1. Navigate to the root route
    await page.goto('/');

    // 2. Locate the heading and check visibility/text
    // 'getByRole' is the recommended way to find elements for accessibility
    const heading = page.getByRole('heading', { name: /Nexus-Core Shell/i });
    
    await expect(heading).toBeVisible();
  });
});