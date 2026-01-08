/**
 * Banner Block - View Script
 *
 * Registers the BannerSection web component for frontend use.
 *
 * @package
 */

import { BannerSection } from './BannerSection';

// Ensure the component is registered
if (!customElements.get(BannerSection.tagName)) {
	customElements.define(BannerSection.tagName, BannerSection);
}
