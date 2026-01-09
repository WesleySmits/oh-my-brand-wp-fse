<?php
/**
 * Cards Grid Block - Server-side Rendering
 *
 * @package theme-oh-my-brand
 *
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Block inner HTML.
 * @var WP_Block             $block      Block instance.
 */

declare(strict_types=1);

// Include helper functions.
require_once __DIR__ . '/helpers.php';

// Extract attributes with defaults.
$omb_heading           = $attributes['heading'] ?? '';
$omb_heading_level     = $attributes['headingLevel'] ?? 'h2';
$omb_description       = $attributes['description'] ?? '';
$omb_cards             = $attributes['cards'] ?? [];
$omb_columns           = $attributes['columns'] ?? 3;
$omb_card_style        = $attributes['cardStyle'] ?? 'elevated';
$omb_show_images       = $attributes['showImages'] ?? true;
$omb_image_position    = $attributes['imagePosition'] ?? 'top';
$omb_image_aspect      = $attributes['imageAspectRatio'] ?? '4/3';
$omb_show_icons        = $attributes['showIcons'] ?? false;
$omb_equal_height      = $attributes['equalHeight'] ?? true;
$omb_content_alignment = $attributes['contentAlignment'] ?? 'left';

// Return early if no cards.
if ( empty( $omb_cards ) ) {
	return;
}

// Build CSS classes.
$omb_classes = [
	'wp-block-theme-oh-my-brand-cards',
	'wp-block-theme-oh-my-brand-cards--style-' . $omb_card_style,
	'wp-block-theme-oh-my-brand-cards--align-' . $omb_content_alignment,
	'wp-block-theme-oh-my-brand-cards--image-' . $omb_image_position,
];

if ( $omb_equal_height ) {
	$omb_classes[] = 'wp-block-theme-oh-my-brand-cards--equal-height';
}

// Build inline styles for CSS custom properties.
// --cards-columns influences the min-width calculation for auto-fit grid.
$omb_custom_styles = sprintf(
	'--cards-columns: %d; --cards-aspect-ratio: %s;',
	$omb_columns,
	$omb_image_aspect
);

// Get wrapper attributes.
$omb_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => implode( ' ', $omb_classes ),
		'style' => $omb_custom_styles,
	]
);

// Generate unique ID for accessibility.
$omb_block_id = wp_unique_id( 'cards-' );
?>

<section <?php echo $omb_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes. ?>>
	<?php if ( ! empty( $omb_heading ) || ! empty( $omb_description ) ) : ?>
		<header class="wp-block-theme-oh-my-brand-cards__header">
			<?php if ( ! empty( $omb_heading ) ) : ?>
				<<?php echo esc_attr( $omb_heading_level ); ?> class="wp-block-theme-oh-my-brand-cards__heading">
					<?php echo wp_kses_post( $omb_heading ); ?>
				</<?php echo esc_attr( $omb_heading_level ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $omb_description ) ) : ?>
				<p class="wp-block-theme-oh-my-brand-cards__description">
					<?php echo wp_kses_post( $omb_description ); ?>
				</p>
			<?php endif; ?>
		</header>
	<?php endif; ?>

	<ul class="wp-block-theme-oh-my-brand-cards__list" role="list">
		<?php foreach ( $omb_cards as $omb_index => $omb_card ) : ?>
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Function returns escaped HTML.
			echo omb_cards_render_card(
				$omb_card,
				$omb_index,
				$omb_show_images,
				$omb_show_icons,
				$omb_image_position
			);
			?>
		<?php endforeach; ?>
	</ul>
</section>
