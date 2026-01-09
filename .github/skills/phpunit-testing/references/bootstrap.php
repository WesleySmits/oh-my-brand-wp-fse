<?php
/**
 * PHPUnit bootstrap file.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// Load Composer autoloader
require_once dirname( __DIR__, 2 ) . '/vendor/autoload.php';

// Define test constants
define( 'OMB_PATH', dirname( __DIR__, 2 ) );
define( 'OMB_URI', 'http://localhost/wp-content/themes/oh-my-brand' );
define( 'OMB_VERSION', '1.0.0-test' );

// Mock WordPress escaping functions
if ( ! function_exists( 'esc_html' ) ) {
	function esc_html( string $text ): string {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( string $text ): string {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_url' ) ) {
	function esc_url( string $url ): string {
		return filter_var( $url, FILTER_SANITIZE_URL ) ?: '';
	}
}

if ( ! function_exists( 'wp_kses_post' ) ) {
	function wp_kses_post( string $content ): string {
		return strip_tags( $content, '<p><br><strong><em><a><ul><ol><li>' );
	}
}

// Mock translation functions
if ( ! function_exists( '__' ) ) {
	function __( string $text, string $domain = 'default' ): string {
		return $text;
	}
}

if ( ! function_exists( 'esc_html__' ) ) {
	function esc_html__( string $text, string $domain = 'default' ): string {
		return esc_html( $text );
	}
}

if ( ! function_exists( 'esc_attr__' ) ) {
	function esc_attr__( string $text, string $domain = 'default' ): string {
		return esc_attr( $text );
	}
}

// Mock JSON encoding
if ( ! function_exists( 'wp_json_encode' ) ) {
	function wp_json_encode( $data, int $options = 0, int $depth = 512 ): string|false {
		return json_encode( $data, $options, $depth );
	}
}

// Mock post functions
if ( ! function_exists( 'get_the_ID' ) ) {
	function get_the_ID(): int {
		return 1;
	}
}

if ( ! function_exists( 'get_the_title' ) ) {
	function get_the_title(): string {
		return 'Test Post Title';
	}
}

// Mock block wrapper attributes
if ( ! function_exists( 'get_block_wrapper_attributes' ) ) {
	function get_block_wrapper_attributes( array $attributes = [] ): string {
		$class = $attributes['class'] ?? '';
		$id    = $attributes['id'] ?? '';

		$output = 'class="' . esc_attr( $class ) . '"';
		if ( $id ) {
			$output .= ' id="' . esc_attr( $id ) . '"';
		}

		return $output;
	}
}

// Mock wp_unique_id
if ( ! function_exists( 'wp_unique_id' ) ) {
	function wp_unique_id( string $prefix = '' ): string {
		static $counter = 0;
		return $prefix . ++$counter;
	}
}

// Mock is_admin
if ( ! function_exists( 'is_admin' ) ) {
	function is_admin(): bool {
		return false;
	}
}

// Mock wp_doing_ajax
if ( ! function_exists( 'wp_doing_ajax' ) ) {
	function wp_doing_ajax(): bool {
		return false;
	}
}
