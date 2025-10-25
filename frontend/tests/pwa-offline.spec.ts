import { test, expect } from "@playwright/test";

test.describe("PWA offline handling", () => {
  test("serves offline fallback when the network is unavailable", async ({ browser }: { browser: any }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/fi/", { waitUntil: "networkidle" });

    await page.waitForFunction(async () => {
      if (!("serviceWorker" in navigator)) {
        return true;
      }
      await navigator.serviceWorker.ready;
      return true;
    });

    await context.setOffline(true);

    await page.goto("/offline-check", { waitUntil: "domcontentloaded" }).catch(() => undefined);

    await expect(page.getByText(/Olet offline-tilassa/i)).toBeVisible();

    await context.setOffline(false);
    await context.close();
  });
});

test.describe("PWA background sync", () => {
  test("background sync tag registration resolves", async ({ page }: { page: any }) => {
    await page.goto("/fi/", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) {
        return { supported: false, registered: false };
      }
      const registration = await navigator.serviceWorker.ready;
      const hasSync = "sync" in registration;
      if (!hasSync) {
        return { supported: false, registered: false };
      }
      try {
        // @ts-expect-error experimental background sync typing
        await registration.sync.register("api-post-sync");
        return { supported: true, registered: true };
      } catch (error) {
        console.debug("Background sync registration failed", error);
        return { supported: true, registered: false };
      }
    });

    if (result.supported) {
      expect(result.registered).toBeTruthy();
    } else {
      expect.soft(result.supported).toBeFalsy();
    }
  });
});
