/**
 * Logo Grid Block E2E Tests
 *
 * @package
 */

import { test, expect } from '@playwright/test';

test.describe('Logo Grid Block', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to a page with the logo grid block
		// This assumes a test page exists with the block
		await page.goto('/logo-grid-test/');
	});

	test('should display logo grid section', async ({ page }) => {
		const logoGrid = page.locator('.wp-block-theme-oh-my-brand-logo-grid');

		await expect(logoGrid).toBeVisible();
	});

	test('should display heading when provided', async ({ page }) => {
		const heading = page.locator('.wp-block-theme-oh-my-brand-logo-grid__heading');

		// Check if heading exists (it's optional)
		const headingCount = await heading.count();
		if (headingCount > 0) {
			await expect(heading).toBeVisible();
		}
	});

	test('should display logo list', async ({ page }) => {
		const logoList = page.locator('.wp-block-theme-oh-my-brand-logo-grid__list');

		await expect(logoList).toBeVisible();
		await expect(logoList).toHaveAttribute('role', 'list');
	});

	test('should display logo items', async ({ page }) => {
		const logoItems = page.locator('.wp-block-theme-oh-my-brand-logo-grid__item');

		// Should have at least one logo item
		await expect(logoItems.first()).toBeVisible();
	});

	test('should apply grayscale filter when enabled', async ({ page }) => {
		const logoImage = page.locator('.wp-block-theme-oh-my-brand-logo-grid__image').first();

		// Check computed style includes grayscale
		const filter = await logoImage.evaluate((el) => getComputedStyle(el).filter);

		// Filter should contain grayscale
		expect(filter).toMatch(/grayscale/);
	});

	test('should show color on hover when enabled', async ({ page }) => {
		const logoGrid = page.locator('.wp-block-theme-oh-my-brand-logo-grid');
		const hasColorOnHover = await logoGrid.evaluate((el) =>
			el.classList.contains('wp-block-theme-oh-my-brand-logo-grid--color-on-hover')
		);

		if (hasColorOnHover) {
			const logoItem = page.locator('.wp-block-theme-oh-my-brand-logo-grid__item').first();
			const logoImage = logoItem.locator('.wp-block-theme-oh-my-brand-logo-grid__image');

			// Get initial filter
			const initialFilter = await logoImage.evaluate((el) => getComputedStyle(el).filter);

			// Hover over the item
			await logoItem.hover();

			// Wait for transition
			await page.waitForTimeout(350);

			// Get hovered filter
			const hoveredFilter = await logoImage.evaluate((el) => getComputedStyle(el).filter);

			// Filter should change on hover
			expect(hoveredFilter).not.toBe(initialFilter);
		}
	});

	test('should have accessible links with proper attributes', async ({ page }) => {
		const logoLinks = page.locator('.wp-block-theme-oh-my-brand-logo-grid__link');
		const linkCount = await logoLinks.count();

		if (linkCount > 0) {
			const firstLink = logoLinks.first();

			// Should open in new tab with security attributes
			await expect(firstLink).toHaveAttribute('target', '_blank');
			await expect(firstLink).toHaveAttribute('rel', /noopener/);
			await expect(firstLink).toHaveAttribute('rel', /noreferrer/);
		}
	});

	test('should have images with alt text', async ({ page }) => {
		const logoImages = page.locator('.wp-block-theme-oh-my-brand-logo-grid__image');
		const imageCount = await logoImages.count();

		for (let i = 0; i < imageCount; i++) {
			const image = logoImages.nth(i);
			// Alt attribute should exist (even if empty for decorative images)
			await expect(image).toHaveAttribute('alt');
		}
	});

	test('should have lazy loading on images', async ({ page }) => {
		const logoImages = page.locator('.wp-block-theme-oh-my-brand-logo-grid__image');

		const firstImage = logoImages.first();
		await expect(firstImage).toHaveAttribute('loading', 'lazy');
	});

	test('should be keyboard navigable', async ({ page }) => {
		const logoLinks = page.locator('.wp-block-theme-oh-my-brand-logo-grid__link');
		const linkCount = await logoLinks.count();

		if (linkCount > 0) {
			// Tab to first link
			await page.keyboard.press('Tab');

			// Focus should be on a link
			const focusedElement = page.locator(':focus');
			const isFocusedOnLink = await focusedElement.evaluate((el) =>
				el.classList.contains('wp-block-theme-oh-my-brand-logo-grid__link')
			);

			expect(isFocusedOnLink).toBe(true);

			// Should have visible focus indicator
			await expect(focusedElement).toBeVisible();
		}
	});

	test('should respect CSS custom properties for columns', async ({ page }) => {
		const logoGrid = page.locator('.wp-block-theme-oh-my-brand-logo-grid');

		// Get CSS custom property values
		const columns = await logoGrid.evaluate((el) => getComputedStyle(el).getPropertyValue('--logo-grid-columns'));

		// Should have a valid column value
		const columnValue = parseInt(columns.trim(), 10);
		expect(columnValue).toBeGreaterThanOrEqual(2);
		expect(columnValue).toBeLessThanOrEqual(6);
	});
});

test.describe('Logo Grid Block Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/logo-grid-test/');
	});

	test('should have semantic list structure', async ({ page }) => {
		const list = page.locator('.wp-block-theme-oh-my-brand-logo-grid__list');

		// Should be a ul element
		const tagName = await list.evaluate((el) => el.tagName.toLowerCase());
		expect(tagName).toBe('ul');

		// Items should be li elements
		const items = page.locator('.wp-block-theme-oh-my-brand-logo-grid__item');
		const firstItemTag = await items.first().evaluate((el) => el.tagName.toLowerCase());
		expect(firstItemTag).toBe('li');
	});

	test('should have proper heading hierarchy', async ({ page }) => {
		const heading = page.locator('.wp-block-theme-oh-my-brand-logo-grid__heading');
		const headingCount = await heading.count();

		if (headingCount > 0) {
			const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());

			// Should be h2, h3, or h4
			expect(['h2', 'h3', 'h4']).toContain(tagName);
		}
	});
});

test.describe('Logo Grid Block Responsive', () => {
	test('should display correct columns on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/logo-grid-test/');

		const logoList = page.locator('.wp-block-theme-oh-my-brand-logo-grid__list');

		// Check grid-template-columns uses mobile variable
		const gridColumns = await logoList.evaluate((el) => getComputedStyle(el).gridTemplateColumns);

		// Should have 2 columns by default on mobile (each around 50% width)
		const columnCount = gridColumns.split(' ').length;
		expect(columnCount).toBeLessThanOrEqual(3);
	});

	test('should display correct columns on desktop', async ({ page }) => {
		// Set desktop viewport
		await page.setViewportSize({ width: 1200, height: 800 });
		await page.goto('/logo-grid-test/');

		const logoList = page.locator('.wp-block-theme-oh-my-brand-logo-grid__list');

		// Check grid-template-columns
		const gridColumns = await logoList.evaluate((el) => getComputedStyle(el).gridTemplateColumns);

		// Should have more columns on desktop
		const columnCount = gridColumns.split(' ').length;
		expect(columnCount).toBeGreaterThanOrEqual(2);
	});
});
