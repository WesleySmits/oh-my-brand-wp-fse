<?php
/**
 * Hero block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Render a hero CTA button.
 *
 * @param array<string, mixed> $button  Button data with 'text', 'url', 'openInNewTab'.
 * @param string               $variant Button variant: 'primary' or 'secondary'.
 * @return string HTML output.
 */
function omb_hero_render_button( array $button, string $variant ): string {
	if ( empty( $button['text'] ) || empty( $button['url'] ) ) {
		return '';
	}

	$class = sprintf(
		'wp-block-theme-oh-my-brand-hero__button wp-block-theme-oh-my-brand-hero__button--%s',
		esc_attr( $variant )
	);

	$target = ! empty( $button['openInNewTab'] ) ? ' target="_blank" rel="noopener noreferrer"' : '';

	return sprintf(
		'<a href="%s" class="%s"%s>%s</a>',
		esc_url( $button['url'] ),
		$class,
		$target,
		esc_html( $button['text'] )
	);
}
