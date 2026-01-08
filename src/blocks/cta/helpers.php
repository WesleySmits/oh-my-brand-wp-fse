<?php
/**
 * CTA block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Render a CTA button.
 *
 * Uses the shared omb_render_block_button() utility for consistent button rendering.
 *
 * @param array<string, mixed> $button  Button data with 'text', 'url', 'openInNewTab'.
 * @param string               $variant Button variant: 'primary' or 'secondary'.
 * @return string HTML output.
 */
function omb_cta_render_button( array $button, string $variant = 'primary' ): string {
	return omb_render_block_button( $button, 'cta', $variant );
}
