<?php
/**
 * Banner block render template.
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
$heading            = $attributes['heading'] ?? '';
$heading_level      = $attributes['headingLevel'] ?? 'h2';
$content_text       = $attributes['content'] ?? '';
$image              = $attributes['image'] ?? [];
$image_position     = $attributes['imagePosition'] ?? 'left';
$image_size         = $attributes['imageSize'] ?? '50';
$image_fit          = $attributes['imageFit'] ?? 'cover';
$vertical_alignment = $attributes['verticalAlignment'] ?? 'center';
$button             = $attributes['button'] ?? [];
$mobile_stack       = $attributes['mobileStack'] ?? 'image-first';
$anchor             = $attributes['anchor'] ?? '';

// Calculate responsive sizes attribute based on image size.
$sizes_desktop = $image_size . 'vw';
$sizes_attr    = "(max-width: 768px) 100vw, {$sizes_desktop}";

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes();

// Build custom element attribute string.
$custom_attrs = sprintf(
	' image-position="%s" image-size="%s" image-fit="%s" vertical-align="%s" mobile-stack="%s"',
	esc_attr( $image_position ),
	esc_attr( $image_size ),
	esc_attr( $image_fit ),
	esc_attr( $vertical_alignment ),
	esc_attr( $mobile_stack )
);

if ( $anchor ) {
	$custom_attrs .= ' id="' . esc_attr( $anchor ) . '"';
}
?>

<omb-banner <?php echo $wrapper_attributes . $custom_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $image['id'] ) ) : ?>
		<?php
		echo wp_get_attachment_image(
			$image['id'],
			'large',
			false,
			[
				'slot'     => 'image',
				'loading'  => 'lazy',
				'decoding' => 'async',
				'sizes'    => $sizes_attr,
			]
		);
		?>
	<?php endif; ?>

	<article class="wp-block-theme-oh-my-brand-banner__article">
		<?php if ( $heading ) : ?>
			<<?php echo esc_attr( $heading_level ); ?> class="wp-block-theme-oh-my-brand-banner__heading">
				<?php echo esc_html( $heading ); ?>
			</<?php echo esc_attr( $heading_level ); ?>>
		<?php endif; ?>

		<?php if ( $content_text ) : ?>
			<div class="wp-block-theme-oh-my-brand-banner__text">
				<?php echo wp_kses_post( $content_text ); ?>
			</div>
		<?php endif; ?>

		<?php if ( ! empty( $button['text'] ) && ! empty( $button['url'] ) ) : ?>
			<?php echo omb_banner_render_button( $button ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php endif; ?>
	</article>
</omb-banner>
