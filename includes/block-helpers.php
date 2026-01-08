<?php
/**
 * Block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

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
function omb_resolve_wp_preset( string $preset_value ): string {
	if ( ! str_contains( $preset_value, 'var:preset|spacing|' ) ) {
		return $preset_value;
	}

	$spacing_presets = [
		'small'      => 'clamp(0.5rem, 2.5vw, 1rem)',
		'medium'     => 'clamp(1.5rem, 4vw, 2rem)',
		'large'      => 'clamp(2rem, 5vw, 3rem)',
		'x-large'    => 'clamp(3rem, 7vw, 5rem)',
		'xx-large'   => 'clamp(4rem, 9vw, 7rem)',
		'xxx-large'  => 'clamp(5rem, 12vw, 9rem)',
		'xxxx-large' => 'clamp(6rem, 14vw, 13rem)',
	];

	$preset_key = str_replace( 'var:preset|spacing|', '', $preset_value );

	return $spacing_presets[ $preset_key ] ?? '1rem';
}
