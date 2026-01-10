/**
 * Hero Section Web Component.
 *
 * Custom element: omb-hero
 *
 * Slots:
 * - Default slot for main content (heading, text, buttons)
 * - background: Slot for background media (image/video)
 *
 * Events:
 * - omb-hero:video-play: Fired when video starts playing
 * - omb-hero:video-pause: Fired when video is paused
 *
 * CSS Parts:
 * - container: The main container element
 * - background: The background wrapper
 * - overlay: The overlay element
 * - content: The content wrapper
 *
 * @package
 */
export class HeroSection extends HTMLElement {
	static readonly tagName = 'omb-hero';

	private video: HTMLVideoElement | null = null;
	private pauseButton: HTMLButtonElement | null = null;
	private intersectionObserver: IntersectionObserver | null = null;

	static get observedAttributes(): string[] {
		return [
			'min-height',
			'overlay-opacity',
			'content-align',
			'vertical-align',
		];
	}

	constructor() {
		super();
		this.attachShadow( { mode: 'open' } );
	}

	connectedCallback(): void {
		this.render();
		this.setupVideo();
		this.setupIntersectionObserver();
		this.setupVideoToggle();
	}

	disconnectedCallback(): void {
		this.intersectionObserver?.disconnect();
	}

	attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null
	): void {
		if ( oldValue === newValue ) {
			return;
		}
		this.updateStyles();
	}

	/**
	 * Play background video.
	 */
	public play(): void {
		this.video?.play();
		this.updateToggleState( false );
		this.dispatchEvent(
			new CustomEvent( 'omb-hero:video-play', { bubbles: true } )
		);
	}

	/**
	 * Pause background video.
	 */
	public pause(): void {
		this.video?.pause();
		this.updateToggleState( true );
		this.dispatchEvent(
			new CustomEvent( 'omb-hero:video-pause', { bubbles: true } )
		);
	}

	/**
	 * Toggle video play/pause state.
	 */
	public toggleVideo(): void {
		if ( this.video?.paused ) {
			this.play();
		} else {
			this.pause();
		}
	}

	private render(): void {
		if ( ! this.shadowRoot ) {
			return;
		}

		this.shadowRoot.innerHTML = `
            <style>${ this.getStyles() }</style>
            <section class="hero" part="container">
                <div class="hero__background" part="background">
                    <slot name="background"></slot>
                </div>
                <div class="hero__overlay" part="overlay"></div>
                <div class="hero__content" part="content">
                    <slot></slot>
                </div>
            </section>
        `;
	}

	private getStyles(): string {
		return `
            :host {
                --hero-min-height: 60vh;
                --hero-overlay-opacity: 0.5;
                --hero-padding-block: 4rem;
                --hero-padding-inline: 2rem;
                --hero-content-max-width: 800px;
                --hero-heading-size: clamp(2.5rem, 5vw, 4rem);
                --hero-text-color: #ffffff;
                --hero-transition: 300ms ease;

                display: block;
                position: relative;
            }

            .hero {
                position: relative;
                display: grid;
                place-items: center;
                min-height: var(--hero-min-height);
                padding-block: var(--hero-padding-block);
                padding-inline: var(--hero-padding-inline);
                color: var(--hero-text-color);
            }

            .hero__background {
                position: absolute;
                inset: 0;
                z-index: 0;
                overflow: hidden;
            }

            .hero__background ::slotted(img),
            .hero__background ::slotted(video) {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .hero__overlay {
                position: absolute;
                inset: 0;
                z-index: 1;
                background-color: rgba(0, 0, 0, var(--hero-overlay-opacity));
                pointer-events: none;
            }

            .hero__content {
                position: relative;
                z-index: 2;
                max-width: var(--hero-content-max-width);
                text-align: center;
            }

            /* Content alignment variations */
            :host([content-align="left"]) .hero__content {
                text-align: left;
                justify-self: start;
            }

            :host([content-align="right"]) .hero__content {
                text-align: right;
                justify-self: end;
            }

            /* Vertical alignment variations */
            :host([vertical-align="top"]) .hero {
                align-items: start;
            }

            :host([vertical-align="bottom"]) .hero {
                align-items: end;
            }

            /* Respect reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                .hero__background ::slotted(video) {
                    display: none;
                }
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
                :host {
                    --hero-min-height: 50vh;
                    --hero-padding-block: 2rem;
                    --hero-padding-inline: 1rem;
                }
            }
        `;
	}

	private setupVideo(): void {
		// Find video in slotted content
		const slot = this.shadowRoot?.querySelector(
			'slot[name="background"]'
		) as HTMLSlotElement | null;
		if ( ! slot ) {
			return;
		}

		const assignedElements = slot.assignedElements();
		this.video = assignedElements.find(
			( el ) => el.tagName === 'VIDEO'
		) as HTMLVideoElement | null;
	}

	private setupIntersectionObserver(): void {
		if ( ! this.video ) {
			return;
		}

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		if ( prefersReducedMotion ) {
			this.video.pause();
			return;
		}

		// Pause video when out of viewport for performance
		this.intersectionObserver = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( entry.isIntersecting ) {
						this.video?.play();
					} else {
						this.video?.pause();
					}
				} );
			},
			{ threshold: 0.1 }
		);

		this.intersectionObserver.observe( this );
	}

	private setupVideoToggle(): void {
		// Find toggle button in light DOM
		this.pauseButton = this.querySelector(
			'.wp-block-theme-oh-my-brand-hero__video-toggle'
		);
		if ( ! this.pauseButton || ! this.video ) {
			return;
		}

		this.pauseButton.addEventListener( 'click', () => this.toggleVideo() );
	}

	private updateToggleState( isPaused: boolean ): void {
		if ( ! this.pauseButton ) {
			return;
		}

		this.pauseButton.setAttribute(
			'aria-pressed',
			isPaused ? 'true' : 'false'
		);
		this.pauseButton.setAttribute(
			'aria-label',
			isPaused ? 'Play background video' : 'Pause background video'
		);
	}

	private updateStyles(): void {
		const minHeight = this.getAttribute( 'min-height' );
		const overlayOpacity = this.getAttribute( 'overlay-opacity' );

		if ( minHeight ) {
			this.style.setProperty( '--hero-min-height', minHeight );
		}
		if ( overlayOpacity ) {
			this.style.setProperty( '--hero-overlay-opacity', overlayOpacity );
		}
	}
}

// Register the custom element
if ( ! customElements.get( HeroSection.tagName ) ) {
	customElements.define( HeroSection.tagName, HeroSection );
}
