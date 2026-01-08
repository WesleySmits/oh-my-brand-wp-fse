<?php
/**
 * CTA block render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner HTML.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

// Load helpers.
require_once __DIR__ . '/helpers.php';

// Extract attributes with defaults.
$heading           = $attributes['heading'] ?? '';
$heading_level     = $attributes['headingLevel'] ?? 'h2';
$content_text      = $attributes['content'] ?? '';
$content_alignment = $attributes['contentAlignment'] ?? 'center';
$primary_button    = $attributes['primaryButton'] ?? [];
$secondary_button  = $attributes['secondaryButton'] ?? [];
$anchor            = $attributes['anchor'] ?? '';

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'wp-block-theme-oh-my-brand-cta--align-' . esc_attr( $content_alignment ),
	]
);

// Add anchor if provided.
if ( $anchor ) {
	$wrapper_attributes = str_replace( 'class="', 'id="' . esc_attr( $anchor ) . '" class="', $wrapper_attributes );
}
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wp-block-theme-oh-my-brand-cta__content">
		<?php if ( $heading ) : ?>
			<<?php echo esc_attr( $heading_level ); ?> class="wp-block-theme-oh-my-brand-cta__heading">
				<?php echo esc_html( $heading ); ?>
			</<?php echo esc_attr( $heading_level ); ?>>
		<?php endif; ?>

		<?php if ( $content_text ) : ?>
			<p class="wp-block-theme-oh-my-brand-cta__text">
				<?php echo wp_kses_post( $content_text ); ?>
			</p>
		<?php endif; ?>

		<?php if ( ! empty( $primary_button['text'] ) || ! empty( $secondary_button['text'] ) ) : ?>
			<div class="wp-block-theme-oh-my-brand-cta__buttons">
				<?php if ( ! empty( $primary_button['text'] ) && ! empty( $primary_button['url'] ) ) : ?>
					<?php echo omb_cta_render_button( $primary_button, 'primary' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>

				<?php if ( ! empty( $secondary_button['text'] ) && ! empty( $secondary_button['url'] ) ) : ?>
					<?php echo omb_cta_render_button( $secondary_button, 'secondary' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
