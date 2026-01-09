<?php
/**
 * BLOCK_TITLE - Helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'omb_BLOCK_NAME_get_block_gap' ) ) {
	/**
	 * Get block gap from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string CSS gap value or empty string.
	 */
	function omb_BLOCK_NAME_get_block_gap( array $attributes ): string {
		if ( ! isset( $attributes['style']['spacing']['blockGap'] ) ) {
			return '';
		}

		$gap_value = $attributes['style']['spacing']['blockGap'];

		if ( strpos( $gap_value, 'var:preset|spacing|' ) === 0 ) {
			$preset = str_replace( 'var:preset|spacing|', '', $gap_value );
			return "var(--wp--preset--spacing--{$preset})";
		}

		return $gap_value;
	}
}
