/**
 * Logo Grid Block Tests
 *
 * @package
 */

import { describe, it, expect } from 'vitest';

/**
 * Logo image interface.
 */
interface LogoImage {
	id: number;
	url: string;
	alt: string;
	link?: string;
}

/**
 * Block attributes interface.
 */
interface LogoGridAttributes {
	heading: string;
	headingLevel: string;
	images: LogoImage[];
	columns: number;
	columnsMobile: number;
	grayscale: boolean;
	colorOnHover: boolean;
	logoMaxHeight: number;
}

/**
 * Get default attributes.
 */
function getDefaultAttributes(): LogoGridAttributes {
	return {
		heading: '',
		headingLevel: 'h2',
		images: [],
		columns: 4,
		columnsMobile: 2,
		grayscale: true,
		colorOnHover: true,
		logoMaxHeight: 80,
	};
}

/**
 * Generate CSS custom properties from attributes.
 * @param attributes
 */
function getCSSCustomProperties(
	attributes: LogoGridAttributes
): Record< string, string > {
	return {
		'--logo-grid-columns': String( attributes.columns ),
		'--logo-grid-columns-mobile': String( attributes.columnsMobile ),
		'--logo-grid-logo-height': `${ attributes.logoMaxHeight }px`,
		'--logo-grid-grayscale': attributes.grayscale ? '1' : '0',
	};
}

/**
 * Generate class names from attributes.
 * @param attributes
 */
function getClassNames( attributes: LogoGridAttributes ): string[] {
	const classes = [ 'wp-block-theme-oh-my-brand-logo-grid' ];

	if ( attributes.grayscale && attributes.colorOnHover ) {
		classes.push( 'wp-block-theme-oh-my-brand-logo-grid--color-on-hover' );
	}

	return classes;
}

describe( 'Logo Grid Block', () => {
	describe( 'Default Attributes', () => {
		it( 'should have correct default values', () => {
			const defaults = getDefaultAttributes();

			expect( defaults.heading ).toBe( '' );
			expect( defaults.headingLevel ).toBe( 'h2' );
			expect( defaults.images ).toEqual( [] );
			expect( defaults.columns ).toBe( 4 );
			expect( defaults.columnsMobile ).toBe( 2 );
			expect( defaults.grayscale ).toBe( true );
			expect( defaults.colorOnHover ).toBe( true );
			expect( defaults.logoMaxHeight ).toBe( 80 );
		} );
	} );

	describe( 'CSS Custom Properties', () => {
		it( 'should generate correct custom properties with defaults', () => {
			const attributes = getDefaultAttributes();
			const props = getCSSCustomProperties( attributes );

			expect( props[ '--logo-grid-columns' ] ).toBe( '4' );
			expect( props[ '--logo-grid-columns-mobile' ] ).toBe( '2' );
			expect( props[ '--logo-grid-logo-height' ] ).toBe( '80px' );
			expect( props[ '--logo-grid-grayscale' ] ).toBe( '1' );
		} );

		it( 'should generate correct custom properties with custom values', () => {
			const attributes: LogoGridAttributes = {
				...getDefaultAttributes(),
				columns: 6,
				columnsMobile: 3,
				logoMaxHeight: 120,
				grayscale: false,
			};
			const props = getCSSCustomProperties( attributes );

			expect( props[ '--logo-grid-columns' ] ).toBe( '6' );
			expect( props[ '--logo-grid-columns-mobile' ] ).toBe( '3' );
			expect( props[ '--logo-grid-logo-height' ] ).toBe( '120px' );
			expect( props[ '--logo-grid-grayscale' ] ).toBe( '0' );
		} );
	} );

	describe( 'Class Names', () => {
		it( 'should include base class', () => {
			const attributes = getDefaultAttributes();
			const classes = getClassNames( attributes );

			expect( classes ).toContain(
				'wp-block-theme-oh-my-brand-logo-grid'
			);
		} );

		it( 'should include color-on-hover modifier when both grayscale and colorOnHover are true', () => {
			const attributes: LogoGridAttributes = {
				...getDefaultAttributes(),
				grayscale: true,
				colorOnHover: true,
			};
			const classes = getClassNames( attributes );

			expect( classes ).toContain(
				'wp-block-theme-oh-my-brand-logo-grid--color-on-hover'
			);
		} );

		it( 'should not include color-on-hover modifier when grayscale is false', () => {
			const attributes: LogoGridAttributes = {
				...getDefaultAttributes(),
				grayscale: false,
				colorOnHover: true,
			};
			const classes = getClassNames( attributes );

			expect( classes ).not.toContain(
				'wp-block-theme-oh-my-brand-logo-grid--color-on-hover'
			);
		} );

		it( 'should not include color-on-hover modifier when colorOnHover is false', () => {
			const attributes: LogoGridAttributes = {
				...getDefaultAttributes(),
				grayscale: true,
				colorOnHover: false,
			};
			const classes = getClassNames( attributes );

			expect( classes ).not.toContain(
				'wp-block-theme-oh-my-brand-logo-grid--color-on-hover'
			);
		} );
	} );

	describe( 'Image Data', () => {
		it( 'should validate image structure', () => {
			const image: LogoImage = {
				id: 1,
				url: 'https://example.com/logo.png',
				alt: 'Company Logo',
				link: 'https://company.com',
			};

			expect( image.id ).toBe( 1 );
			expect( image.url ).toBe( 'https://example.com/logo.png' );
			expect( image.alt ).toBe( 'Company Logo' );
			expect( image.link ).toBe( 'https://company.com' );
		} );

		it( 'should allow optional link property', () => {
			const image: LogoImage = {
				id: 2,
				url: 'https://example.com/logo2.png',
				alt: 'Another Logo',
			};

			expect( image.link ).toBeUndefined();
		} );
	} );

	describe( 'Heading Level', () => {
		it( 'should allow h2, h3, h4 heading levels', () => {
			const allowedLevels = [ 'h2', 'h3', 'h4' ];

			allowedLevels.forEach( ( level ) => {
				const attributes: LogoGridAttributes = {
					...getDefaultAttributes(),
					headingLevel: level,
				};

				expect( attributes.headingLevel ).toBe( level );
			} );
		} );
	} );

	describe( 'Column Range', () => {
		it( 'should support 2-6 desktop columns', () => {
			[ 2, 3, 4, 5, 6 ].forEach( ( columns ) => {
				const attributes: LogoGridAttributes = {
					...getDefaultAttributes(),
					columns,
				};
				const props = getCSSCustomProperties( attributes );

				expect( props[ '--logo-grid-columns' ] ).toBe(
					String( columns )
				);
			} );
		} );

		it( 'should support 1-3 mobile columns', () => {
			[ 1, 2, 3 ].forEach( ( columnsMobile ) => {
				const attributes: LogoGridAttributes = {
					...getDefaultAttributes(),
					columnsMobile,
				};
				const props = getCSSCustomProperties( attributes );

				expect( props[ '--logo-grid-columns-mobile' ] ).toBe(
					String( columnsMobile )
				);
			} );
		} );
	} );
} );
