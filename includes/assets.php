<?php
/**
 * Asset registration and enqueuing.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_action( 'wp_enqueue_scripts', 'omb_enqueue_styles' );

/**
 * Enqueue theme stylesheets.
 *
 * @since 1.0.0
 *
 * @return void
 */
function omb_enqueue_styles(): void {
	wp_enqueue_style(
		'omb-parent-style',
		get_template_directory_uri() . '/style.css',
		[],
		wp_get_theme( 'ollie' )->get( 'Version' )
	);

	wp_enqueue_style(
		'omb-style',
		get_stylesheet_uri(),
		[ 'omb-parent-style' ],
		OMB_VERSION
	);

	$theme_css_path = OMB_PATH . '/assets/css/theme.css';
	if ( file_exists( $theme_css_path ) ) {
		wp_enqueue_style(
			'omb-theme',
			OMB_URI . '/assets/css/theme.css',
			[ 'omb-style' ],
			(string) filemtime( $theme_css_path )
		);
	}
}

add_action( 'init', 'omb_disable_emojis' );

/**
 * Disable WordPress emoji scripts and styles for performance.
 *
 * @since 1.0.0
 *
 * @return void
 */
function omb_disable_emojis(): void {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );

	add_filter( 'tiny_mce_plugins', 'omb_disable_emojis_tinymce' );
	add_filter( 'wp_resource_hints', 'omb_disable_emojis_dns_prefetch', 10, 2 );
}

/**
 * Remove emoji plugin from TinyMCE.
 *
 * @since 1.0.0
 *
 * @param array<int, string> $plugins TinyMCE plugins.
 * @return array<int, string> Filtered plugins.
 */
function omb_disable_emojis_tinymce( array $plugins ): array {
	return array_diff( $plugins, [ 'wpemoji' ] );
}

/**
 * Remove emoji DNS prefetch.
 *
 * @since 1.0.0
 *
 * @param array<int, string> $urls          URLs to prefetch.
 * @param string             $relation_type Relation type.
 * @return array<int, string> Filtered URLs.
 */
function omb_disable_emojis_dns_prefetch( array $urls, string $relation_type ): array {
	if ( 'dns-prefetch' !== $relation_type ) {
		return $urls;
	}

	$emoji_url = 'https://s.w.org/images/core/emoji/';
	return array_filter(
		$urls,
		fn( $url ): bool => ! str_contains( (string) $url, $emoji_url )
	);
}
