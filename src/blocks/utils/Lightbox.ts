/**
 * Reusable Lightbox component using native <dialog> element.
 *
 * Features:
 * - Accessible modal dialog with proper ARIA attributes
 * - Keyboard navigation (Escape to close, arrows for navigation)
 * - Click outside to close
 * - Smooth animations with prefers-reduced-motion support
 * - Lazy image loading
 *
 * @package
 */

export interface LightboxImage {
	src: string;
	alt: string;
	caption?: string;
	srcset?: string;
	sizes?: string;
}

export interface LightboxOptions {
	/** Animation duration in milliseconds (default: 200) */
	animationDuration?: number;
	/** Enable keyboard navigation between images (default: true) */
	enableKeyboardNav?: boolean;
	/** Show image counter (default: true) */
	showCounter?: boolean;
	/** Label for close button (default: 'Close lightbox') */
	closeLabel?: string;
	/** Label for previous button (default: 'Previous image') */
	prevLabel?: string;
	/** Label for next button (default: 'Next image') */
	nextLabel?: string;
}

const DEFAULT_OPTIONS: Required< LightboxOptions > = {
	animationDuration: 200,
	enableKeyboardNav: true,
	showCounter: true,
	closeLabel: 'Close lightbox',
	prevLabel: 'Previous image',
	nextLabel: 'Next image',
};

/**
 * Lightbox class for displaying images in a modal dialog.
 */
export class Lightbox {
	private readonly images: LightboxImage[];
	private readonly options: Required< LightboxOptions >;
	private currentIndex: number = 0;
	private dialog: HTMLDialogElement | null = null;
	private imageElement: HTMLImageElement | null = null;
	private captionElement: HTMLElement | null = null;
	private counterElement: HTMLElement | null = null;
	private prevButton: HTMLButtonElement | null = null;
	private nextButton: HTMLButtonElement | null = null;
	private triggerElement: HTMLElement | null = null;

	constructor( images: LightboxImage[], options: LightboxOptions = {} ) {
		this.images = images;
		this.options = { ...DEFAULT_OPTIONS, ...options };
		this.handleKeydown = this.handleKeydown.bind( this );
		this.handleBackdropClick = this.handleBackdropClick.bind( this );
	}

	/**
	 * Open the lightbox at a specific index.
	 * @param index
	 * @param triggerElement
	 */
	public open( index: number = 0, triggerElement?: HTMLElement ): void {
		if ( this.images.length === 0 ) {
			return;
		}

		this.currentIndex = this.clampIndex( index );
		/* eslint-disable @wordpress/no-global-active-element */
		this.triggerElement =
			triggerElement || ( document.activeElement as HTMLElement );
		/* eslint-enable @wordpress/no-global-active-element */

		this.createDialog();
		this.updateContent();
		this.attachEventListeners();

		this.dialog?.showModal();

		// Focus the dialog for keyboard navigation
		this.dialog?.focus();
	}

	/**
	 * Close the lightbox.
	 */
	public close(): void {
		if ( ! this.dialog ) {
			return;
		}

		// Animate out if motion is allowed
		if ( ! this.prefersReducedMotion() ) {
			this.dialog.classList.add( 'lightbox--closing' );
			setTimeout( () => {
				this.destroyDialog();
			}, this.options.animationDuration );
		} else {
			this.destroyDialog();
		}
	}

	/**
	 * Navigate to the next image.
	 */
	public next(): void {
		if ( this.currentIndex < this.images.length - 1 ) {
			this.currentIndex++;
			this.updateContent();
		}
	}

	/**
	 * Navigate to the previous image.
	 */
	public prev(): void {
		if ( this.currentIndex > 0 ) {
			this.currentIndex--;
			this.updateContent();
		}
	}

	/**
	 * Navigate to a specific image index.
	 * @param index
	 */
	public goTo( index: number ): void {
		const newIndex = this.clampIndex( index );
		if ( newIndex !== this.currentIndex ) {
			this.currentIndex = newIndex;
			this.updateContent();
		}
	}

