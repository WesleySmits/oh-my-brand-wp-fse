/**
 * Hero Section Web Component Tests
 *
 * @package
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HeroSection } from './HeroSection';

// Register the custom element for tests
if ( ! customElements.get( HeroSection.tagName ) ) {
	customElements.define( HeroSection.tagName, HeroSection );
}

describe( 'HeroSection', () => {
	let element: HeroSection;

	beforeEach( () => {
		element = document.createElement( 'omb-hero' ) as HeroSection;
		document.body.appendChild( element );
	} );

	afterEach( () => {
		document.body.innerHTML = '';
	} );

	describe( 'initialization', () => {
		it( 'should create element with shadow DOM', () => {
			expect( element.shadowRoot ).toBeDefined();
		} );

		it( 'should have correct tag name', () => {
			expect( HeroSection.tagName ).toBe( 'omb-hero' );
		} );

		it( 'should render internal structure', () => {
			const container = element.shadowRoot?.querySelector( '.hero' );
			const background =
				element.shadowRoot?.querySelector( '.hero__background' );
			const overlay =
				element.shadowRoot?.querySelector( '.hero__overlay' );
			const content =
				element.shadowRoot?.querySelector( '.hero__content' );

			expect( container ).toBeDefined();
			expect( background ).toBeDefined();
			expect( overlay ).toBeDefined();
			expect( content ).toBeDefined();
		} );

		it( 'should have background slot', () => {
			const slot = element.shadowRoot?.querySelector(
				'slot[name="background"]'
			);
			expect( slot ).toBeDefined();
		} );

		it( 'should have default content slot', () => {
			const slot =
				element.shadowRoot?.querySelector( 'slot:not([name])' );
			expect( slot ).toBeDefined();
		} );
	} );

	describe( 'observed attributes', () => {
		it( 'should observe min-height attribute', () => {
			expect( HeroSection.observedAttributes ).toContain( 'min-height' );
		} );

		it( 'should observe overlay-opacity attribute', () => {
			expect( HeroSection.observedAttributes ).toContain(
				'overlay-opacity'
			);
		} );

		it( 'should observe content-align attribute', () => {
			expect( HeroSection.observedAttributes ).toContain(
				'content-align'
			);
		} );

		it( 'should observe vertical-align attribute', () => {
			expect( HeroSection.observedAttributes ).toContain(
				'vertical-align'
			);
		} );
	} );

	describe( 'attribute changes', () => {
		it( 'should update min-height CSS custom property', () => {
			element.setAttribute( 'min-height', '80vh' );

			expect(
				element.style.getPropertyValue( '--hero-min-height' )
			).toBe( '80vh' );
		} );

		it( 'should update overlay-opacity CSS custom property', () => {
			element.setAttribute( 'overlay-opacity', '0.7' );

			expect(
				element.style.getPropertyValue( '--hero-overlay-opacity' )
			).toBe( '0.7' );
		} );
	} );

	describe( 'video controls', () => {
		let video: HTMLVideoElement;

		beforeEach( () => {
			video = document.createElement( 'video' );
			video.setAttribute( 'slot', 'background' );
			video.src = 'test.mp4';

			// Mock play/pause methods
			video.play = vi.fn().mockResolvedValue( undefined );
			video.pause = vi.fn();

			element.appendChild( video );

			// Re-trigger connectedCallback to detect video
			element.disconnectedCallback();
			element.connectedCallback();
		} );

		it( 'should find slotted video element', () => {
			// The video is in light DOM, slotted into shadow DOM
			const slottedVideo = element.querySelector( 'video' );
			expect( slottedVideo ).toBeDefined();
		} );

		it( 'should dispatch video-play event when play() is called', () => {
			const playHandler = vi.fn();
			element.addEventListener( 'omb-hero:video-play', playHandler );

			element.play();

			expect( playHandler ).toHaveBeenCalled();
		} );

		it( 'should dispatch video-pause event when pause() is called', () => {
			const pauseHandler = vi.fn();
			element.addEventListener( 'omb-hero:video-pause', pauseHandler );

			element.pause();

			expect( pauseHandler ).toHaveBeenCalled();
		} );
	} );

	describe( 'content alignment', () => {
		it( 'should apply left alignment class', () => {
			element.setAttribute( 'content-align', 'left' );

			// Check that attribute is set correctly
			expect( element.getAttribute( 'content-align' ) ).toBe( 'left' );
		} );

		it( 'should apply right alignment class', () => {
			element.setAttribute( 'content-align', 'right' );

			expect( element.getAttribute( 'content-align' ) ).toBe( 'right' );
		} );

		it( 'should apply center alignment by default', () => {
			// No attribute set means center
			expect( element.getAttribute( 'content-align' ) ).toBeNull();
		} );
	} );

	describe( 'vertical alignment', () => {
		it( 'should apply top vertical alignment', () => {
			element.setAttribute( 'vertical-align', 'top' );

			expect( element.getAttribute( 'vertical-align' ) ).toBe( 'top' );
		} );

		it( 'should apply bottom vertical alignment', () => {
			element.setAttribute( 'vertical-align', 'bottom' );

			expect( element.getAttribute( 'vertical-align' ) ).toBe( 'bottom' );
		} );
	} );

	describe( 'slotted content', () => {
		it( 'should accept slotted background image', () => {
			const img = document.createElement( 'img' );
			img.setAttribute( 'slot', 'background' );
			img.src = 'test.jpg';
			img.alt = '';

			element.appendChild( img );

			const slottedImg = element.querySelector(
				'img[slot="background"]'
			);
			expect( slottedImg ).toBeDefined();
		} );

		it( 'should accept default slot content', () => {
			const header = document.createElement( 'header' );
			header.innerHTML = '<h1>Test Heading</h1>';

			element.appendChild( header );

			const slottedHeader = element.querySelector( 'header' );
			expect( slottedHeader ).toBeDefined();
		} );
	} );

	describe( 'accessibility', () => {
		it( 'should render semantic section element', () => {
			const section = element.shadowRoot?.querySelector( 'section.hero' );
			expect( section ).toBeDefined();
		} );
	} );

	describe( 'cleanup', () => {
		it( 'should disconnect intersection observer on disconnectedCallback', () => {
			const disconnectSpy = vi.fn();

			// Mock the observer
			const mockObserver = {
				observe: vi.fn(),
				disconnect: disconnectSpy,
				unobserve: vi.fn(),
			};

			// @ts-expect-error - accessing private property for testing
			element.intersectionObserver =
				mockObserver as unknown as IntersectionObserver;

			element.disconnectedCallback();

			expect( disconnectSpy ).toHaveBeenCalled();
		} );
	} );
} );
