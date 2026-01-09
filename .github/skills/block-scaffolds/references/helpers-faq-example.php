<?php
/**
 * FAQ Block - Helper functions.
 *
 * Full example of ACF block helpers with:
 * - Data retrieval and transformation
 * - JSON-LD schema generation
 * - Type hints and DocBlocks
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'get_faq_data' ) ) {
	/**
	 * Get FAQ data from ACF fields.
	 *
	 * @param int|null $post_id Post ID (defaults to current post).
	 * @return array<int, array{question: string, answer: string}> FAQ items.
	 */
	function get_faq_data( ?int $post_id = null ): array {
		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		if ( ! function_exists( 'get_field' ) ) {
			return [];
		}

		// Get ACF repeater field.
		$raw_items = get_field( 'faq', $post_id ) ?: [];

		// Transform to consistent format.
		return array_map(
			function ( array $item ): array {
				return [
					'question' => trim( $item['question'] ?? $item['vraag'] ?? '' ),
					'answer'   => trim( $item['answer'] ?? $item['antwoord'] ?? '' ),
				];
			},
			$raw_items
		);
	}
}

if ( ! function_exists( 'generate_faq_json_ld' ) ) {
	/**
	 * Generate FAQPage JSON-LD schema for SEO.
	 *
	 * @see https://schema.org/FAQPage
	 *
	 * @param array<int, array{question: string, answer: string}> $faq_items FAQ items.
	 * @return string JSON-LD markup.
	 */
	function generate_faq_json_ld( array $faq_items ): string {
		if ( empty( $faq_items ) ) {
			return '';
		}

		$main_entity = array_map(
			function ( array $item ): array {
				return [
					'@type'          => 'Question',
					'name'           => esc_html( $item['question'] ),
					'acceptedAnswer' => [
						'@type' => 'Answer',
						'text'  => esc_html( $item['answer'] ),
					],
				];
			},
			$faq_items
		);

		$schema = [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $main_entity,
		];

		return wp_json_encode(
			$schema,
			JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
		);
	}
}