	/**
	 * Get the current image index.
	 */
	public getCurrentIndex(): number {
		return this.currentIndex;
	}

	/**
	 * Check if the lightbox is currently open.
	 */
	public isOpen(): boolean {
		return this.dialog?.open ?? false;
	}

	/**
	 * Destroy the lightbox and clean up resources.
	 */
	public destroy(): void {
		this.destroyDialog();
	}

	private createDialog(): void {
		// Remove any existing dialog
		this.destroyDialog();

		const dialog = document.createElement( 'dialog' );
		dialog.className = 'lightbox';
		dialog.setAttribute( 'aria-label', 'Image lightbox' );
		dialog.tabIndex = -1;

		const showNav = this.images.length > 1;

		dialog.innerHTML = `
			<div class="lightbox__container">
				<button
					type="button"
					class="lightbox__close"
					aria-label="${ this.escapeHtml( this.options.closeLabel ) }"
				>
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12"/>
					</svg>
				</button>

				<figure class="lightbox__figure">
					<img class="lightbox__image" src="" alt="" />
					<figcaption class="lightbox__caption" aria-live="polite"></figcaption>
				</figure>

				${
					showNav
						? `
				<nav class="lightbox__nav" aria-label="Image navigation">
					<button
						type="button"
						class="lightbox__button lightbox__button--prev"
						aria-label="${ this.escapeHtml( this.options.prevLabel ) }"
					>
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M15 18l-6-6 6-6"/>
						</svg>
					</button>
					<button
						type="button"
						class="lightbox__button lightbox__button--next"
						aria-label="${ this.escapeHtml( this.options.nextLabel ) }"
					>
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 18l6-6-6-6"/>
						</svg>
					</button>
				</nav>
				`
						: ''
				}

				${
					this.options.showCounter && showNav
						? `
				<div class="lightbox__counter" aria-live="polite" aria-atomic="true"></div>
				`
						: ''
				}
			</div>
		`;

		// Cache element references
		this.dialog = dialog;
		this.imageElement = dialog.querySelector( '.lightbox__image' );
		this.captionElement = dialog.querySelector( '.lightbox__caption' );
		this.counterElement = dialog.querySelector( '.lightbox__counter' );
		this.prevButton = dialog.querySelector( '.lightbox__button--prev' );
		this.nextButton = dialog.querySelector( '.lightbox__button--next' );

		document.body.appendChild( dialog );
	}

	private destroyDialog(): void {
		// Guard against multiple calls
		if ( ! this.dialog ) {
			return;
		}

		this.detachEventListeners();

		const dialogToRemove = this.dialog;
		this.dialog = null;

		dialogToRemove.close();
		dialogToRemove.remove();

		// Return focus to trigger element
		if ( this.triggerElement && document.contains( this.triggerElement ) ) {
			this.triggerElement.focus();
		}

		this.imageElement = null;
		this.captionElement = null;
		this.counterElement = null;
		this.prevButton = null;
		this.nextButton = null;
		this.triggerElement = null;
	}

	private attachEventListeners(): void {
		if ( ! this.dialog ) {
			return;
		}

		// Close button
		const closeButton = this.dialog.querySelector( '.lightbox__close' );
		closeButton?.addEventListener( 'click', () => this.close() );

		// Navigation buttons
		this.prevButton?.addEventListener( 'click', () => this.prev() );
		this.nextButton?.addEventListener( 'click', () => this.next() );

		// Keyboard navigation
		if ( this.options.enableKeyboardNav ) {
			document.addEventListener( 'keydown', this.handleKeydown );
		}

		// Click on backdrop to close
		this.dialog.addEventListener( 'click', this.handleBackdropClick );

		// Dialog close event (e.g., Escape key)
		this.dialog.addEventListener( 'close', () => this.destroyDialog() );
	}

	private detachEventListeners(): void {
		document.removeEventListener( 'keydown', this.handleKeydown );
		this.dialog?.removeEventListener( 'click', this.handleBackdropClick );
	}

