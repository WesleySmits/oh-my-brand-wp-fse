<?php
/**
 * Gallery Block - Helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'omb_gallery_get_block_gap' ) ) {
	/**
	 * Get the block gap value from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string CSS gap value or empty string.
	 */
	function omb_gallery_get_block_gap( array $attributes ): string {
		if ( ! isset( $attributes['style']['spacing']['blockGap'] ) ) {
			return '';
		}

		$gap_value = $attributes['style']['spacing']['blockGap'];

		// Handle preset values.
		if ( strpos( $gap_value, 'var:preset|spacing|' ) === 0 ) {
			$preset = str_replace( 'var:preset|spacing|', '', $gap_value );
			return "var(--wp--preset--spacing--{$preset})";
		}

		return $gap_value;
	}
}

if ( ! function_exists( 'omb_gallery_build_style' ) ) {
	/**
	 * Build the inline style string for the gallery.
	 *
	 * @param int    $visible_images Number of visible images.
	 * @param string $block_gap      CSS gap value.
	 * @return string Inline style string.
	 */
	function omb_gallery_build_style( int $visible_images, string $block_gap ): string {
		$style = '--visible-images: ' . esc_attr( (string) $visible_images ) . ';';

		if ( $block_gap ) {
			$style .= ' --acf-block-gap: ' . esc_attr( $block_gap ) . ';';
		}

		return $style;
	}
}

if ( ! function_exists( 'omb_gallery_generate_schema' ) ) {
	/**
	 * Generate ImageGallery JSON-LD schema for SEO.
	 *
	 * @see https://schema.org/ImageGallery
	 *
	 * @param array<int, array<string, mixed>> $images     Array of image data.
	 * @param string                           $gallery_id Unique gallery identifier.
	 * @return string JSON-LD script tag or empty string.
	 */
	function omb_gallery_generate_schema( array $images, string $gallery_id = '' ): string {
		if ( empty( $images ) ) {
			return '';
		}

		$schema = [
			'@context'        => 'https://schema.org',
			'@type'           => 'ImageGallery',
			'@id'             => $gallery_id ? "#{$gallery_id}" : '#gallery-' . uniqid(),
			'name'            => get_the_title() . ' - ' . __( 'Image Gallery', 'theme-oh-my-brand' ),
			'numberOfItems'   => count( $images ),
			'associatedMedia' => [],
		];

		foreach ( $images as $index => $image ) {
			$image_url     = $image['fullUrl'] ?? $image['url'] ?? '';
			$image_alt     = $image['alt'] ?? '';
			$image_caption = $image['caption'] ?? '';

			if ( empty( $image_url ) ) {
				continue;
			}

			$media_item = [
				'@type'       => 'ImageObject',
				'contentUrl'  => esc_url( $image_url ),
				'position'    => $index + 1,
			];

			if ( ! empty( $image_alt ) ) {
				$media_item['name'] = esc_html( $image_alt );
			}

			if ( ! empty( $image_caption ) ) {
				$media_item['caption'] = esc_html( $image_caption );
			}

			// Get image dimensions if we have an attachment ID.
			if ( ! empty( $image['id'] ) ) {
				$image_meta = wp_get_attachment_metadata( $image['id'] );
				if ( $image_meta && isset( $image_meta['width'], $image_meta['height'] ) ) {
					$media_item['width']  = $image_meta['width'];
					$media_item['height'] = $image_meta['height'];
				}
			}

			$schema['associatedMedia'][] = $media_item;
		}

		return sprintf(
			'<script type="application/ld+json">%s</script>',
			wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
		);
	}
}
