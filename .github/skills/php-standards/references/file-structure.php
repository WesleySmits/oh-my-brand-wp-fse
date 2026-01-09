<?php
/**
 * PHP File Structure Example
 *
 * Demonstrates the standard file structure for PHP files
 * in the Oh My Brand! theme.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OhMyBrand\Blocks;

// Imports (use statements)
use WP_Block;
use WP_Post;

/**
 * Gallery block handler.
 *
 * Manages gallery block registration and rendering.
 *
 * @since 1.0.0
 */
class GalleryBlock {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	private string $name = 'theme-oh-my-brand/gallery';

	/**
	 * Default attributes.
	 *
	 * @var array<string, mixed>
	 */
	private array $defaults = [
		'images'   => [],
		'layout'   => 'grid',
		'lightbox' => true,
	];

	/**
	 * Renders the block.
	 *
	 * Takes an array of image IDs and renders them as a responsive
	 * gallery with lightbox functionality.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $attributes {
	 *     Block attributes.
	 *
	 *     @type array  $images     Array of image IDs.
	 *     @type string $layout     Gallery layout type.
	 *     @type bool   $lightbox   Whether to enable lightbox.
	 * }
	 * @param string               $content Block inner content.
	 * @param WP_Block             $block   Block instance.
	 * @return string Rendered HTML.
	 */
	public function render(
		array $attributes,
		string $content,
		WP_Block $block
	): string {
		$attributes = wp_parse_args( $attributes, $this->defaults );

		// Guard clause - no images
		if ( empty( $attributes['images'] ) ) {
			return '';
		}

		ob_start();
		// Render template...
		return ob_get_clean() ?: '';
	}
}
