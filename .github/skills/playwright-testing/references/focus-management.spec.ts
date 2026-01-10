/**
 * Focus Management - E2E tests.
 *
 * @package theme-oh-my-brand
 */

import { expect, test } from '@playwright/test';

test.describe( 'Focus Management', () => {
	test( 'navigation buttons should have accessible labels', async ( {
		page,
	} ) => {
		await page.goto( '/gallery-page/' );

		const prevButton = page.locator( '[data-gallery-previous]' );
		const nextButton = page.locator( '[data-gallery-next]' );

		await expect( prevButton ).toHaveAttribute( 'aria-label' );
		await expect( nextButton ).toHaveAttribute( 'aria-label' );
	} );

	test( 'live region should announce changes', async ( { page } ) => {
		await page.goto( '/gallery-page/' );

		const liveRegion = page.locator( '[aria-live="polite"]' );
		await expect( liveRegion ).toBeAttached();

		// Navigate and check announcement
		const nextButton = page.locator( '[data-gallery-next]' );
		await nextButton.click();

		// Live region should have content
		const text = await liveRegion.textContent();
		expect( text ).toBeTruthy();
	} );

	test( 'should be keyboard navigable', async ( { page } ) => {
		await page.goto( '/gallery-page/' );

		// Tab to first interactive element
		await page.keyboard.press( 'Tab' );

		const focused = page.locator( ':focus' );
		await expect( focused ).toBeVisible();
	} );

	test( 'dialog should trap focus', async ( { page } ) => {
		await page.goto( '/gallery-page/' );

		// Open lightbox
		const image = page.locator( '[data-gallery-item]' ).first();
		await image.click();

		const dialog = page.locator( 'dialog' );
		await expect( dialog ).toBeVisible();

		// Tab through elements - focus should stay in dialog
		for ( let i = 0; i < 10; i++ ) {
			await page.keyboard.press( 'Tab' );
			const focused = page.locator( ':focus' );
			await expect( focused ).toBeVisible();

			// Verify focus is within dialog
			const isInDialog = await focused.evaluate(
				( el, dialogEl ) => {
					return dialogEl?.contains( el );
				},
				await dialog.elementHandle()
			);

			expect( isInDialog ).toBe( true );
		}
	} );
} );
