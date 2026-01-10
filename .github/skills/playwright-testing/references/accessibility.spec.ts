/**
 * Accessibility - E2E tests with Axe.
 *
 * @package theme-oh-my-brand
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe( 'Accessibility', () => {
	test( 'gallery block should have no violations', async ( { page } ) => {
		await page.goto( '/gallery-page/' );

		const results = await new AxeBuilder( { page } )
			.include( '.wp-block-theme-oh-my-brand-gallery' )
			.analyze();

		expect( results.violations ).toEqual( [] );
	} );

	test( 'FAQ block should have no violations', async ( { page } ) => {
		await page.goto( '/faq-page/' );

		const results = await new AxeBuilder( { page } )
			.include( '.wp-block-acf-faq' )
			.analyze();

		expect( results.violations ).toEqual( [] );
	} );

	test( 'hero block should have no violations', async ( { page } ) => {
		await page.goto( '/' );

		const results = await new AxeBuilder( { page } )
			.include( '.wp-block-theme-oh-my-brand-hero' )
			.analyze();

		expect( results.violations ).toEqual( [] );
	} );

	test( 'entire page should have no critical violations', async ( {
		page,
	} ) => {
		await page.goto( '/' );

		const results = await new AxeBuilder( { page } )
			.withTags( [ 'wcag2a', 'wcag2aa', 'wcag21aa' ] )
			.analyze();

		const criticalViolations = results.violations.filter(
			( v ) => v.impact === 'critical' || v.impact === 'serious'
		);

		expect( criticalViolations ).toEqual( [] );
	} );
} );
