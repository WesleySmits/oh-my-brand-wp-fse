/**
 * Banner Section Web Component
 *
 * Encapsulates the layout logic for the banner block with Shadow DOM.
 *
 * @package
 */

/**
 * Custom element for banner sections with side-by-side image/content layout.
 */
export class BannerSection extends HTMLElement {
	static readonly tagName = 'omb-banner';

	/**
	 * Observed attributes that trigger attributeChangedCallback.
	 */
	static get observedAttributes(): string[] {
		return ['image-position', 'image-size', 'vertical-align', 'mobile-stack', 'image-fit'];
	}

	/**
	 * Initialize the component with Shadow DOM.
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * Called when the element is added to the DOM.
	 */
	connectedCallback(): void {
		this.render();
	}

	/**
	 * Called when an observed attribute changes.
	 *
	 * @param _name    - Attribute name
	 * @param oldValue - Previous value
	 * @param newValue - New value
	 */
	attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		this.updateLayout();
	}

	/**
	 * Render the component's Shadow DOM content.
	 */
	private render(): void {
		if (!this.shadowRoot) {
			return;
		}

		this.shadowRoot.innerHTML = `
			<style>${this.getStyles()}</style>
			<div class="banner" part="container">
				<div class="banner__image" part="image-wrapper">
					<slot name="image"></slot>
				</div>
				<div class="banner__content" part="content">
					<slot></slot>
				</div>
			</div>
		`;
	}

	/**
	 * Get the component's internal styles.
	 */
	private getStyles(): string {
		return `
			:host {
				--banner-gap: 2rem;
				--banner-padding-block: 4rem;
				--banner-padding-inline: 2rem;
				--banner-content-max-width: 600px;
				--banner-image-size: 50%;
				--banner-border-radius: 0.5rem;

				display: block;
			}

			.banner {
				display: grid;
				grid-template-columns: var(--banner-image-size) 1fr;
				gap: var(--banner-gap);
				padding-block: var(--banner-padding-block);
				padding-inline: var(--banner-padding-inline);
				align-items: center;
			}

			/* Image position: right */
			:host([image-position="right"]) .banner {
				grid-template-columns: 1fr var(--banner-image-size);
			}

			:host([image-position="right"]) .banner__image {
				order: 2;
			}

			:host([image-position="right"]) .banner__content {
				order: 1;
			}

			/* Image size variations */
			:host([image-size="33"]) {
				--banner-image-size: 33.333%;
			}

			:host([image-size="50"]) {
				--banner-image-size: 50%;
			}

			:host([image-size="66"]) {
				--banner-image-size: 66.666%;
			}

			/* Vertical alignment */
			:host([vertical-align="top"]) .banner {
				align-items: start;
			}

			:host([vertical-align="center"]) .banner {
				align-items: center;
			}

			:host([vertical-align="bottom"]) .banner {
				align-items: end;
			}

			/* Image wrapper */
			.banner__image {
				position: relative;
				overflow: hidden;
				border-radius: var(--banner-border-radius);
			}

			.banner__image ::slotted(img) {
				display: block;
				width: 100%;
				height: auto;
				object-fit: cover;
			}

			/* Image fit variations */
			:host([image-fit="contain"]) .banner__image ::slotted(img) {
				object-fit: contain;
			}

			:host([image-fit="fill"]) .banner__image ::slotted(img) {
				object-fit: fill;
			}

			/* Content wrapper */
			.banner__content {
				max-width: var(--banner-content-max-width);
			}

			:host([image-position="right"]) .banner__content {
				justify-self: end;
				text-align: left;
			}

			/* Mobile: Stack vertically */
			@media (max-width: 768px) {
				.banner {
					grid-template-columns: 1fr;
				}

				:host([image-position="right"]) .banner {
					grid-template-columns: 1fr;
				}

				.banner__image,
				.banner__content {
					order: unset;
				}

				:host([mobile-stack="content-first"]) .banner__image {
					order: 2;
				}

				:host([mobile-stack="content-first"]) .banner__content {
					order: 1;
				}

				.banner__content {
					max-width: none;
					text-align: left;
				}

				:host([image-position="right"]) .banner__content {
					justify-self: start;
				}
			}
		`;
	}

	/**
	 * Update layout when attributes change.
	 * Currently handled by CSS attribute selectors, but can be extended.
	 */
	private updateLayout(): void {
		// Layout updates are handled by CSS attribute selectors
		// This method can be extended for more complex updates
	}
}

// Register the custom element
if (!customElements.get(BannerSection.tagName)) {
	customElements.define(BannerSection.tagName, BannerSection);
}
