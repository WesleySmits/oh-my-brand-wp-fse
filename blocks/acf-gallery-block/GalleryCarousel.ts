import { select, subscribe } from '@wordpress/data';
import debounce from '../utils/debounce';

export class GalleryCarousel {
	#wrapper: HTMLElement;
	#gallery: HTMLElement;
	#prevButton: HTMLElement;
	#nextButton: HTMLElement;
	#isEditor: boolean;
	#visibleImages: number;
	#debouncedUpdate: () => void;

	constructor( wrapper: HTMLElement, { isEditor = false } = {} ) {
		this.#wrapper = wrapper;
		if ( ! this.#wrapper || this.#wrapper.dataset.initialized === 'true' ) {
			throw new Error(
				'GalleryCarousel: Required wrapper element not found'
			);
		}

		this.#gallery = wrapper.querySelector( '[data-gallery]' )!;
		this.#prevButton = wrapper.querySelector( '[data-gallery-previous]' )!;
		this.#nextButton = wrapper.querySelector( '[data-gallery-next]' )!;

		if ( ! this.#gallery || ! this.#prevButton || ! this.#nextButton ) {
			throw new Error( 'GalleryCarousel: Required elements not found' );
		}

		this.#isEditor = isEditor;

		wrapper.dataset.initialized = 'true';

		this.#visibleImages = this.#getVisibleImages();
		this.#debouncedUpdate = debounce( this.#updateArrows.bind( this ) );

		this.#bindEvents();
		this.#refresh();

		if ( this.#isEditor ) {
			this.#setupEditorSync();
		}
	}

	#getVisibleImages(): number {
		const dataVisible = this.#gallery.getAttribute( 'data-visible' );
		const visibleImages = dataVisible ? parseInt( dataVisible ) : 3;
		return visibleImages;
	}

	#refresh(): void {
		this.#gallery?.style.setProperty(
			'--visible-images',
			this.#visibleImages.toString()
		);
		this.#updateArrows();
	}

	#updateArrows(): void {
		if ( ! this.#gallery || ! this.#prevButton || ! this.#nextButton ) {
			return;
		}

		this.#prevButton.style.display =
			this.#gallery.scrollLeft > 0 ? 'block' : 'none';
		this.#nextButton.style.display =
			this.#gallery.scrollLeft + this.#gallery.clientWidth <
			this.#gallery.scrollWidth
				? 'block'
				: 'none';
	}

	#bindEvents(): void {
		this.#prevButton?.addEventListener( 'click', () => {
			this.#scrollBy( -1 );
		} );

		this.#nextButton?.addEventListener( 'click', () => {
			this.#scrollBy( 1 );
		} );

		this.#gallery?.addEventListener( 'scroll', this.#debouncedUpdate );

		setTimeout( () => this.#updateArrows(), 200 );
	}

	#scrollBy( direction = 1 ): void {
		const amount = this.#gallery.clientWidth / this.#visibleImages;
		this.#gallery.scrollBy( {
			left: amount * direction,
			behavior: 'smooth',
		} );
	}

	#setupEditorSync(): void {
		let previousVisibleImages = this.#visibleImages;

		subscribe( () => {
			const blocks = select( 'core/block-editor' ).getBlocks();
			const currentBlock = blocks.find(
				( block: { name: string } ) =>
					block.name === 'acf/acf-gallery-block'
			) as
				| {
						attributes: {
							data: {
								field_visible_images?: number;
								gallery?: string;
							};
						};
				  }
				| undefined;

			if ( currentBlock ) {
				const newVisibleImages =
					currentBlock.attributes.data?.field_visible_images || 3;

				if ( newVisibleImages !== previousVisibleImages ) {
					previousVisibleImages = newVisibleImages;
					this.#visibleImages = newVisibleImages;
					setTimeout( () => this.#refresh(), 500 );
				}
			}
		} );
	}
}
