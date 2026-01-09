/**
 * FAQ Block - E2E tests.
 *
 * @package theme-oh-my-brand
 */

import { expect, test } from '@playwright/test';

test.describe('FAQ Block', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/faq-page/');
	});

	test('should display FAQ accordion', async ({ page }) => {
		const faq = page.locator('.wp-block-acf-faq');

		await expect(faq).toBeVisible();
	});

	test('should expand FAQ item on click', async ({ page }) => {
		const details = page.locator('details').first();
		const summary = details.locator('summary');

		// Initially closed
		await expect(details).not.toHaveAttribute('open');

		// Click to open
		await summary.click();

		await expect(details).toHaveAttribute('open');
	});

	test('should only allow one item open at a time', async ({ page }) => {
		const allDetails = page.locator('details');
		const first = allDetails.nth(0);
		const second = allDetails.nth(1);

		// Open first
		await first.locator('summary').click();
		await expect(first).toHaveAttribute('open');

		// Open second (using name attribute for exclusive behavior)
		await second.locator('summary').click();
		await expect(second).toHaveAttribute('open');

		// First should be closed (if using name attribute)
		await expect(first).not.toHaveAttribute('open');
	});
});
