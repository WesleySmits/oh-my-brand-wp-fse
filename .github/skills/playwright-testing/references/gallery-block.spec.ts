/**
 * Gallery Block - Frontend E2E tests.
 *
 * @package theme-oh-my-brand
 */

import { expect, test } from '@playwright/test';

test.describe( 'Gallery Block', () => {
	test.beforeEach( async ( { page } ) => {
		await page.goto( '/gallery-page/' );
	} );

	test( 'should display gallery carousel', async ( { page } ) => {
		const gallery = page.locator( '.wp-block-theme-oh-my-brand-gallery' );

		await expect( gallery ).toBeVisible();
	} );

	test( 'should show navigation buttons', async ( { page } ) => {
		const prevButton = page.locator( '[data-gallery-previous]' );
		const nextButton = page.locator( '[data-gallery-next]' );

		await expect( prevButton ).toBeVisible();
		await expect( nextButton ).toBeVisible();
	} );

	test( 'should navigate on button click', async ( { page } ) => {
		const nextButton = page.locator( '[data-gallery-next]' );
		const gallery = page.locator( '[data-gallery]' );

		const initialScroll = await gallery.evaluate( ( el ) => el.scrollLeft );

		await nextButton.click();
		await page.waitForTimeout( 350 ); // Wait for animation

		const newScroll = await gallery.evaluate( ( el ) => el.scrollLeft );

		expect( newScroll ).toBeGreaterThan( initialScroll );
	} );

	test( 'should disable prev button on first slide', async ( { page } ) => {
		const prevButton = page.locator( '[data-gallery-previous]' );

		await expect( prevButton ).toBeDisabled();
	} );

	test( 'should disable next button on last slide', async ( { page } ) => {
		const nextButton = page.locator( '[data-gallery-next]' );

		// Navigate to last slide
		while ( ! ( await nextButton.isDisabled() ) ) {
			await nextButton.click();
			await page.waitForTimeout( 350 );
		}

		await expect( nextButton ).toBeDisabled();
	} );
} );
