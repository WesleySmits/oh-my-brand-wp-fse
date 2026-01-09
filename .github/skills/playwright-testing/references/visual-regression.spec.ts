/**
 * Visual Regression - Screenshot tests.
 *
 * @package theme-oh-my-brand
 */

import { expect, test } from '@playwright/test';

test.describe('Visual Regression', () => {
	test('gallery block matches snapshot', async ({ page }) => {
		await page.goto('/gallery-page/');

		const gallery = page.locator('.wp-block-theme-oh-my-brand-gallery');

		await expect(gallery).toHaveScreenshot('gallery-default.png');
	});

	test('gallery navigation state matches snapshot', async ({ page }) => {
		await page.goto('/gallery-page/');

		// Navigate to second slide
		const nextButton = page.locator('[data-gallery-next]');
		await nextButton.click();
		await page.waitForTimeout(350);

		const gallery = page.locator('.wp-block-theme-oh-my-brand-gallery');

		await expect(gallery).toHaveScreenshot('gallery-second-slide.png');
	});

	test('FAQ expanded state matches snapshot', async ({ page }) => {
		await page.goto('/faq-page/');

		// Expand first item
		const details = page.locator('details').first();
		await details.locator('summary').click();

		const faq = page.locator('.wp-block-acf-faq');

		await expect(faq).toHaveScreenshot('faq-expanded.png');
	});
});

test.describe('Responsive Design', () => {
	test('gallery mobile layout', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/gallery-page/');

		const gallery = page.locator('.wp-block-theme-oh-my-brand-gallery');

		await expect(gallery).toHaveScreenshot('gallery-mobile.png');
	});

	test('gallery tablet layout', async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto('/gallery-page/');

		const gallery = page.locator('.wp-block-theme-oh-my-brand-gallery');

		await expect(gallery).toHaveScreenshot('gallery-tablet.png');
	});

	test('gallery desktop layout', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/gallery-page/');

		const gallery = page.locator('.wp-block-theme-oh-my-brand-gallery');

		await expect(gallery).toHaveScreenshot('gallery-desktop.png');
	});
});