	private handleKeydown( event: KeyboardEvent ): void {
		switch ( event.key ) {
			case 'ArrowLeft':
				event.preventDefault();
				this.prev();
				break;
			case 'ArrowRight':
				event.preventDefault();
				this.next();
				break;
			case 'Home':
				event.preventDefault();
				this.goTo( 0 );
				break;
			case 'End':
				event.preventDefault();
				this.goTo( this.images.length - 1 );
				break;
		}
	}

	private handleBackdropClick( event: MouseEvent ): void {
		// Close when clicking on the backdrop (dialog element itself, not its content)
		if ( event.target === this.dialog ) {
			this.close();
		}
	}

	private updateContent(): void {
		const image = this.images[ this.currentIndex ];
		if ( ! image || ! this.imageElement ) {
			return;
		}

		// Update image
		this.imageElement.src = image.src;
		this.imageElement.alt = image.alt;

		if ( image.srcset ) {
			this.imageElement.srcset = image.srcset;
		} else {
			this.imageElement.removeAttribute( 'srcset' );
		}

		if ( image.sizes ) {
			this.imageElement.sizes = image.sizes;
		} else {
			this.imageElement.removeAttribute( 'sizes' );
		}

		// Update caption
		if ( this.captionElement ) {
			if ( image.caption ) {
				this.captionElement.textContent = image.caption;
				this.captionElement.hidden = false;
			} else {
				this.captionElement.textContent = '';
				this.captionElement.hidden = true;
			}
		}

		// Update counter
		if ( this.counterElement ) {
			this.counterElement.textContent = `${ this.currentIndex + 1 } / ${
				this.images.length
			}`;
		}

		// Update navigation button states
		this.updateNavigationState();
	}

	private updateNavigationState(): void {
		if ( this.prevButton ) {
			this.prevButton.disabled = this.currentIndex === 0;
		}
		if ( this.nextButton ) {
			this.nextButton.disabled =
				this.currentIndex === this.images.length - 1;
		}
	}

	private clampIndex( index: number ): number {
		return Math.max( 0, Math.min( index, this.images.length - 1 ) );
	}

	private prefersReducedMotion(): boolean {
		return window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	}

	private escapeHtml( text: string ): string {
		const div = document.createElement( 'div' );
		div.textContent = text;
		return div.innerHTML;
	}
}

/**
 * Factory function to create a lightbox from DOM elements.
 *
 * @param selector  CSS selector for images or anchor elements wrapping images
 * @param container
 * @param options   Lightbox options
 */
export function createLightboxFromElements(
	selector: string,
	container: HTMLElement = document.body,
	options: LightboxOptions = {}
): Lightbox | null {
	const elements = container.querySelectorAll< HTMLElement >( selector );

	if ( elements.length === 0 ) {
		return null;
	}

	const images: LightboxImage[] = [];

	elements.forEach( ( element ) => {
		let img: HTMLImageElement | null = null;

		if ( element instanceof HTMLImageElement ) {
			img = element;
		} else if ( element instanceof HTMLAnchorElement ) {
			img = element.querySelector( 'img' );
		}

		if ( img ) {
			images.push( {
				src: element.getAttribute( 'href' ) || img.src,
				alt: img.alt || '',
				caption:
					img.getAttribute( 'data-caption' ) ||
					element.getAttribute( 'data-caption' ) ||
					undefined,
				srcset: img.srcset || undefined,
				sizes: img.sizes || undefined,
			} );
		}
	} );

	if ( images.length === 0 ) {
		return null;
	}

	const lightbox = new Lightbox( images, options );

	// Attach click handlers to elements
	elements.forEach( ( element, index ) => {
		element.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			lightbox.open( index, element );
		} );

		// Make focusable if not already
		if ( ! element.getAttribute( 'tabindex' ) ) {
			element.setAttribute( 'tabindex', '0' );
		}

		// Handle Enter/Space key
		element.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				lightbox.open( index, element );
			}
		} );
	} );

	return lightbox;
}
