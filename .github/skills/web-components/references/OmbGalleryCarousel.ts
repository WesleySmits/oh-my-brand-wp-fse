/**
 * Gallery Carousel Web Component.
 *
 * Full example demonstrating:
 * - Custom element lifecycle methods
 * - Attribute observation
 * - Event handling with proper cleanup
 * - Keyboard navigation
 * - Accessibility (live regions, button states)
 * - CSS custom properties
 *
 * @package theme-oh-my-brand
 */

class OmbGalleryCarousel extends HTMLElement {
	/** Observed attributes for attributeChangedCallback */
	static observedAttributes = [ 'visible-images' ];

	/** Gallery container */
	#gallery: HTMLElement | null = null;

	/** Gallery items */
	#items: NodeListOf< HTMLElement > | null = null;

	/** Previous button */
	#prevButton: HTMLButtonElement | null = null;

	/** Next button */
	#nextButton: HTMLButtonElement | null = null;

	/** Live region for announcements */
	#liveRegion: HTMLElement | null = null;

	/** Number of visible images */
	#visibleImages = 3;

	/** Current scroll position */
	#currentIndex = 0;

	/**
	 * Called when element is added to DOM.
	 */
	connectedCallback(): void {
		this.#readAttributes();
		this.#queryElements();
		this.#bindEvents();
		this.#initialize();
	}

	/**
	 * Called when element is removed from DOM.
	 */
	disconnectedCallback(): void {
		this.#unbindEvents();
	}

	/**
	 * Called when observed attribute changes.
	 */
	attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null
	): void {
		if ( oldValue === newValue ) {
			return;
		}

		switch ( name ) {
			case 'visible-images':
				this.#visibleImages = newValue ? parseInt( newValue, 10 ) : 3;
				this.#updateStyles();
				break;
		}
	}

	/**
	 * Read initial attributes.
	 */
	#readAttributes(): void {
		const visibleAttr = this.getAttribute( 'visible-images' );
		this.#visibleImages = visibleAttr ? parseInt( visibleAttr, 10 ) : 3;
	}

	/**
	 * Query child elements.
	 */
	#queryElements(): void {
		this.#gallery = this.querySelector( '[data-gallery]' );
		this.#items = this.querySelectorAll( '[data-gallery-item]' );
		this.#prevButton = this.querySelector( '[data-gallery-previous]' );
		this.#nextButton = this.querySelector( '[data-gallery-next]' );
		this.#liveRegion = this.querySelector( '[data-gallery-live]' );
	}

	/**
	 * Initialize component state.
	 */
	#initialize(): void {
		this.#updateStyles();
		this.#updateButtonStates();
	}

	/**
	 * Update CSS custom properties.
	 */
	#updateStyles(): void {
		this.style.setProperty(
			'--visible-images',
			this.#visibleImages.toString()
		);
	}

	/**
	 * Bind event listeners.
	 */
	#bindEvents(): void {
		this.#prevButton?.addEventListener( 'click', this.#handlePrevClick );
		this.#nextButton?.addEventListener( 'click', this.#handleNextClick );
		this.addEventListener( 'keydown', this.#handleKeydown );
	}

	/**
	 * Unbind event listeners.
	 */
	#unbindEvents(): void {
		this.#prevButton?.removeEventListener( 'click', this.#handlePrevClick );
		this.#nextButton?.removeEventListener( 'click', this.#handleNextClick );
		this.removeEventListener( 'keydown', this.#handleKeydown );
	}

	/**
	 * Handle previous button click.
	 */
	#handlePrevClick = (): void => {
		this.#navigate( -1 );
	};

	/**
	 * Handle next button click.
	 */
	#handleNextClick = (): void => {
		this.#navigate( 1 );
	};

	/**
	 * Handle keyboard navigation.
	 */
	#handleKeydown = ( event: KeyboardEvent ): void => {
		switch ( event.key ) {
			case 'ArrowLeft':
				event.preventDefault();
				this.#navigate( -1 );
				break;
			case 'ArrowRight':
				event.preventDefault();
				this.#navigate( 1 );
				break;
		}
	};

	/**
	 * Navigate by delta.
	 */
	#navigate( delta: number ): void {
		const maxIndex = Math.max(
			0,
			( this.#items?.length ?? 0 ) - this.#visibleImages
		);
		const newIndex = Math.max(
			0,
			Math.min( this.#currentIndex + delta, maxIndex )
		);

		if ( newIndex === this.#currentIndex ) {
			return;
		}

		this.#currentIndex = newIndex;
		this.#scrollToIndex();
		this.#updateButtonStates();
		this.#announce();
	}

	/**
	 * Scroll gallery to current index.
	 */
	#scrollToIndex(): void {
		if ( ! this.#gallery || ! this.#items?.length ) {
			return;
		}

		const item = this.#items[ this.#currentIndex ];
		if ( ! item ) {
			return;
		}

		const scrollLeft = item.offsetLeft;
		this.#gallery.scrollTo( { left: scrollLeft, behavior: 'smooth' } );
	}

	/**
	 * Update navigation button states.
	 */
	#updateButtonStates(): void {
		const maxIndex = Math.max(
			0,
			( this.#items?.length ?? 0 ) - this.#visibleImages
		);

		if ( this.#prevButton ) {
			this.#prevButton.disabled = this.#currentIndex === 0;
		}

		if ( this.#nextButton ) {
			this.#nextButton.disabled = this.#currentIndex >= maxIndex;
		}
	}

	/**
	 * Announce current position to screen readers.
	 */
	#announce(): void {
		if ( ! this.#liveRegion || ! this.#items?.length ) {
			return;
		}

		const current = this.#currentIndex + 1;
		const total = this.#items.length;
		this.#liveRegion.textContent = `Showing image ${ current } of ${ total }`;
	}
}

// Register custom element
if ( ! customElements.get( 'omb-gallery-carousel' ) ) {
	customElements.define( 'omb-gallery-carousel', OmbGalleryCarousel );
}
