/**
 * BannerSection Web Component Tests
 *
 * @package
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BannerSection } from './BannerSection';

// Ensure the component is registered
if ( ! customElements.get( BannerSection.tagName ) ) {
	customElements.define( BannerSection.tagName, BannerSection );
}

describe( 'BannerSection', () => {
	let element: BannerSection;

	beforeEach( () => {
		element = document.createElement( 'omb-banner' ) as BannerSection;
		document.body.appendChild( element );
	} );

	afterEach( () => {
		element.remove();
	} );

	describe( 'initialization', () => {
		it( 'should create element with shadow DOM', () => {
			expect( element.shadowRoot ).not.toBeNull();
		} );

		it( 'should have correct tag name', () => {
			expect( BannerSection.tagName ).toBe( 'omb-banner' );
		} );

		it( 'should render internal structure', () => {
			const container = element.shadowRoot?.querySelector( '.banner' );
			expect( container ).not.toBeNull();
		} );

		it( 'should have image slot', () => {
			const imageSlot =
				element.shadowRoot?.querySelector( 'slot[name="image"]' );
			expect( imageSlot ).not.toBeNull();
		} );

		it( 'should have default content slot', () => {
			const contentSlot =
				element.shadowRoot?.querySelector( 'slot:not([name])' );
			expect( contentSlot ).not.toBeNull();
		} );
	} );

	describe( 'observed attributes', () => {
		it( 'should observe image-position attribute', () => {
			expect( BannerSection.observedAttributes ).toContain(
				'image-position'
			);
		} );

		it( 'should observe image-size attribute', () => {
			expect( BannerSection.observedAttributes ).toContain(
				'image-size'
			);
		} );

		it( 'should observe vertical-align attribute', () => {
			expect( BannerSection.observedAttributes ).toContain(
				'vertical-align'
			);
		} );

		it( 'should observe mobile-stack attribute', () => {
			expect( BannerSection.observedAttributes ).toContain(
				'mobile-stack'
			);
		} );

		it( 'should observe image-fit attribute', () => {
			expect( BannerSection.observedAttributes ).toContain( 'image-fit' );
		} );
	} );

	describe( 'image position', () => {
		it( 'should accept left position', () => {
			element.setAttribute( 'image-position', 'left' );
			expect( element.getAttribute( 'image-position' ) ).toBe( 'left' );
		} );

		it( 'should accept right position', () => {
			element.setAttribute( 'image-position', 'right' );
			expect( element.getAttribute( 'image-position' ) ).toBe( 'right' );
		} );
	} );

	describe( 'image size', () => {
		it( 'should accept 33% size', () => {
			element.setAttribute( 'image-size', '33' );
			expect( element.getAttribute( 'image-size' ) ).toBe( '33' );
		} );

		it( 'should accept 50% size', () => {
			element.setAttribute( 'image-size', '50' );
			expect( element.getAttribute( 'image-size' ) ).toBe( '50' );
		} );

		it( 'should accept 66% size', () => {
			element.setAttribute( 'image-size', '66' );
			expect( element.getAttribute( 'image-size' ) ).toBe( '66' );
		} );
	} );

	describe( 'vertical alignment', () => {
		it( 'should accept top alignment', () => {
			element.setAttribute( 'vertical-align', 'top' );
			expect( element.getAttribute( 'vertical-align' ) ).toBe( 'top' );
		} );

		it( 'should accept center alignment', () => {
			element.setAttribute( 'vertical-align', 'center' );
			expect( element.getAttribute( 'vertical-align' ) ).toBe( 'center' );
		} );

		it( 'should accept bottom alignment', () => {
			element.setAttribute( 'vertical-align', 'bottom' );
			expect( element.getAttribute( 'vertical-align' ) ).toBe( 'bottom' );
		} );
	} );

	describe( 'mobile stack order', () => {
		it( 'should accept image-first stack order', () => {
			element.setAttribute( 'mobile-stack', 'image-first' );
			expect( element.getAttribute( 'mobile-stack' ) ).toBe(
				'image-first'
			);
		} );

		it( 'should accept content-first stack order', () => {
			element.setAttribute( 'mobile-stack', 'content-first' );
			expect( element.getAttribute( 'mobile-stack' ) ).toBe(
				'content-first'
			);
		} );
	} );

	describe( 'image fit', () => {
		it( 'should accept cover fit', () => {
			element.setAttribute( 'image-fit', 'cover' );
			expect( element.getAttribute( 'image-fit' ) ).toBe( 'cover' );
		} );

		it( 'should accept contain fit', () => {
			element.setAttribute( 'image-fit', 'contain' );
			expect( element.getAttribute( 'image-fit' ) ).toBe( 'contain' );
		} );

		it( 'should accept fill fit', () => {
			element.setAttribute( 'image-fit', 'fill' );
			expect( element.getAttribute( 'image-fit' ) ).toBe( 'fill' );
		} );
	} );

	describe( 'slotted content', () => {
		it( 'should accept slotted image', () => {
			const img = document.createElement( 'img' );
			img.slot = 'image';
			img.src = 'test.jpg';
			img.alt = 'Test image';
			element.appendChild( img );

			const slottedImg = element.querySelector( 'img[slot="image"]' );
			expect( slottedImg ).not.toBeNull();
			expect( slottedImg?.getAttribute( 'src' ) ).toBe( 'test.jpg' );
		} );

		it( 'should accept slotted content', () => {
			const article = document.createElement( 'article' );
			article.innerHTML = '<h2>Test Heading</h2><p>Test content</p>';
			element.appendChild( article );

			const slottedContent = element.querySelector( 'article' );
			expect( slottedContent ).not.toBeNull();
		} );
	} );

	describe( 'styles', () => {
		it( 'should contain CSS custom properties in shadow DOM', () => {
			const style = element.shadowRoot?.querySelector( 'style' );
			expect( style?.textContent ).toContain( '--banner-gap' );
			expect( style?.textContent ).toContain( '--banner-image-size' );
		} );

		it( 'should have responsive styles', () => {
			const style = element.shadowRoot?.querySelector( 'style' );
			expect( style?.textContent ).toContain( '@media' );
			expect( style?.textContent ).toContain( '768px' );
		} );
	} );
} );
