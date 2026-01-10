/**
 * Unit tests for OmbYouTubeFacade web component.
 *
 * @package
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OmbYouTubeFacade } from './view';

describe( 'OmbYouTubeFacade', () => {
	let element: OmbYouTubeFacade;

	/**
	 * Helper to create a facade element with attributes.
	 * @param embedUrl
	 * @param videoTitle
	 */
	function createFacadeElement(
		embedUrl: string = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
		videoTitle: string = 'Test Video'
	): OmbYouTubeFacade {
		const facade = document.createElement(
			'omb-youtube-facade'
		) as OmbYouTubeFacade;

		if ( embedUrl ) {
			facade.setAttribute( 'embed-url', embedUrl );
		}

		if ( videoTitle ) {
			facade.setAttribute( 'video-title', videoTitle );
		}

		// Add inner content (thumbnail and play button)
		facade.innerHTML = `
			<img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Video thumbnail">
			<button class="play-button" aria-label="Play video">Play</button>
		`;

		return facade;
	}

	/**
	 * Helper to create facade with parent wrapper.
	 * @param embedUrl
	 * @param videoTitle
	 */
	function createFacadeWithWrapper(
		embedUrl: string = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
		videoTitle: string = 'Test Video'
	): { wrapper: HTMLDivElement; facade: OmbYouTubeFacade } {
		const wrapper = document.createElement( 'div' );
		wrapper.className = 'wp-block-theme-oh-my-brand-youtube';

		const facade = createFacadeElement( embedUrl, videoTitle );
		wrapper.appendChild( facade );

		return { wrapper, facade };
	}

	beforeEach( () => {
		document.body.innerHTML = '';
	} );

	afterEach( () => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	} );

	describe( 'connectedCallback', () => {
		it( 'should initialize with valid embed-url attribute', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			expect( element.getAttribute( 'embed-url' ) ).toBe(
				'https://www.youtube.com/embed/dQw4w9WgXcQ'
			);
		} );

		it( 'should initialize with valid video-title attribute', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			expect( element.getAttribute( 'video-title' ) ).toBe(
				'Test Video'
			);
		} );

		it( 'should warn when embed-url is missing', () => {
			const warnSpy = vi
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			element = createFacadeElement( '', 'Test Video' );
			element.removeAttribute( 'embed-url' );
			document.body.appendChild( element );

			expect( warnSpy ).toHaveBeenCalledWith(
				'omb-youtube-facade: Missing embed-url attribute'
			);
		} );

		it( 'should not warn when embed-url is present', () => {
			const warnSpy = vi
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			element = createFacadeElement();
			document.body.appendChild( element );

			expect( warnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should use default video title when attribute is missing', () => {
			element = createFacadeElement(
				'https://www.youtube.com/embed/dQw4w9WgXcQ',
				''
			);
			element.removeAttribute( 'video-title' );
			document.body.appendChild( element );

			// Activate to verify the default title is used
			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.title ).toBe( 'YouTube video' );
		} );
	} );

	describe( 'attributeChangedCallback', () => {
		it( 'should update embed-url when attribute changes', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const newUrl = 'https://www.youtube.com/embed/newVideoId';
			element.setAttribute( 'embed-url', newUrl );

			// Activate to verify the new URL is used
			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.src ).toBe( `${ newUrl }?autoplay=1` );
		} );

		it( 'should update video-title when attribute changes', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.setAttribute( 'video-title', 'New Title' );

			// Activate to verify the new title is used
			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.title ).toBe( 'New Title' );
		} );

		it( 'should not update when value is unchanged', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			// Set the same value - should early return
			const originalUrl = element.getAttribute( 'embed-url' );
			element.setAttribute( 'embed-url', originalUrl! );

			// This should not cause any issues
			expect( element.getAttribute( 'embed-url' ) ).toBe( originalUrl );
		} );
	} );

	describe( 'activation behavior', () => {
		it( 'should create iframe on activation', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe ).not.toBeNull();
		} );

		it( 'should set correct iframe src with autoplay', () => {
			const embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
			element = createFacadeElement( embedUrl );
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.src ).toBe( `${ embedUrl }?autoplay=1` );
		} );

		it( 'should set correct iframe title', () => {
			element = createFacadeElement(
				'https://www.youtube.com/embed/dQw4w9WgXcQ',
				'My Video'
			);
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.title ).toBe( 'My Video' );
		} );

		it( 'should set aria-label on iframe', () => {
			element = createFacadeElement(
				'https://www.youtube.com/embed/dQw4w9WgXcQ',
				'My Video'
			);
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.getAttribute( 'aria-label' ) ).toBe(
				'Embedded YouTube video: My Video'
			);
		} );

		it( 'should set allow attribute on iframe', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.getAttribute( 'allow' ) ).toBe(
				'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
			);
		} );

		it( 'should set allowfullscreen attribute on iframe', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.hasAttribute( 'allowfullscreen' ) ).toBe( true );
		} );

		it( 'should clear existing content on activation', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const originalContent = element.innerHTML;
			expect( originalContent ).toContain( 'img' );

			element.click();

			// Original content should be gone
			expect( element.querySelector( 'img' ) ).toBeNull();
			expect( element.querySelector( '.play-button' ) ).toBeNull();
		} );

		it( 'should add is-activated class to element', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			expect( element.classList.contains( 'is-activated' ) ).toBe(
				false
			);

			element.click();

			expect( element.classList.contains( 'is-activated' ) ).toBe( true );
		} );

		it( 'should only activate once', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.click();

			const firstIframe = element.querySelector( 'iframe' );
			const firstSrc = firstIframe?.src;

			// Change the embed URL
			element.setAttribute(
				'embed-url',
				'https://www.youtube.com/embed/differentVideo'
			);

			// Click again
			element.click();

			// Should still have the same iframe
			const secondIframe = element.querySelector( 'iframe' );
			expect( secondIframe?.src ).toBe( firstSrc );
		} );

		it( 'should contain only one iframe after activation', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.click();

			const iframes = element.querySelectorAll( 'iframe' );
			expect( iframes.length ).toBe( 1 );
		} );
	} );

	describe( 'parent wrapper interaction', () => {
		it( 'should add is-activated class to parent wrapper', () => {
			const { wrapper, facade } = createFacadeWithWrapper();
			document.body.appendChild( wrapper );

			expect( wrapper.classList.contains( 'is-activated' ) ).toBe(
				false
			);

			facade.click();

			expect( wrapper.classList.contains( 'is-activated' ) ).toBe( true );
		} );

		it( 'should handle activation without parent wrapper gracefully', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			// Should not throw when no parent wrapper exists
			expect( () => element.click() ).not.toThrow();
			expect( element.classList.contains( 'is-activated' ) ).toBe( true );
		} );

		it( 'should not affect unrelated parent elements', () => {
			const unrelatedWrapper = document.createElement( 'div' );
			unrelatedWrapper.className = 'some-other-class';

			element = createFacadeElement();
			unrelatedWrapper.appendChild( element );
			document.body.appendChild( unrelatedWrapper );

			element.click();

			expect(
				unrelatedWrapper.classList.contains( 'is-activated' )
			).toBe( false );
		} );
	} );

	describe( 'click interaction', () => {
		it( 'should activate on click', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.click();

			expect( element.classList.contains( 'is-activated' ) ).toBe( true );
			expect( element.querySelector( 'iframe' ) ).not.toBeNull();
		} );

		it( 'should activate on programmatic click event', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			element.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);

			expect( element.classList.contains( 'is-activated' ) ).toBe( true );
		} );
	} );

	describe( 'keyboard interaction', () => {
		it( 'should activate on Enter key', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const event = new KeyboardEvent( 'keydown', {
				key: 'Enter',
				bubbles: true,
			} );
			const preventDefaultSpy = vi.spyOn( event, 'preventDefault' );

			element.dispatchEvent( event );

			expect( preventDefaultSpy ).toHaveBeenCalled();
			expect( element.classList.contains( 'is-activated' ) ).toBe( true );
		} );

		it( 'should activate on Space key', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const event = new KeyboardEvent( 'keydown', {
				key: ' ',
				bubbles: true,
			} );
			const preventDefaultSpy = vi.spyOn( event, 'preventDefault' );

			element.dispatchEvent( event );

			expect( preventDefaultSpy ).toHaveBeenCalled();
			expect( element.classList.contains( 'is-activated' ) ).toBe( true );
		} );

		it( 'should not activate on other keys', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const event = new KeyboardEvent( 'keydown', {
				key: 'Escape',
				bubbles: true,
			} );
			element.dispatchEvent( event );

			expect( element.classList.contains( 'is-activated' ) ).toBe(
				false
			);
			expect( element.querySelector( 'iframe' ) ).toBeNull();
		} );

		it( 'should not activate on Tab key', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const event = new KeyboardEvent( 'keydown', {
				key: 'Tab',
				bubbles: true,
			} );
			element.dispatchEvent( event );

			expect( element.classList.contains( 'is-activated' ) ).toBe(
				false
			);
		} );
	} );

	describe( 'disconnectedCallback', () => {
		it( 'should remove click event listener on disconnect', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const removeEventListenerSpy = vi.spyOn(
				element,
				'removeEventListener'
			);

			element.remove();

			expect( removeEventListenerSpy ).toHaveBeenCalledWith(
				'click',
				expect.any( Function )
			);
		} );

		it( 'should remove keydown event listener on disconnect', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			const removeEventListenerSpy = vi.spyOn(
				element,
				'removeEventListener'
			);

			element.remove();

			expect( removeEventListenerSpy ).toHaveBeenCalledWith(
				'keydown',
				expect.any( Function )
			);
		} );

		it( 'should not respond to events after disconnect', () => {
			element = createFacadeElement();
			document.body.appendChild( element );

			// Remove from DOM
			element.remove();

			// Re-add to DOM without going through connectedCallback again
			// (simulating a detached element)
			const detachedElement = createFacadeElement();
			document.body.appendChild( detachedElement );
			detachedElement.remove();

			// Try to click - should not activate since disconnected
			detachedElement.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);

			// Element should not be activated after being disconnected
			expect( detachedElement.classList.contains( 'is-activated' ) ).toBe(
				false
			);
		} );
	} );

	describe( 'custom element registration', () => {
		it( 'should be registered as a custom element', () => {
			const CustomElement = customElements.get( 'omb-youtube-facade' );
			expect( CustomElement ).toBeDefined();
		} );

		it( 'should be instance of OmbYouTubeFacade', () => {
			element = document.createElement(
				'omb-youtube-facade'
			) as OmbYouTubeFacade;
			expect( element ).toBeInstanceOf( OmbYouTubeFacade );
		} );

		it( 'should have observed attributes defined', () => {
			expect( OmbYouTubeFacade.observedAttributes ).toContain(
				'embed-url'
			);
			expect( OmbYouTubeFacade.observedAttributes ).toContain(
				'video-title'
			);
		} );
	} );

	describe( 'edge cases', () => {
		it( 'should handle empty embed-url gracefully', () => {
			const warnSpy = vi
				.spyOn( console, 'warn' )
				.mockImplementation( () => {} );

			element = document.createElement(
				'omb-youtube-facade'
			) as OmbYouTubeFacade;
			document.body.appendChild( element );

			// Should warn but not throw
			expect( warnSpy ).toHaveBeenCalled();

			// Click should not create iframe
			element.click();
			expect( element.querySelector( 'iframe' ) ).toBeNull();
		} );

		it( 'should handle special characters in video title', () => {
			const specialTitle = 'Test <Video> "Title" & More';
			element = createFacadeElement(
				'https://www.youtube.com/embed/dQw4w9WgXcQ',
				specialTitle
			);
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			expect( iframe?.title ).toBe( specialTitle );
			expect( iframe?.getAttribute( 'aria-label' ) ).toBe(
				`Embedded YouTube video: ${ specialTitle }`
			);
		} );

		it( 'should handle URL with existing query parameters', () => {
			const embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0';
			element = createFacadeElement( embedUrl );
			document.body.appendChild( element );

			element.click();

			const iframe = element.querySelector( 'iframe' );
			// Note: This will append ?autoplay=1 to the URL even if it already has params
			// This tests current behavior - might need adjustment if URL parsing is added
			expect( iframe?.src ).toBe( `${ embedUrl }?autoplay=1` );
		} );
	} );
} );
