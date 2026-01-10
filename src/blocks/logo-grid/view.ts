/**
 * Logo Grid View Script
 *
 * Registers the LogoMarquee web component for frontend use.
 *
 * @package
 */

import { LogoMarquee } from './LogoMarquee';

// Register the custom element if not already defined
if ( ! customElements.get( 'omb-logo-marquee' ) ) {
	customElements.define( 'omb-logo-marquee', LogoMarquee );
}
