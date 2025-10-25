import { test, expect } from '@playwright/test';

test.describe('Converto smoke (FI)', () => {
  test('Hero näkyy ja hyödyt renderöityvät', async ({ page }) => {
    await page.goto('/fi/');
    await expect(page.getByRole('heading', { name: /poista toistotyö/i })).toBeVisible();
    await expect(page.locator('ul >> li')).toHaveCount(3);
  });

  test('Scroll → "Näin se toimii"', async ({ page }) => {
    await page.goto('/fi/');
    await page.locator('[data-event="cta_how_it_works_click"]').click();
    await expect(page.getByText(/Kytke sähköposti/i)).toBeVisible();
  });

  test('Lead-lomake läpi (mock-polku)', async ({ page }) => {
    await page.goto('/fi/');
    await page.locator('[data-event="cta_demo_click"][data-payload*="hero"]').click();
    await expect(page.getByRole('heading', { name: /Valmis tuotantoon/i })).toBeVisible();
    await page.getByPlaceholder('Sähköposti').fill('e2e@example.com');
    await page.getByPlaceholder('Nimi').fill('E2E Testaaja');
    await page.getByPlaceholder(/Kerro lyhyesti/i).fill('Smoke-testi');
    await page.locator('button[data-event="cta_book_demo_click"]').click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /Valmis tuotantoon/i })).toBeVisible();
    await expect(page.locator('button[data-event="cta_book_demo_click"]')).toBeVisible();
  });
});

test.describe('Pricing CTA toimii', () => {
  test('Klikki kirjaa tapahtuman ja näyttää kortit', async ({ page }) => {
    await page.goto('/fi/pricing');
    await expect(page.getByRole('heading', { name: /Hinnoittelu/i })).toBeVisible();
    await expect(page.getByText(/Ilmainen pilotti/i)).toBeVisible();
    await page.locator('[data-event="cta_pricing_click"]').first().click();
    await expect(page).not.toHaveURL(/404|500/);
  });
});
