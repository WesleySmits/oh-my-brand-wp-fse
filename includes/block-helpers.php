<?php
/**
 * Block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound
namespace OhMyBrand\Includes;

use function add_action;
use function register_block_type;

add_action( 'init', __NAMESPACE__ . '\\register_blocks' );

/**
 * Register native blocks from the theme.
 *
 * Automatically discovers and registers all blocks in the build/blocks directory
 * that contain a block.json file.
 *
 * @since 1.0.0
 *
 * @return void
 */
function register_blocks(): void {
	$blocks_dir = OMB_PATH . '/build/blocks';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

	if ( empty( $block_folders ) ) {
		return;
	}

	foreach ( $block_folders as $block_path ) {
		if ( file_exists( $block_path . '/block.json' ) ) {
			register_block_type( $block_path );
		}
	}
}

/**
 * Render a CTA button for blocks.
 *
 * Shared utility for rendering consistent CTA buttons across Hero, Banner,
 * and other blocks that need button functionality.
 *
 * @since 1.0.0
 *
 * @param array<string, mixed> $button      Button data with 'text', 'url', 'openInNewTab'.
 * @param string               $block_name  Block class name prefix (e.g., 'hero', 'banner').
 * @param string               $variant     Button variant: 'primary' or 'secondary'.
 * @return string HTML output.
 */
function render_block_button( array $button, string $block_name, string $variant = 'primary' ): string {
	if ( empty( $button['text'] ) || empty( $button['url'] ) ) {
		return '';
	}

	$class = sprintf(
		'wp-block-theme-oh-my-brand-%s__button wp-block-theme-oh-my-brand-%s__button--%s',
		esc_attr( $block_name ),
		esc_attr( $block_name ),
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

/**
 * Convert WordPress preset spacing values to actual CSS values.
 *
 * Converts values like 'var:preset|spacing|medium' to their actual CSS values
 * from theme.json or falls back to sensible defaults.
 *
 * @since 1.0.0
 *
 * @param string $preset_value The preset value from block settings.
 * @return string The resolved CSS value.
 */
function resolve_wp_preset( string $preset_value ): string {
	if ( ! str_contains( $preset_value, 'var:preset|spacing|' ) ) {
		return $preset_value;
	}

	static $theme_spacing = null;

	if ( null === $theme_spacing ) {
		// Read theme.json directly to get authentic values.
		$theme_json_path = OMB_PATH . '/theme.json';
		if ( file_exists( $theme_json_path ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			$theme_data    = wp_json_file_decode( $theme_json_path, [ 'associative' => true ] );
			$spacing_sizes = $theme_data['settings']['spacing']['spacingSizes'] ?? [];

			foreach ( $spacing_sizes as $size ) {
				if ( isset( $size['slug'], $size['size'] ) ) {
					$theme_spacing[ $size['slug'] ] = $size['size'];
				}
			}
		}
	}

	$preset_key = str_replace( 'var:preset|spacing|', '', $preset_value );

	// Fallback map if theme.json read fails or key missing.
	$fallback_presets = [
		'small'      => 'clamp(0.5rem, 2.5vw, 1rem)',
		'medium'     => 'clamp(1.5rem, 4vw, 2rem)',
		'large'      => 'clamp(2rem, 5vw, 3rem)',
		'x-large'    => 'clamp(3rem, 7vw, 5rem)',
		'xx-large'   => 'clamp(4rem, 9vw, 7rem)',
		'xxx-large'  => 'clamp(5rem, 12vw, 9rem)',
		'xxxx-large' => 'clamp(6rem, 14vw, 13rem)',
	];

	return $theme_spacing[ $preset_key ] ?? $fallback_presets[ $preset_key ] ?? '1rem';
}
