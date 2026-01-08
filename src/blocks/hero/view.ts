/**
 * Hero Block - Frontend Script
 *
 * Registers the HeroSection web component for frontend use.
 *
 * @package
 */

import { HeroSection } from './HeroSection';

// Ensure component is registered
if (!customElements.get(HeroSection.tagName)) {
	customElements.define(HeroSection.tagName, HeroSection);
}
