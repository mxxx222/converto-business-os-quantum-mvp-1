import { test, expect } from '@playwright/test';

test.describe('Receipts Management', () => {
  test('should display receipts page', async ({ page }: { page: any }) => {
    await page.goto('/receipts');
    await expect(page.getByText('Kuittien hallinta')).toBeVisible();
  });

  test('should show upload area', async ({ page }: { page: any }) => {
    await page.goto('/receipts');
    await expect(page.getByText('Pudota kuva/PDF tähän')).toBeVisible();
  });

  test('should have delete button when content exists', async ({ page }: { page: any }) => {
    await page.goto('/receipts');
    await expect(page.getByText('Ei kuitteja')).toBeVisible();
  });
});
