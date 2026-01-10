<?php
/**
 * Oh My Brand! theme functions and definitions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// ==========================================================================
// Constants
// ==========================================================================

define( 'OMB_VERSION', '1.0.0' );
define( 'OMB_PATH', get_stylesheet_directory() );
define( 'OMB_URI', get_stylesheet_directory_uri() );

// ==========================================================================
// Includes
// ==========================================================================

$omb_includes = [
	'includes/assets.php',
	'includes/custom-image-controls.php',
	'includes/block-helpers.php',
	'includes/post-types/social-links.php',
	'includes/rest-api/logo-grid-endpoints.php',
];

foreach ( $omb_includes as $omb_file ) {
	$omb_filepath = OMB_PATH . '/' . $omb_file;
	if ( file_exists( $omb_filepath ) ) {
		require_once $omb_filepath;
	}
}

// ==========================================================================
// Theme Setup
// ==========================================================================

add_action( 'after_setup_theme', 'omb_setup_theme' );

/**
 * Sets up theme defaults and registers support for WordPress features.
 *
 * @since 1.0.0
 *
 * @return void
 */
function omb_setup_theme(): void {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'html5',
		[
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		]
	);

	// Load individual CSS files instead of theme.css with @imports.
	// This avoids broken relative paths in the block editor.
	add_editor_style( 'assets/css/base.css' );
	add_editor_style( 'assets/css/layout.css' );
	add_editor_style( 'assets/css/typography.css' );
	add_editor_style( 'assets/css/buttons.css' );
	add_editor_style( 'assets/css/components.css' );
	add_editor_style( 'assets/css/media.css' );
	add_editor_style( 'assets/css/utils.css' );
}

// ==========================================================================
// ACF JSON Configuration
// ==========================================================================

add_filter( 'acf/settings/save_json', 'omb_acf_json_save_path' );

/**
 * Set ACF JSON save path to theme's acf-json folder.
 *
 * @since 1.0.0
 *
 * @param string $path Default ACF JSON save path.
 * @return string Modified save path.
 */
function omb_acf_json_save_path( string $path ): string {
	return OMB_PATH . '/acf-json';
}

add_filter( 'acf/settings/load_json', 'omb_acf_json_load_paths' );

/**
 * Add theme's acf-json folder to ACF JSON load paths.
 *
 * @since 1.0.0
 *
 * @param array<int, string> $paths Default ACF JSON load paths.
 * @return array<int, string> Modified load paths.
 */
function omb_acf_json_load_paths( array $paths ): array {
	$paths[] = OMB_PATH . '/acf-json';
	return $paths;
}
