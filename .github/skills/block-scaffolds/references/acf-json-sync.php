<?php
/**
 * ACF JSON sync configuration.
 *
 * Add this to functions.php to enable ACF local JSON sync.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_filter( 'acf/settings/save_json', 'omb_acf_json_save_path' );

/**
 * Set ACF JSON save path.
 *
 * @param string $path Default save path.
 * @return string Custom save path.
 */
function omb_acf_json_save_path( string $path ): string {
	return OMB_PATH . '/acf-json';
}

add_filter( 'acf/settings/load_json', 'omb_acf_json_load_paths' );

/**
 * Set ACF JSON load paths.
 *
 * @param array<string> $paths Default load paths.
 * @return array<string> Custom load paths.
 */
function omb_acf_json_load_paths( array $paths ): array {
	// Remove default path.
	unset( $paths[0] );

	// Add theme path.
	$paths[] = OMB_PATH . '/acf-json';

	return $paths;
}
