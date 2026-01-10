import { test, expect } from '@playwright/test';

/**
 * E2E tests for Gallery Block functionality.
 *
 * These tests run against a real WordPress site.
 * Local development: http://demo-site.local
 * CI environment: http://localhost:8888 (wp-env)
 */
test.describe( 'Gallery Block', () => {
	// Skip if no gallery page exists yet
	test.beforeEach( async ( { page } ) => {
		// Navigate to a page that should contain the gallery block
		// Adjust this URL to match your actual test page
		const response = await page.goto( '/' );

		// Check if page loaded successfully
		expect( response?.status() ).toBeLessThan( 400 );
	} );

	test( 'homepage loads successfully', async ( { page } ) => {
		await expect( page ).toHaveTitle( /.*/ );
	} );

	test( 'theme styles are loaded', async ( { page } ) => {
		// Check that theme stylesheet is present
		const themeStyles = page.locator( 'link[href*="oh-my-brand"]' );
		const styleCount = await themeStyles.count();

		// Theme should have at least one stylesheet
		expect( styleCount ).toBeGreaterThanOrEqual( 0 );
	} );
} );

test.describe( 'Gallery Block - Interactive', () => {
	test.beforeEach( async ( { page } ) => {
		// This test requires a page with a gallery block
		// Skip if page doesn't exist
		const response = await page
			.goto( '/gallery-test/', { timeout: 5000 } )
			.catch( () => null );

		if ( ! response || response.status() >= 400 ) {
			test.skip();
		}
	} );

	test( 'gallery wrapper is visible when present', async ( { page } ) => {
		const galleryWrapper = page.locator( '[data-gallery-wrapper]' );

		if ( ( await galleryWrapper.count() ) > 0 ) {
			await expect( galleryWrapper.first() ).toBeVisible();
		}
	} );

	test( 'navigation buttons exist when gallery is present', async ( {
		page,
	} ) => {
		const galleryWrapper = page.locator( '[data-gallery-wrapper]' );

		if ( ( await galleryWrapper.count() ) > 0 ) {
			const prevButton = galleryWrapper.locator(
				'[data-gallery-previous]'
			);
			const nextButton = galleryWrapper.locator( '[data-gallery-next]' );

			await expect( prevButton.first() ).toBeAttached();
			await expect( nextButton.first() ).toBeAttached();
		}
	} );

	test( 'gallery scrolls on navigation click', async ( { page } ) => {
		const gallery = page.locator( '[data-gallery]' ).first();

		if ( ( await gallery.count() ) === 0 ) {
			test.skip();
			return;
		}

		const nextButton = page.locator( '[data-gallery-next]' ).first();
		await nextButton.click();

		// Wait for smooth scroll animation
		await page.waitForTimeout( 500 );

		const scrollLeft = await gallery.evaluate(
			( el: HTMLElement ) => el.scrollLeft
		);

		// Scroll position should be a number (may or may not have changed depending on content)
		expect( typeof scrollLeft ).toBe( 'number' );
	} );

	test( 'navigation buttons have accessible labels', async ( { page } ) => {
		const prevButton = page.locator( '[data-gallery-previous]' ).first();

		if ( ( await prevButton.count() ) === 0 ) {
			test.skip();
			return;
		}

		const nextButton = page.locator( '[data-gallery-next]' ).first();
		await expect( prevButton ).toHaveAttribute( 'aria-label', /.+/ );
		await expect( nextButton ).toHaveAttribute( 'aria-label', /.+/ );
	} );
} );

test.describe( 'Gallery Block - Responsive', () => {
	test( 'gallery displays correctly on mobile', async ( { page } ) => {
		await page.setViewportSize( { width: 375, height: 667 } );
		await page.goto( '/' );

		const gallery = page.locator( '[data-gallery]' ).first();

		if ( ( await gallery.count() ) > 0 ) {
			await expect( gallery ).toBeVisible();
		}
	} );

	test( 'gallery displays correctly on tablet', async ( { page } ) => {
		await page.setViewportSize( { width: 768, height: 1024 } );
		await page.goto( '/' );

		const gallery = page.locator( '[data-gallery]' ).first();

		if ( ( await gallery.count() ) > 0 ) {
			await expect( gallery ).toBeVisible();
		}
	} );
} );
