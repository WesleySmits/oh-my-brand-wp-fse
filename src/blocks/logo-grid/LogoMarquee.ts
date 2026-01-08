/**
 * Logo Marquee Web Component
 *
 * Provides infinite horizontal scroll animation for logo grids.
 * Respects prefers-reduced-motion and supports pause-on-hover.
 *
 * @package
 */

type MarqueeSpeed = 'slow' | 'medium' | 'fast';
type MarqueeDirection = 'left' | 'right';

interface SpeedConfig {
	slow: number;
	medium: number;
	fast: number;
}

export class LogoMarquee extends HTMLElement {
	private static readonly SPEED_VALUES: SpeedConfig = {
		slow: 40,
		medium: 20,
		fast: 10
	};

	private static readonly OBSERVED_ATTRIBUTES = ['speed', 'direction', 'pause-on-hover'];

	/** Minimum number of logos required for marquee to activate */
	private static readonly MIN_LOGOS_FOR_MARQUEE = 4;

	private track: HTMLElement | null = null;
	private isInitialized = false;
	private prefersReducedMotion = false;

	static get observedAttributes(): string[] {
		return LogoMarquee.OBSERVED_ATTRIBUTES;
	}

	connectedCallback(): void {
		this.checkReducedMotion();
		this.setupMediaQueryListener();
		this.init();
	}

	disconnectedCallback(): void {
		this.cleanup();
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue || !this.isInitialized) {
			return;
		}

		switch (name) {
			case 'speed':
				this.updateAnimationDuration();
				break;
			case 'direction':
				this.updateAnimationDirection();
				break;
			case 'pause-on-hover':
				this.updatePauseOnHover();
				break;
		}
	}

	private checkReducedMotion(): void {
		this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	private setupMediaQueryListener(): void {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		mediaQuery.addEventListener('change', (e) => {
			this.prefersReducedMotion = e.matches;
			this.updateAnimationState();
		});
	}

	private init(): void {
		this.track = this.querySelector('.wp-block-theme-oh-my-brand-logo-grid__list');

		if (!this.track) {
			return;
		}

		// Skip marquee setup if not enough logos
		const hasEnoughLogos = this.duplicateLogos();
		if (!hasEnoughLogos) {
			return;
		}

		this.setupStyles();
		this.updateAnimationDuration();
		this.updateAnimationDirection();
		this.updatePauseOnHover();
		this.updateAnimationState();

		this.isInitialized = true;
	}

	private duplicateLogos(): boolean {
		if (!this.track) {
			return false;
		}

		const items = Array.from(this.track.children);

		// Don't activate marquee if there aren't enough logos
		if (items.length < LogoMarquee.MIN_LOGOS_FOR_MARQUEE) {
			return false;
		}

		// Clone items for seamless loop
		items.forEach((item) => {
			const clone = item.cloneNode(true) as HTMLElement;
			clone.setAttribute('aria-hidden', 'true');
			this.track?.appendChild(clone);
		});

		return true;
	}

	private setupStyles(): void {
		if (!this.track) {
			return;
		}

		// Add marquee-active class to track for CSS targeting
		this.track.classList.add('wp-block-theme-oh-my-brand-logo-grid__list--marquee-active');
	}

	private getSpeed(): MarqueeSpeed {
		const speed = this.getAttribute('speed') as MarqueeSpeed;
		return LogoMarquee.SPEED_VALUES[speed] ? speed : 'medium';
	}

	private getDirection(): MarqueeDirection {
		const direction = this.getAttribute('direction') as MarqueeDirection;
		return direction === 'right' ? 'right' : 'left';
	}

	private getPauseOnHover(): boolean {
		return this.getAttribute('pause-on-hover') !== 'false';
	}

	private updateAnimationDuration(): void {
		if (!this.track) {
			return;
		}

		const speed = this.getSpeed();
		const duration = LogoMarquee.SPEED_VALUES[speed];
		this.track.style.setProperty('--marquee-duration', `${duration}s`);
	}

	private updateAnimationDirection(): void {
		if (!this.track) {
			return;
		}

		const direction = this.getDirection();
		this.track.style.setProperty('--marquee-direction', direction === 'right' ? 'reverse' : 'normal');
	}

	private updatePauseOnHover(): void {
		if (!this.track) {
			return;
		}

		const pauseOnHover = this.getPauseOnHover();
		this.track.classList.toggle('wp-block-theme-oh-my-brand-logo-grid__list--pause-on-hover', pauseOnHover);
	}

	private updateAnimationState(): void {
		if (!this.track) {
			return;
		}

		if (this.prefersReducedMotion) {
			this.track.style.setProperty('--marquee-play-state', 'paused');
			this.track.classList.add('wp-block-theme-oh-my-brand-logo-grid__list--reduced-motion');
		} else {
			this.track.style.setProperty('--marquee-play-state', 'running');
			this.track.classList.remove('wp-block-theme-oh-my-brand-logo-grid__list--reduced-motion');
		}
	}

	private cleanup(): void {
		if (!this.track) {
			return;
		}

		// Remove cloned items
		const items = Array.from(this.track.children);
		items.forEach((item) => {
			if (item.getAttribute('aria-hidden') === 'true') {
				item.remove();
			}
		});

		// Reset styles
		this.track.classList.remove(
			'wp-block-theme-oh-my-brand-logo-grid__list--marquee-active',
			'wp-block-theme-oh-my-brand-logo-grid__list--pause-on-hover',
			'wp-block-theme-oh-my-brand-logo-grid__list--reduced-motion'
		);
		this.track.style.removeProperty('--marquee-duration');
		this.track.style.removeProperty('--marquee-direction');
		this.track.style.removeProperty('--marquee-play-state');

		this.isInitialized = false;
	}
}
