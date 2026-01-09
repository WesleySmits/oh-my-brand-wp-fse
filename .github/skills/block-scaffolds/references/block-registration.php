<?php
/**
 * Register ACF blocks.
 *
 * Add this to functions.php to register ACF blocks from block.json files.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_action( 'init', 'omb_register_acf_blocks' );

/**
 * Register ACF blocks from the blocks directory.
 *
 * @return void
 */
function omb_register_acf_blocks(): void {
	// Check if ACF is active.
	if ( ! function_exists( 'acf_register_block_type' ) ) {
		return;
	}

	// List of ACF blocks to register.
	$acf_blocks = [
		'acf-faq',
		'acf-gallery-block',
		'acf-youtube-block',
	];

	foreach ( $acf_blocks as $block ) {
		$block_path = OMB_PATH . '/blocks/' . $block;

		if ( file_exists( $block_path . '/block.json' ) ) {
			register_block_type( $block_path );
		}
	}
}
