<?php
/**
 * BLOCK_TITLE - Helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'get_BLOCK_NAME_data' ) ) {
	/**
	 * Get BLOCK_NAME data from ACF fields.
	 *
	 * @param int|null $post_id Post ID.
	 * @return array<int, array<string, mixed>> Items.
	 */
	function get_BLOCK_NAME_data( ?int $post_id = null ): array {
		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		if ( ! function_exists( 'get_field' ) ) {
			return [];
		}

		$raw_items = get_field( 'FIELD_NAME', $post_id ) ?: [];

		return array_map(
			function ( array $item ): array {
				return [
					'key' => $item['field_key'] ?? '',
				];
			},
			$raw_items
		);
	}
}
