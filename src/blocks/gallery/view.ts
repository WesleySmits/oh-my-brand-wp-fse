/**
 * Gallery Block - Frontend view script using Web Component.
 *
 * @package theme-oh-my-brand
 */

import { createLightboxFromElements, type Lightbox } from '../utils/Lightbox';
import { debounce } from '../utils/debounce';
import '../utils/lightbox.css';

/**
 * Gallery Carousel Web Component.
 * Handles carousel navigation, keyboard controls, and lightbox integration.
 *
 * @example
 * ```html
 * <omb-gallery-carousel
 *   visible-images="3"
 *   lightbox="true"
 * >
 *   <!-- Gallery content -->
 * </omb-gallery-carousel>
 * ```
 */
class OmbGalleryCarousel extends HTMLElement {
	/** Observed attributes for attributeChangedCallback */
	static observedAttributes = ['visible-images', 'lightbox'];

	/** Gallery container element */
	#gallery: HTMLElement | null = null;

	/** Previous button element */
	#prevButton: HTMLButtonElement | null = null;

	/** Next button element */
	#nextButton: HTMLButtonElement | null = null;

	/** Live region for screen reader announcements */
	#liveRegion: HTMLElement | null = null;

	/** Gallery item elements */
	#items: NodeListOf<HTMLElement> | null = null;

	/** Number of visible images */
	#visibleImages = 3;

	/** Whether lightbox is enabled */
	#lightboxEnabled = true;

	/** Debounced update function */
	#debouncedUpdate: (() => void) | null = null;

	/** Current scroll index */
	#currentIndex = 0;

	/** Lightbox instance */
	#lightbox: Lightbox | null = null;

	/**
	 * Called when the element is added to the DOM.
	 */
	connectedCallback(): void {
		// Read attributes
		const visibleAttr = this.getAttribute('visible-images');
		this.#visibleImages = visibleAttr ? parseInt(visibleAttr, 10) : 3;

		const lightboxAttr = this.getAttribute('lightbox');
		this.#lightboxEnabled = lightboxAttr !== 'false';

		// Query child elements
		this.#gallery = this.querySelector('[data-gallery]');
		this.#prevButton = this.querySelector('[data-gallery-previous]');
		this.#nextButton = this.querySelector('[data-gallery-next]');
		this.#liveRegion = this.querySelector('[data-gallery-live]');
		this.#items = this.querySelectorAll('[data-gallery-item]');

		if (!this.#gallery || !this.#prevButton || !this.#nextButton) {
			return;
		}

		this.#debouncedUpdate = debounce(this.#updateArrows.bind(this), 100);

		this.#bindEvents();
		this.#refresh();
		this.#initLightbox();
	}

