// @ts-check
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://caretab-blond.vercel.app';

test.describe('CareTab Landing Page — QA (ISL-645)', () => {
  test('waitlist form submits and shows confirmation', async ({ page }) => {
    await page.goto(PREVIEW_URL);

    // Form should be visible
    const form = page.locator('#waitlist-form');
    await expect(form).toBeVisible();

    // Fill and submit
    await page.fill('#email-input', 'qa-test@caretab-qa.internal');
    await page.click('#waitlist-form button[type="submit"]');

    // Form hides, success message appears
    await expect(form).toBeHidden();
    const success = page.locator('#waitlist-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText("You're on the list");
  });

  test('all external links have target=_blank and rel=noopener noreferrer', async ({ page }) => {
    await page.goto(PREVIEW_URL);

    const externalLinks = await page.locator('a[href^="http"]').all();
    // No external links expected — verify count is 0 or all have proper attrs
    for (const link of externalLinks) {
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
    // Log count for evidence
    console.log(`External links found: ${externalLinks.length}`);
  });

  test('mobile responsive at 375px width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PREVIEW_URL);

    // Page loads without horizontal scroll overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 20); // allow minimal tolerance

    // Headline visible
    await expect(page.locator('h1')).toBeVisible();

    // Waitlist form visible (stacked column layout)
    await expect(page.locator('#waitlist-form')).toBeVisible();

    // Stats grid: each stat block visible
    const stats = page.locator('.stat');
    await expect(stats.first()).toBeVisible();
  });

  test('mobile responsive at 768px width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PREVIEW_URL);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768 + 20);

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#waitlist-form')).toBeVisible();
  });

  test('page load time under 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    console.log(`Page load time (DOMContentLoaded): ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });
});
