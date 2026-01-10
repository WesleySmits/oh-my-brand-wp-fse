/**
 * Stats Counter Block - View Script (Web Component)
 *
 * Animates numbers from 0 to target value using requestAnimationFrame.
 * Uses easeOutExpo for smooth deceleration effect.
 *
 * @package
 */

class OmbStatsCounter extends HTMLElement {
	#observer: IntersectionObserver | null = null;
	#hasAnimated = false;

	connectedCallback(): void {
		if ( this.dataset.animate === 'true' ) {
			this.#setupIntersectionObserver();
		} else {
			// No animation - show final values immediately.
			this.classList.add( 'is-visible' );
			this.#showFinalValues();
		}
	}

	disconnectedCallback(): void {
		this.#observer?.disconnect();
	}

	#setupIntersectionObserver(): void {
		// Respect reduced motion preference.
		if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
			this.classList.add( 'is-visible' );
			this.#showFinalValues();
			return;
		}

		this.#observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( entry.isIntersecting && ! this.#hasAnimated ) {
						this.#hasAnimated = true;
						this.#observer?.disconnect();
						this.#animateCounters();
					}
				} );
			},
			{ threshold: 0.2 }
		);
		this.#observer.observe( this );
	}

	#animateCounters(): void {
		const counters =
			this.querySelectorAll< HTMLElement >( '[data-counter]' );
		const duration = parseInt( this.dataset.duration || '2000', 10 );
		const startTime = performance.now();

		const animate = ( currentTime: number ): void => {
			const elapsed = currentTime - startTime;
			const progress = Math.min( elapsed / duration, 1 );

			// easeOutExpo for smooth deceleration.
			const eased =
				progress === 1 ? 1 : 1 - Math.pow( 2, -10 * progress );

			counters.forEach( ( counter ) => {
				const target = parseFloat( counter.dataset.target || '0' );
				const currentValue = target * eased;
				this.#updateCounterDisplay( counter, currentValue );
			} );

			if ( progress < 1 ) {
				requestAnimationFrame( animate );
			} else {
				this.classList.add( 'is-visible' );
			}
		};

		requestAnimationFrame( animate );
	}

	#updateCounterDisplay( counter: HTMLElement, value: number ): void {
		const isCurrency = counter.dataset.currency === 'true';
		const currencyCode = counter.dataset.currencyCode || 'USD';
		const locale = counter.dataset.locale || 'en-US';
		const decimals = parseInt( counter.dataset.decimals || '0', 10 );
		const suffix = counter.dataset.suffix || '';

		// Always show the correct number of decimals throughout animation.
		const formattedValue = this.#formatNumber(
			value,
			decimals,
			isCurrency,
			currencyCode,
			locale
		);
		counter.textContent = formattedValue + ( isCurrency ? '' : suffix );
	}

	#showFinalValues(): void {
		const counters =
			this.querySelectorAll< HTMLElement >( '[data-counter]' );

		counters.forEach( ( counter ) => {
			const value = parseFloat( counter.dataset.target || '0' );
			this.#updateCounterDisplay( counter, value );
		} );
	}

	#formatNumber(
		value: number,
		decimals: number,
		isCurrency: boolean,
		currencyCode: string,
		locale: string
	): string {
		if ( isCurrency ) {
			return new Intl.NumberFormat( locale, {
				style: 'currency',
				currency: currencyCode,
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			} ).format( value );
		}

		return new Intl.NumberFormat( locale, {
			style: 'decimal',
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		} ).format( value );
	}
}

if ( ! customElements.get( 'omb-stats-counter' ) ) {
	customElements.define( 'omb-stats-counter', OmbStatsCounter );
}
