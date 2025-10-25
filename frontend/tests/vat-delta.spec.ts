import { test, expect, Page } from '@playwright/test';

test.describe('VAT Summary', () => {
  test('should display VAT liability', async ({ page }: { page: Page }) => {
    await page.goto('/receipts');
    await expect(page.getByText('ALV-velka')).toBeVisible();
  });

  test('should show VAT preview with delta', async ({ page }: { page: Page }) => {
    await page.goto('/receipts');
    await expect(page.getByText('ALV-ennakko')).toBeVisible();
  });

  test('should display mismatch detection', async ({ page }: { page: Page }) => {
    await page.goto('/receipts');
    await expect(page.getByText('Siirtymävirheet')).toBeVisible();
  });
});