	/**
	 * Called when an observed attribute changes.
	 */
	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'visible-images':
				this.#visibleImages = newValue ? parseInt(newValue, 10) : 3;
				this.#refresh();
				break;
			case 'lightbox':
				this.#lightboxEnabled = newValue !== 'false';
				break;
		}
	}

	/**
	 * Initialize lightbox for gallery images.
	 */
	#initLightbox(): void {
		if (!this.#lightboxEnabled) {
			return;
		}

		this.#lightbox = createLightboxFromElements('[data-gallery-item] img', this, {
			closeLabel: 'Close gallery',
			prevLabel: 'Previous image',
			nextLabel: 'Next image'
		});
	}

	/**
	 * Refresh gallery state.
	 */
	#refresh(): void {
		this.#gallery?.style.setProperty('--visible-images', this.#visibleImages.toString());
		this.#updateArrows();
	}

	/**
	 * Update navigation arrows visibility.
	 */
	#updateArrows(): void {
		if (!this.#gallery || !this.#prevButton || !this.#nextButton) {
			return;
		}

		const canScrollPrev = this.#gallery.scrollLeft > 0;
		const canScrollNext = this.#gallery.scrollLeft + this.#gallery.clientWidth < this.#gallery.scrollWidth - 1;

		this.#prevButton.style.display = canScrollPrev ? 'block' : 'none';
		this.#prevButton.setAttribute('aria-disabled', (!canScrollPrev).toString());

		this.#nextButton.style.display = canScrollNext ? 'block' : 'none';
		this.#nextButton.setAttribute('aria-disabled', (!canScrollNext).toString());

		this.#updateCurrentIndex();
	}

	/**
	 * Update current index based on scroll position.
	 */
	#updateCurrentIndex(): void {
		if (!this.#gallery || !this.#items?.length) {
			return;
		}

		const itemWidth = this.#gallery.clientWidth / this.#visibleImages;
		const newIndex = Math.round(this.#gallery.scrollLeft / itemWidth);

		if (newIndex !== this.#currentIndex) {
			this.#currentIndex = newIndex;
			this.#announcePosition();
		}
	}

	/**
	 * Announce current position to screen readers.
	 */
	#announcePosition(): void {
		if (!this.#liveRegion || !this.#items?.length) {
			return;
		}

		const totalItems = this.#items.length;
		const currentItem = Math.min(this.#currentIndex + 1, totalItems);
		const message = `Image ${currentItem} of ${totalItems}`;

		this.#liveRegion.textContent = message;
	}

	/**
	 * Bind event listeners.
	 */
	#bindEvents(): void {
		this.#prevButton?.addEventListener('click', this.#handlePrevClick);
		this.#nextButton?.addEventListener('click', this.#handleNextClick);

		if (this.#debouncedUpdate) {
			this.#gallery?.addEventListener('scroll', this.#debouncedUpdate);
		}

		// Keyboard navigation
		this.addEventListener('keydown', this.#handleKeydown);

		// Initial arrow update after layout settles
		setTimeout(() => this.#updateArrows(), 200);
	}

	/**
	 * Handle previous button click.
	 */
	#handlePrevClick = (): void => {
		this.#scrollBy(-1);
	};

	/**
	 * Handle next button click.
	 */
	#handleNextClick = (): void => {
		this.#scrollBy(1);
	};

	/**
	 * Handle keyboard navigation.
	 */
	#handleKeydown = (event: KeyboardEvent): void => {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				this.#scrollBy(-1);
				break;
			case 'ArrowRight':
				event.preventDefault();
				this.#scrollBy(1);
				break;
			case 'Home':
				event.preventDefault();
				this.#scrollToStart();
				break;
			case 'End':
				event.preventDefault();
				this.#scrollToEnd();
				break;
		}
	};

	/**
	 * Scroll to start of gallery.
	 */
	#scrollToStart(): void {
		this.#gallery?.scrollTo({
			left: 0,
			behavior: 'smooth'
		});
	}

	/**
	 * Scroll to end of gallery.
	 */
	#scrollToEnd(): void {
		this.#gallery?.scrollTo({
			left: this.#gallery.scrollWidth,
			behavior: 'smooth'
		});
	}

	/**
	 * Scroll gallery by direction.
	 *
	 * @param direction Scroll direction (-1 or 1).
	 */
	#scrollBy(direction: number): void {
		if (!this.#gallery) {
			return;
		}

		const amount = this.#gallery.clientWidth / this.#visibleImages;
		this.#gallery.scrollBy({
			left: amount * direction,
			behavior: 'smooth'
		});
	}

	/**
	 * Clean up when element is removed.
	 */
	disconnectedCallback(): void {
		this.#prevButton?.removeEventListener('click', this.#handlePrevClick);
		this.#nextButton?.removeEventListener('click', this.#handleNextClick);
		this.removeEventListener('keydown', this.#handleKeydown);

		if (this.#debouncedUpdate) {
			this.#gallery?.removeEventListener('scroll', this.#debouncedUpdate);
		}

		// Clean up lightbox
		this.#lightbox?.destroy();
		this.#lightbox = null;
	}
}

// Register the custom element
if (!customElements.get('omb-gallery-carousel')) {
	customElements.define('omb-gallery-carousel', OmbGalleryCarousel);
}

// Export for testing
export { OmbGalleryCarousel };
