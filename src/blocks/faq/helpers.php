<?php
/**
 * FAQ Block - Helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'omb_generate_faq_json_ld' ) ) {
	/**
	 * Generate FAQ JSON-LD structured data.
	 *
	 * @param array<int, array{question: string, answer: string}> $faq_items FAQ items.
	 * @return string JSON-LD script tag.
	 */
	function omb_generate_faq_json_ld( array $faq_items ): string {
		if ( empty( $faq_items ) ) {
			return '';
		}

		$main_entity = [];

		foreach ( $faq_items as $item ) {
			if ( empty( $item['question'] ) || empty( $item['answer'] ) ) {
				continue;
			}

			$main_entity[] = [
				'@type'          => 'Question',
				'name'           => wp_strip_all_tags( $item['question'] ),
				'acceptedAnswer' => [
					'@type' => 'Answer',
					'text'  => wp_strip_all_tags( $item['answer'] ),
				],
			];
		}

		if ( empty( $main_entity ) ) {
			return '';
		}

		$json_ld = [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $main_entity,
		];

		return '<script type="application/ld+json">' . wp_json_encode( $json_ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';
	}
}
