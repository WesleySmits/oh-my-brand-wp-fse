/**
 * Social Share Web Component
 *
 * Handles share button interactions with Native Share API support
 * and graceful fallbacks.
 *
 * Custom Element: omb-social-share
 */

export class SocialShare extends HTMLElement {
	static readonly tagName = 'omb-social-share';

	private buttons: NodeListOf< HTMLButtonElement > | null = null;
	private toast: HTMLElement | null = null;
	private toastTimeout: ReturnType< typeof setTimeout > | null = null;

	// Configuration from data attributes
	private useNativeShare: boolean = true;
	private openInPopup: boolean = true;
	private shareUrl: string = '';
	private shareTitle: string = '';
	private shareImage: string = '';

	connectedCallback(): void {
		this.parseAttributes();
		this.cacheElements();
		this.attachEventListeners();
	}

	disconnectedCallback(): void {
		this.removeEventListeners();
		if ( this.toastTimeout ) {
			clearTimeout( this.toastTimeout );
		}
	}

	/**
	 * Parse data attributes from the element.
	 */
	private parseAttributes(): void {
		this.useNativeShare = this.dataset.nativeShare !== 'false';
		this.openInPopup = this.dataset.popup !== 'false';
		this.shareUrl = this.dataset.url || window.location.href;
		this.shareTitle = this.dataset.title || document.title;
		this.shareImage = this.dataset.image || '';
	}

	/**
	 * Cache DOM elements.
	 */
	private cacheElements(): void {
		this.buttons = this.querySelectorAll( '.social-share__button' );
		this.toast = this.querySelector( '.social-share__toast' );
	}

	/**
	 * Attach event listeners to buttons.
	 */
	private attachEventListeners(): void {
		this.buttons?.forEach( ( button ) => {
			button.addEventListener( 'click', this.handleButtonClick );
		} );
	}

	/**
	 * Remove event listeners from buttons.
	 */
	private removeEventListeners(): void {
		this.buttons?.forEach( ( button ) => {
			button.removeEventListener( 'click', this.handleButtonClick );
		} );
	}

	/**
	 * Handle button click events.
	 * @param event
	 */
	private handleButtonClick = async ( event: Event ): Promise< void > => {
		event.preventDefault();

		const button = event.currentTarget as HTMLButtonElement;
		const platform = button.dataset.platform;
		const shareUrl = button.dataset.shareUrl;

		if ( ! platform ) {
			return;
		}

		// Try Native Share API first (if enabled and supported)
		if (
			this.useNativeShare &&
			this.supportsNativeShare() &&
			platform !== 'copy' &&
			platform !== 'email'
		) {
			const shared = await this.tryNativeShare();
			if ( shared ) {
				return;
			}
		}

		// Handle copy to clipboard
		if ( platform === 'copy' ) {
			await this.copyToClipboard();
			return;
		}

		// Handle email (no popup needed)
		if ( platform === 'email' && shareUrl ) {
			window.location.href = shareUrl;
			return;
		}

		// Open share URL
		if ( shareUrl ) {
			this.openShareWindow( shareUrl );
		}
	};

	/**
	 * Check if Native Share API is supported.
	 */
	private supportsNativeShare(): boolean {
		return typeof navigator !== 'undefined' && 'share' in navigator;
	}

	/**
	 * Try to use Native Share API.
	 * @return True if share was successful, false otherwise.
	 */
	private async tryNativeShare(): Promise< boolean > {
		try {
			const shareData: ShareData = {
				title: this.shareTitle,
				url: this.shareUrl,
			};

			await navigator.share( shareData );
			return true;
		} catch {
			// User cancelled or share failed, fall back to regular sharing
			return false;
		}
	}

	/**
	 * Copy URL to clipboard.
	 */
	private async copyToClipboard(): Promise< void > {
		try {
			await navigator.clipboard.writeText( this.shareUrl );
			this.showToast();
		} catch {
			// Fallback for older browsers
			this.fallbackCopy();
		}
	}

	/**
	 * Fallback copy method using execCommand.
	 */
	private fallbackCopy(): void {
		const textArea = document.createElement( 'textarea' );
		textArea.value = this.shareUrl;
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';
		textArea.style.top = '-9999px';
		document.body.appendChild( textArea );
		textArea.focus();
		textArea.select();

		try {
			document.execCommand( 'copy' );
			this.showToast();
		} catch {
			// Fallback copy failed silently
		}

		document.body.removeChild( textArea );
	}

	/**
	 * Show toast notification.
	 */
	private showToast(): void {
		if ( ! this.toast ) {
			return;
		}

		// Clear any existing timeout
		if ( this.toastTimeout ) {
			clearTimeout( this.toastTimeout );
		}

		// Show toast
		this.toast.hidden = false;
		this.toast.classList.add( 'social-share__toast--visible' );

		// Hide after 3 seconds
		this.toastTimeout = setTimeout( () => {
			this.toast?.classList.remove( 'social-share__toast--visible' );
			setTimeout( () => {
				if ( this.toast ) {
					this.toast.hidden = true;
				}
			}, 300 ); // Wait for fade out animation
		}, 3000 );
	}

	/**
	 * Open share window/popup.
	 * @param url
	 */
	private openShareWindow( url: string ): void {
		if ( this.openInPopup ) {
			const width = 600;
			const height = 400;
			const left = ( window.innerWidth - width ) / 2 + window.screenX;
			const top = ( window.innerHeight - height ) / 2 + window.screenY;

			window.open(
				url,
				'share',
				`width=${ width },height=${ height },left=${ left },top=${ top },toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
			);
		} else {
			window.open( url, '_blank', 'noopener,noreferrer' );
		}
	}
}
