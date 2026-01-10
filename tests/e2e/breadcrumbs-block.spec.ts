/**
 * Breadcrumbs block E2E tests.
 *
 * @package
 */

import { test, expect } from '@playwright/test';

test.describe( 'Breadcrumbs Block', () => {
	test.beforeEach( async ( { page } ) => {
		const response = await page.goto( '/' );
		expect( response?.status() ).toBeLessThan( 400 );
	} );

	test( 'block is visible when present on page', async ( { page } ) => {
		// Navigate to a page that should have breadcrumbs (not front page)
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			await expect( block.first() ).toBeVisible();
		}
	} );

	test( 'has proper navigation landmark', async ( { page } ) => {
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			await expect( block.first() ).toHaveAttribute(
				'aria-label',
				'Breadcrumb'
			);
		}
	} );

	test( 'contains ordered list structure', async ( { page } ) => {
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			const list = block
				.first()
				.locator( 'ol.wp-block-theme-oh-my-brand-breadcrumbs__list' );
			await expect( list ).toBeVisible();
		}
	} );

	test( 'current page has aria-current attribute', async ( { page } ) => {
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			const currentItem = block
				.first()
				.locator( '[aria-current="page"]' );
			if ( ( await currentItem.count() ) > 0 ) {
				await expect( currentItem.first() ).toBeVisible();
			}
		}
	} );

	test( 'links are keyboard navigable', async ( { page } ) => {
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			const links = block
				.first()
				.locator( '.wp-block-theme-oh-my-brand-breadcrumbs__link' );
			if ( ( await links.count() ) > 0 ) {
				await links.first().focus();
				await expect( links.first() ).toBeFocused();
			}
		}
	} );
} );

test.describe( 'Breadcrumbs Block - Accessibility', () => {
	test( 'separators are hidden from screen readers', async ( { page } ) => {
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			const separators = block
				.first()
				.locator(
					'.wp-block-theme-oh-my-brand-breadcrumbs__separator'
				);
			if ( ( await separators.count() ) > 0 ) {
				await expect( separators.first() ).toHaveAttribute(
					'aria-hidden',
					'true'
				);
			}
		}
	} );
} );

test.describe( 'Breadcrumbs Block - Mobile Truncation', () => {
	test( 'ellipsis button expands hidden items', async ( { page } ) => {
		// Set mobile viewport
		await page.setViewportSize( { width: 375, height: 667 } );
		await page.goto( '/sample-page/' );

		const block = page.locator(
			'.wp-block-theme-oh-my-brand-breadcrumbs--truncatable'
		);
		if ( ( await block.count() ) > 0 ) {
			const ellipsisButton = block
				.first()
				.locator( '.wp-block-theme-oh-my-brand-breadcrumbs__ellipsis' );
			if ( ( await ellipsisButton.count() ) > 0 ) {
				await ellipsisButton.click();
				await expect( block.first() ).toHaveClass(
					/wp-block-theme-oh-my-brand-breadcrumbs--expanded/
				);
			}
		}
	} );
} );

test.describe( 'Breadcrumbs Block - SEO', () => {
	test( 'contains JSON-LD structured data', async ( { page } ) => {
		await page.goto( '/sample-page/' );

		const block = page.locator( '.wp-block-theme-oh-my-brand-breadcrumbs' );
		if ( ( await block.count() ) > 0 ) {
			const schemaScript = page.locator(
				'script[type="application/ld+json"]'
			);
			const schemaContent = await schemaScript.textContent();

			if ( schemaContent ) {
				const schema = JSON.parse( schemaContent );
				expect( schema[ '@type' ] ).toBe( 'BreadcrumbList' );
				expect( schema.itemListElement ).toBeDefined();
			}
		}
	} );
} );
