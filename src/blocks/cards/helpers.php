<?php
/**
 * Cards Grid Block - Helper Functions
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'omb_cards_render_card' ) ) {
	/**
	 * Render a single card item.
	 *
	 * @param array<string, mixed> $card           Card data.
	 * @param int                  $index          Card index.
	 * @param bool                 $show_images    Whether to show images.
	 * @param bool                 $show_icons     Whether to show icons.
	 * @param string               $image_position Image position (top, left, background).
	 * @return string Rendered card HTML.
	 */
	function omb_cards_render_card(
		array $card,
		int $index,
		bool $show_images,
		bool $show_icons,
		string $image_position
	): string {
		$title       = $card['title'] ?? '';
		$description = $card['description'] ?? '';
		$image       = $card['image'] ?? null;
		$icon        = $card['icon'] ?? '';
		$link        = $card['link'] ?? null;

		// Return empty if no content.
		if ( empty( $title ) && empty( $description ) ) {
			return '';
		}

		ob_start();
		?>
		<li class="wp-block-theme-oh-my-brand-cards__item">
			<article class="wp-block-theme-oh-my-brand-cards__card">
				<?php if ( $show_images && ! empty( $image ) ) : ?>
					<?php echo omb_cards_render_image( $image, $image_position ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Function returns escaped HTML. ?>
				<?php endif; ?>

				<?php if ( $show_icons && ! empty( $icon ) ) : ?>
					<div class="wp-block-theme-oh-my-brand-cards__icon" aria-hidden="true">
						<?php echo esc_html( $icon ); ?>
					</div>
				<?php endif; ?>

				<div class="wp-block-theme-oh-my-brand-cards__content">
					<?php if ( ! empty( $title ) ) : ?>
						<h3 class="wp-block-theme-oh-my-brand-cards__card-title">
							<?php echo wp_kses_post( $title ); ?>
						</h3>
					<?php endif; ?>

					<?php if ( ! empty( $description ) ) : ?>
						<p class="wp-block-theme-oh-my-brand-cards__card-description">
							<?php echo wp_kses_post( $description ); ?>
						</p>
					<?php endif; ?>

					<?php if ( ! empty( $link ) && ! empty( $link['url'] ) ) : ?>
						<?php echo omb_cards_render_link( $link ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Function returns escaped HTML. ?>
					<?php endif; ?>
				</div>
			</article>
		</li>
		<?php
		return ob_get_clean();
	}
}

if ( ! function_exists( 'omb_cards_render_image' ) ) {
	/**
	 * Render card image.
	 *
	 * @param array<string, mixed> $image          Image data with id, url, alt.
	 * @param string               $image_position Image position for class modifier.
	 * @return string Rendered image HTML.
	 */
	function omb_cards_render_image( array $image, string $image_position ): string {
		$url = $image['url'] ?? '';
		$alt = $image['alt'] ?? '';

		if ( empty( $url ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="wp-block-theme-oh-my-brand-cards__image-wrapper wp-block-theme-oh-my-brand-cards__image-wrapper--<?php echo esc_attr( $image_position ); ?>">
			<img
				class="wp-block-theme-oh-my-brand-cards__image"
				src="<?php echo esc_url( $url ); ?>"
				alt="<?php echo esc_attr( $alt ); ?>"
				loading="lazy"
				decoding="async"
			>
		</div>
		<?php
		return ob_get_clean();
	}
}

if ( ! function_exists( 'omb_cards_render_link' ) ) {
	/**
	 * Render card link.
	 *
	 * @param array<string, mixed> $link Link data with url, text, openInNewTab.
	 * @return string Rendered link HTML.
	 */
	function omb_cards_render_link( array $link ): string {
		$url          = $link['url'] ?? '';
		$text         = $link['text'] ?? __( 'Learn More', 'oh-my-brand' );
		$open_new_tab = $link['openInNewTab'] ?? false;

		if ( empty( $url ) ) {
			return '';
		}

		$target_attr = $open_new_tab ? ' target="_blank" rel="noopener noreferrer"' : '';

		ob_start();
		?>
		<a
			class="wp-block-theme-oh-my-brand-cards__link"
			href="<?php echo esc_url( $url ); ?>"
			<?php echo $target_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Contains only safe attributes. ?>
		>
			<?php echo esc_html( $text ); ?>
			<span class="wp-block-theme-oh-my-brand-cards__link-arrow" aria-hidden="true">→</span>
		</a>
		<?php
		return ob_get_clean();
	}
}

if ( ! function_exists( 'omb_cards_get_card_classes' ) ) {
	/**
	 * Get card CSS classes based on attributes.
	 *
	 * @param string $style           Card style (elevated, outlined, flat).
	 * @param string $alignment       Content alignment (left, center).
	 * @param string $image_position  Image position (top, left, background).
	 * @param bool   $equal_height    Whether cards should have equal height.
	 * @return array<int, string> Array of CSS classes.
	 */
	function omb_cards_get_card_classes(
		string $style,
		string $alignment,
		string $image_position,
		bool $equal_height
	): array {
		$classes = [
			'wp-block-theme-oh-my-brand-cards',
			'wp-block-theme-oh-my-brand-cards--style-' . $style,
			'wp-block-theme-oh-my-brand-cards--align-' . $alignment,
			'wp-block-theme-oh-my-brand-cards--image-' . $image_position,
		];

		if ( $equal_height ) {
			$classes[] = 'wp-block-theme-oh-my-brand-cards--equal-height';
		}

		return $classes;
	}
}
