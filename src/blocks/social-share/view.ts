/**
 * Social Share Block - View Script
 *
 * Registers the SocialShare web component for frontend use.
 *
 * @package
 */

import { SocialShare } from './SocialShare';

// Register custom element if not already defined
if (!customElements.get(SocialShare.tagName)) {
	customElements.define(SocialShare.tagName, SocialShare);
}
