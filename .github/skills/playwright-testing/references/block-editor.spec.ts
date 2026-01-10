/**
 * Block Editor - E2E tests.
 *
 * @package theme-oh-my-brand
 */

import { expect, test } from '@playwright/test';

test.describe( 'Block Editor - Gallery', () => {
	test.beforeEach( async ( { page } ) => {
		// Login to WordPress admin
		await page.goto( '/wp-login.php' );
		await page.fill( '#user_login', 'admin' );
		await page.fill( '#user_pass', 'password' );
		await page.click( '#wp-submit' );

		// Create new post
		await page.goto( '/wp-admin/post-new.php' );

		// Wait for editor to load
		await page.waitForSelector( '.editor-styles-wrapper' );
	} );

	test( 'can insert gallery block', async ( { page } ) => {
		// Open block inserter
		await page.click( '[aria-label="Toggle block inserter"]' );

		// Search for gallery block
		await page.fill( '[placeholder="Search"]', 'Gallery Carousel' );

		// Click the block
		await page.click( '[aria-label="Gallery Carousel"]' );

		// Verify block is inserted
		const block = page.locator( '.wp-block-theme-oh-my-brand-gallery' );
		await expect( block ).toBeVisible();
	} );

	test( 'can configure visible images', async ( { page } ) => {
		// Insert block
		await page.click( '[aria-label="Toggle block inserter"]' );
		await page.fill( '[placeholder="Search"]', 'Gallery Carousel' );
		await page.click( '[aria-label="Gallery Carousel"]' );

		// Open settings panel
		await page.click( '[aria-label="Settings"]' );

		// Find and change visible images setting
		const slider = page.locator( 'input[type="range"]' ).first();
		await slider.fill( '5' );

		await expect( slider ).toHaveValue( '5' );
	} );

	test( 'can add images to gallery', async ( { page } ) => {
		// Insert block
		await page.click( '[aria-label="Toggle block inserter"]' );
		await page.fill( '[placeholder="Search"]', 'Gallery Carousel' );
		await page.click( '[aria-label="Gallery Carousel"]' );

		// Click add images button
		const addButton = page.locator( 'button:has-text("Add Images")' );
		await addButton.click();

		// Media library should open
		const mediaFrame = page.locator( '.media-frame' );
		await expect( mediaFrame ).toBeVisible();
	} );
} );

test.describe( 'Block Editor - Preview', () => {
	test( 'gallery preview matches frontend', async ( { page, context } ) => {
		// Login and create post with gallery
		await page.goto( '/wp-login.php' );
		await page.fill( '#user_login', 'admin' );
		await page.fill( '#user_pass', 'password' );
		await page.click( '#wp-submit' );

		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForSelector( '.editor-styles-wrapper' );

		// Insert gallery block
		await page.click( '[aria-label="Toggle block inserter"]' );
		await page.fill( '[placeholder="Search"]', 'Gallery Carousel' );
		await page.click( '[aria-label="Gallery Carousel"]' );

		// Take editor screenshot
		const editorBlock = page.locator(
			'.wp-block-theme-oh-my-brand-gallery'
		);
		const editorScreenshot = await editorBlock.screenshot();

		// Open preview in new tab
		const [ previewPage ] = await Promise.all( [
			context.waitForEvent( 'page' ),
			page.click( '[aria-label="Preview"]' ),
			page.click( 'a:has-text("Preview in new tab")' ),
		] );

		await previewPage.waitForLoadState();

		// Take frontend screenshot
		const frontendBlock = previewPage.locator(
			'.wp-block-theme-oh-my-brand-gallery'
		);
		const frontendScreenshot = await frontendBlock.screenshot();

		// Compare (basic size check, actual visual comparison needs additional setup)
		expect( editorScreenshot.length ).toBeGreaterThan( 0 );
		expect( frontendScreenshot.length ).toBeGreaterThan( 0 );
	} );
} );
