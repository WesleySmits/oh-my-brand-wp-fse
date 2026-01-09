<?php
/**
 * WordPress Hooks Examples
 *
 * Demonstrates proper hook registration and custom hook creation.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// ==========================================================================
// Registering Actions
// ==========================================================================

// Theme setup
add_action( 'after_setup_theme', 'omb_setup_theme' );

function omb_setup_theme(): void {
	// Add theme supports
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );

	// Load text domain
	load_theme_textdomain( 'theme-oh-my-brand', get_template_directory() . '/languages' );
}

// Block registration
add_action( 'init', 'omb_register_blocks' );

function omb_register_blocks(): void {
	register_block_type( __DIR__ . '/blocks/gallery' );
}

// Enqueue assets
add_action( 'wp_enqueue_scripts', 'omb_enqueue_assets' );

function omb_enqueue_assets(): void {
	wp_enqueue_style(
		'omb-styles',
		get_stylesheet_directory_uri() . '/assets/css/theme.css',
		[],
		OMB_VERSION
	);
}

// ==========================================================================
// Registering Filters
// ==========================================================================

// Add body classes
add_filter( 'body_class', 'omb_add_body_classes' );

/**
 * Add custom body classes.
 *
 * @param string[] $classes Existing body classes.
 * @return string[] Modified body classes.
 */
function omb_add_body_classes( array $classes ): array {
	if ( is_front_page() ) {
		$classes[] = 'omb-front-page';
	}

	return $classes;
}

// Filter block attributes
add_filter( 'render_block_data', 'omb_filter_block_data', 10, 3 );

/**
 * Filter block data before rendering.
 *
 * @param array    $parsed_block Parsed block data.
 * @param array    $source_block Source block from post content.
 * @param WP_Block $parent_block Parent block (if nested).
 * @return array Modified parsed block.
 */
function omb_filter_block_data(
	array $parsed_block,
	array $source_block,
	?WP_Block $parent_block
): array {
	// Modify block data...
	return $parsed_block;
}

// ==========================================================================
// Hook Priority
// ==========================================================================

// Earlier execution (lower number)
add_action( 'init', 'omb_early_init', 5 );

// Default priority (10)
add_action( 'init', 'omb_normal_init' );

// Later execution (higher number)
add_action( 'init', 'omb_late_init', 20 );

// ==========================================================================
// Custom Actions
// ==========================================================================

/**
 * Fire action before gallery renders.
 *
 * @param int $gallery_id Gallery ID.
 */
function omb_render_gallery( int $gallery_id ): void {
	// Allow other code to run before rendering
	do_action( 'omb_before_gallery_render', $gallery_id );

	// Render gallery...
	$images = get_gallery_images( $gallery_id );

	// Allow other code to run after rendering
	do_action( 'omb_after_gallery_render', $gallery_id, $images );
}

// ==========================================================================
// Custom Filters
// ==========================================================================

/**
 * Get gallery images with filtering.
 *
 * @param int $gallery_id Gallery ID.
 * @return array Image data.
 */
function get_gallery_images( int $gallery_id ): array {
	$images = []; // Get images from database...

	/**
	 * Filter gallery images before display.
	 *
	 * @param array $images     Array of image data.
	 * @param int   $gallery_id Gallery ID.
	 */
	return apply_filters( 'omb_gallery_images', $images, $gallery_id );
}

/**
 * Filter block attributes.
 *
 * @param array  $attributes Block attributes.
 * @param string $block_name Block name.
 * @return array Modified attributes.
 */
function get_block_attributes( array $attributes, string $block_name ): array {
	/**
	 * Filter block attributes before rendering.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $block_name Block name.
	 */
	return apply_filters( 'omb_block_attributes', $attributes, $block_name );
}
