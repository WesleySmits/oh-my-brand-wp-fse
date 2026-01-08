<?php
/**
 * Custom image controls and modifications.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_filter( 'render_block', 'omb_add_lazy_loading_to_images', 10, 2 );

/**
 * Add lazy loading attribute to Gutenberg images.
 *
 * @since 1.0.0
 *
 * @param string               $block_content The block content.
 * @param array<string, mixed> $block         The block data.
 * @return string Modified block content.
 */
function omb_add_lazy_loading_to_images( string $block_content, array $block ): string {
	if ( is_admin() || empty( $block_content ) ) {
		return $block_content;
	}

	$processor = new WP_HTML_Tag_Processor( $block_content );

	while ( $processor->next_tag( 'img' ) ) {
		if ( ! $processor->get_attribute( 'loading' ) ) {
			$processor->set_attribute( 'loading', 'lazy' );
		}
	}

	return $processor->get_updated_html();
}
