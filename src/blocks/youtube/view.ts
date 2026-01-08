/**
 * YouTube Block - Frontend view script using Web Component.
 *
 * Implements facade pattern: replaces thumbnail with iframe on user interaction.
 * This improves initial page load by deferring iframe loading (~500KB saved per video).
 *
 * @package
 */

/**
 * YouTube Facade Web Component.
 * Handles click-to-load behavior for YouTube embeds.
 *
 * @example
 * ```html
 * <omb-youtube-facade
 *   embed-url="https://www.youtube.com/embed/VIDEO_ID"
 *   video-title="Video Title"
 * >
 *   <!-- Facade content (thumbnail, play button) -->
 * </omb-youtube-facade>
 * ```
 */
class OmbYouTubeFacade extends HTMLElement {
	/** Observed attributes for attributeChangedCallback */
	static observedAttributes = ['embed-url', 'video-title'];

	/** Embed URL for the YouTube video */
	#embedUrl = '';

	/** Video title for accessibility */
	#videoTitle = '';

	/** Whether the component has been activated */
	#isActivated = false;

	/**
	 * Called when the element is added to the DOM.
	 */
	connectedCallback(): void {
		this.#embedUrl = this.getAttribute('embed-url') || '';
		this.#videoTitle = this.getAttribute('video-title') || 'YouTube video';

		if (!this.#embedUrl) {
			// eslint-disable-next-line no-console
			console.warn('omb-youtube-facade: Missing embed-url attribute');
			return;
		}

		this.#bindEvents();
	}

	/**
	 * Called when an observed attribute changes.
	 * @param name
	 * @param oldValue
	 * @param newValue
	 */
	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'embed-url':
				this.#embedUrl = newValue || '';
				break;
			case 'video-title':
				this.#videoTitle = newValue || 'YouTube video';
				break;
		}
	}

	/**
	 * Bind event listeners for activation.
	 */
	#bindEvents(): void {
		// Click handler
		this.addEventListener('click', this.#handleActivation);

		// Keyboard handler for Enter and Space
		this.addEventListener('keydown', this.#handleKeydown);
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	#handleKeydown = (event: KeyboardEvent): void => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.#activate();
		}
	};

	/**
	 * Handle click activation.
	 */
	#handleActivation = (): void => {
		this.#activate();
	};

	/**
	 * Activate the video - replace facade with iframe.
	 */
	#activate(): void {
		if (this.#isActivated) {
			return;
		}

		this.#isActivated = true;

		const iframe = document.createElement('iframe');

		iframe.src = `${this.#embedUrl}?autoplay=1`;
		iframe.title = this.#videoTitle;
		iframe.setAttribute('aria-label', `Embedded YouTube video: ${this.#videoTitle}`);
		iframe.setAttribute(
			'allow',
			'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
		);
		iframe.setAttribute('allowfullscreen', '');

		// Clear content and append iframe
		this.innerHTML = '';
		this.appendChild(iframe);

		// Add activated class for styling
		this.classList.add('is-activated');

		// Update parent wrapper if exists
		const wrapper = this.closest('.wp-block-theme-oh-my-brand-youtube');
		wrapper?.classList.add('is-activated');
	}

	/**
	 * Clean up when element is removed.
	 */
	disconnectedCallback(): void {
		this.removeEventListener('click', this.#handleActivation);
		this.removeEventListener('keydown', this.#handleKeydown);
	}
}

// Register the custom element
if (!customElements.get('omb-youtube-facade')) {
	customElements.define('omb-youtube-facade', OmbYouTubeFacade);
}

// Export for testing
export { OmbYouTubeFacade };
