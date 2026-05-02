import { expect, test } from '@playwright/test'

test('renders core hero and waitlist form', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('caregiver benefits')
  await expect(page.locator('#waitlist-form')).toBeVisible()
  await expect(page.locator('#email-input')).toBeVisible()
})
