/**
 * Keyboard Navigation - E2E tests.
 *
 * @package theme-oh-my-brand
 */

import { expect, test } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/gallery-page/');
	});

	test('should support keyboard navigation', async ({ page }) => {
		const gallery = page.locator('omb-gallery-carousel');
		const prevButton = page.locator('[data-gallery-previous]');

		// Focus the gallery
		await gallery.focus();

		// Press right arrow to navigate
		await page.keyboard.press('ArrowRight');

		// Prev should now be enabled
		await expect(prevButton).not.toBeDisabled();
	});

	test('should handle ArrowLeft key', async ({ page }) => {
		const gallery = page.locator('omb-gallery-carousel');
		const nextButton = page.locator('[data-gallery-next]');

		// First navigate forward
		await nextButton.click();
		await page.waitForTimeout(350);

		// Focus and press left
		await gallery.focus();
		await page.keyboard.press('ArrowLeft');

		// Should be back at start
		const prevButton = page.locator('[data-gallery-previous]');
		await expect(prevButton).toBeDisabled();
	});

	test('should handle Escape key in lightbox', async ({ page }) => {
		// Open lightbox
		const image = page.locator('[data-gallery-item]').first();
		await image.click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		await expect(dialog).not.toBeVisible();
	});
});
