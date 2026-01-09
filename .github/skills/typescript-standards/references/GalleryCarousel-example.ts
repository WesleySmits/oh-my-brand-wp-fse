/**
 * Gallery carousel component.
 *
 * Full example demonstrating:
 * - Private fields with # prefix
 * - Readonly properties
 * - Public methods with JSDoc
 * - Private helper methods
 * - Type-safe options merging
 *
 * Provides carousel functionality for image galleries with
 * touch support and keyboard navigation.
 *
 * @package theme-oh-my-brand
 */

interface CarouselOptions {
	readonly visibleCount?: number;
	autoplay?: boolean;
	interval?: number;
}

export class GalleryCarousel {
	// Private fields with # prefix
	readonly #element: HTMLElement;
	readonly #options: Required<CarouselOptions>;
	#currentIndex: number = 0;
	#isAnimating: boolean = false;

	/**
	 * Creates a new GalleryCarousel instance.
	 *
	 * @param element - The container element.
	 * @param options - Configuration options.
	 */
	constructor(element: HTMLElement, options: CarouselOptions = {}) {
		this.#element = element;
		this.#options = this.#mergeOptions(options);
		this.#init();
	}

	/**
	 * Navigate to a specific slide.
	 *
	 * @param index - The slide index to navigate to.
	 */
	public goToSlide(index: number): void {
		if (this.#isAnimating || index === this.#currentIndex) {
			return;
		}

		this.#isAnimating = true;
		this.#currentIndex = this.#normalizeIndex(index);
		this.#updateSlides();
	}

	/**
	 * Navigate to the next slide.
	 */
	public next(): void {
		this.goToSlide(this.#currentIndex + 1);
	}

	/**
	 * Navigate to the previous slide.
	 */
	public prev(): void {
		this.goToSlide(this.#currentIndex - 1);
	}

	/**
	 * Get the current slide index.
	 */
	public getCurrentIndex(): number {
		return this.#currentIndex;
	}

	/**
	 * Cleans up event listeners and resources.
	 */
	public destroy(): void {
		this.#removeEventListeners();
	}

	#init(): void {
		this.#setupDOM();
		this.#attachEventListeners();
	}

	#mergeOptions(options: CarouselOptions): Required<CarouselOptions> {
		return {
			visibleCount: 3,
			autoplay: false,
			interval: 5000,
			...options
		};
	}

	#normalizeIndex(index: number): number {
		const slideCount = this.#getSlideCount();
		return ((index % slideCount) + slideCount) % slideCount;
	}

	#getSlideCount(): number {
		return this.#element.querySelectorAll('[data-slide]').length;
	}

	#setupDOM(): void {
		// Setup DOM structure
	}

	#attachEventListeners(): void {
		// Attach event listeners
	}

	#removeEventListeners(): void {
		// Remove event listeners
	}

	#updateSlides(): void {
		// Update slide positions
		this.#isAnimating = false;
	}
}
