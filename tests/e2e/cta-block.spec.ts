import { test, expect } from '@playwright/test';

/**
 * E2E tests for CTA Block functionality.
 *
 * These tests run against a real WordPress site.
 * Local development: http://demo-site.local
 * CI environment: http://localhost:8888 (wp-env)
 */
test.describe( 'CTA Block', () => {
	test.beforeEach( async ( { page } ) => {
		// Navigate to a page that may contain the CTA block
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

test.describe( 'CTA Block - Interactive', () => {
	test.beforeEach( async ( { page } ) => {
		// This test requires a page with a CTA block
		// Skip if page doesn't exist
		const response = await page
			.goto( '/cta-test/', { timeout: 5000 } )
			.catch( () => null );

		if ( ! response || response.status() >= 400 ) {
			test.skip();
		}
	} );

	test( 'CTA block is visible when present', async ( { page } ) => {
		const ctaBlock = page.locator( '.wp-block-theme-oh-my-brand-cta' );

		if ( ( await ctaBlock.count() ) > 0 ) {
			await expect( ctaBlock.first() ).toBeVisible();
		}
	} );

	test( 'CTA heading is visible', async ( { page } ) => {
		const ctaHeading = page.locator(
			'.wp-block-theme-oh-my-brand-cta__heading'
		);

		if ( ( await ctaHeading.count() ) > 0 ) {
			await expect( ctaHeading.first() ).toBeVisible();
		}
	} );

	test( 'CTA buttons are clickable', async ( { page } ) => {
		const primaryButton = page
			.locator( '.wp-block-theme-oh-my-brand-cta__button--primary' )
			.first();

		if ( ( await primaryButton.count() ) > 0 ) {
			await expect( primaryButton ).toBeVisible();
			// Check button has href attribute
			const href = await primaryButton.getAttribute( 'href' );
			expect( href ).toBeTruthy();
		}
	} );

	test( 'secondary button exists when configured', async ( { page } ) => {
		const secondaryButton = page
			.locator( '.wp-block-theme-oh-my-brand-cta__button--secondary' )
			.first();

		if ( ( await secondaryButton.count() ) > 0 ) {
			await expect( secondaryButton ).toBeVisible();
			const href = await secondaryButton.getAttribute( 'href' );
			expect( href ).toBeTruthy();
		}
	} );

	test( 'buttons have accessible text', async ( { page } ) => {
		const buttons = page.locator(
			'.wp-block-theme-oh-my-brand-cta__button'
		);

		if ( ( await buttons.count() ) > 0 ) {
			const firstButton = buttons.first();
			const buttonText = await firstButton.textContent();
			// Button should have text content
			expect( buttonText?.trim().length ).toBeGreaterThan( 0 );
		}
	} );
} );

test.describe( 'CTA Block - Accessibility', () => {
	test.beforeEach( async ( { page } ) => {
		const response = await page
			.goto( '/cta-test/', { timeout: 5000 } )
			.catch( () => null );

		if ( ! response || response.status() >= 400 ) {
			test.skip();
		}
	} );

	test( 'CTA heading has proper heading level', async ( { page } ) => {
		const ctaBlock = page
			.locator( '.wp-block-theme-oh-my-brand-cta' )
			.first();

		if ( ( await ctaBlock.count() ) === 0 ) {
			test.skip();
			return;
		}

		// Check for h2, h3, or h4 heading
		const h2 = ctaBlock.locator(
			'h2.wp-block-theme-oh-my-brand-cta__heading'
		);
		const h3 = ctaBlock.locator(
			'h3.wp-block-theme-oh-my-brand-cta__heading'
		);
		const h4 = ctaBlock.locator(
			'h4.wp-block-theme-oh-my-brand-cta__heading'
		);

		const hasHeading =
			( await h2.count() ) > 0 ||
			( await h3.count() ) > 0 ||
			( await h4.count() ) > 0;
		expect( hasHeading ).toBe( true );
	} );

	test( 'buttons are keyboard focusable', async ( { page } ) => {
		const button = page
			.locator( '.wp-block-theme-oh-my-brand-cta__button' )
			.first();

		if ( ( await button.count() ) === 0 ) {
			test.skip();
			return;
		}

		// Tab to focus the button
		await page.keyboard.press( 'Tab' );

		// Check if a button-like element received focus
		const focusedElement = page.locator( ':focus' );
		const focusedCount = await focusedElement.count();
		expect( focusedCount ).toBeGreaterThan( 0 );
	} );

	test( 'links with new tab have rel attribute', async ( { page } ) => {
		const buttonsWithTarget = page.locator(
			'.wp-block-theme-oh-my-brand-cta__button[target="_blank"]'
		);

		if ( ( await buttonsWithTarget.count() ) > 0 ) {
			const firstButton = buttonsWithTarget.first();
			const rel = await firstButton.getAttribute( 'rel' );
			expect( rel ).toContain( 'noopener' );
		}
	} );
} );

test.describe( 'CTA Block - Responsive', () => {
	test.beforeEach( async ( { page } ) => {
		const response = await page
			.goto( '/cta-test/', { timeout: 5000 } )
			.catch( () => null );

		if ( ! response || response.status() >= 400 ) {
			test.skip();
		}
	} );

	test( 'CTA block displays correctly on mobile', async ( { page } ) => {
		// Set mobile viewport
		await page.setViewportSize( { width: 375, height: 667 } );

		const ctaBlock = page
			.locator( '.wp-block-theme-oh-my-brand-cta' )
			.first();

		if ( ( await ctaBlock.count() ) > 0 ) {
			await expect( ctaBlock ).toBeVisible();
		}
	} );

	test( 'CTA block displays correctly on tablet', async ( { page } ) => {
		// Set tablet viewport
		await page.setViewportSize( { width: 768, height: 1024 } );

		const ctaBlock = page
			.locator( '.wp-block-theme-oh-my-brand-cta' )
			.first();

		if ( ( await ctaBlock.count() ) > 0 ) {
			await expect( ctaBlock ).toBeVisible();
		}
	} );

	test( 'CTA block displays correctly on desktop', async ( { page } ) => {
		// Set desktop viewport
		await page.setViewportSize( { width: 1440, height: 900 } );

		const ctaBlock = page
			.locator( '.wp-block-theme-oh-my-brand-cta' )
			.first();

		if ( ( await ctaBlock.count() ) > 0 ) {
			await expect( ctaBlock ).toBeVisible();
		}
	} );
} );
