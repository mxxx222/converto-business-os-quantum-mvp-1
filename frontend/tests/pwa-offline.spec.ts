import { test, expect, Page, BrowserContext } from '@playwright/test';

test.describe('PWA Offline Functionality', () => {
  test('should work offline', async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await page.goto('/receipts');

    // Go offline
    await context.setOffline(true);

    // Should still show the page
    await expect(page.getByText('Kuittien hallinta')).toBeVisible();
  });

  test('should show offline fallback', async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.setOffline(true);
    await page.goto('/nonexistent');

    // Should show offline page
    await expect(page.getByText('Olet offline')).toBeVisible();
  });
});
