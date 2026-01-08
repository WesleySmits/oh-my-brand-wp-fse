<?php
/**
 * Hero Section block render template.
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
$heading_level      = $attributes['headingLevel'] ?? 'h1';
$subheading         = $attributes['subheading'] ?? '';
$content_text       = $attributes['content'] ?? '';
$background_type    = $attributes['backgroundType'] ?? 'color';
$background_image   = $attributes['backgroundImage'] ?? [];
$background_video   = $attributes['backgroundVideo'] ?? '';
$overlay_color      = $attributes['overlayColor'] ?? 'rgba(0,0,0,0.5)';
$overlay_opacity    = ( $attributes['overlayOpacity'] ?? 50 ) / 100;
$content_alignment  = $attributes['contentAlignment'] ?? 'center';
$vertical_alignment = $attributes['verticalAlignment'] ?? 'center';
$min_height         = $attributes['minHeight'] ?? '60vh';
$primary_button     = $attributes['primaryButton'] ?? [];
$secondary_button   = $attributes['secondaryButton'] ?? [];
$anchor             = $attributes['anchor'] ?? '';

// Determine if we need video controls.
$has_video = 'video' === $background_type && ! empty( $background_video );

// Build custom element attributes.
$custom_element_attrs = [
	'min-height'      => esc_attr( $min_height ),
	'overlay-opacity' => esc_attr( (string) $overlay_opacity ),
	'content-align'   => esc_attr( $content_alignment ),
	'vertical-align'  => esc_attr( $vertical_alignment ),
];

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes();

// Build custom element attribute string.
$custom_attrs_string = '';
foreach ( $custom_element_attrs as $attr => $value ) {
	$custom_attrs_string .= ' ' . $attr . '="' . $value . '"';
}

if ( $anchor ) {
	$custom_attrs_string .= ' id="' . esc_attr( $anchor ) . '"';
}
?>

<omb-hero <?php echo $wrapper_attributes . $custom_attrs_string; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( 'image' === $background_type && ! empty( $background_image['id'] ) ) : ?>
		<?php
		echo wp_get_attachment_image(
			$background_image['id'],
			'full',
			false,
			[
				'slot'          => 'background',
				'alt'           => '',
				'loading'       => 'eager',
				'fetchpriority' => 'high',
				'decoding'      => 'async',
				'sizes'         => '100vw',
			]
		);
		?>
	<?php elseif ( $has_video ) : ?>
		<video
			slot="background"
			src="<?php echo esc_url( $background_video ); ?>"
			autoplay
			muted
			loop
			playsinline
			aria-hidden="true"
		></video>
	<?php endif; ?>

	<?php if ( $heading || $subheading ) : ?>
		<header class="wp-block-theme-oh-my-brand-hero__header">
			<?php if ( $heading ) : ?>
				<<?php echo esc_attr( $heading_level ); ?> class="wp-block-theme-oh-my-brand-hero__heading">
					<?php echo esc_html( $heading ); ?>
				</<?php echo esc_attr( $heading_level ); ?>>
			<?php endif; ?>

			<?php if ( $subheading ) : ?>
				<p class="wp-block-theme-oh-my-brand-hero__subheading">
					<?php echo esc_html( $subheading ); ?>
				</p>
			<?php endif; ?>
		</header>
	<?php endif; ?>

	<?php if ( $content_text ) : ?>
		<p class="wp-block-theme-oh-my-brand-hero__text">
			<?php echo wp_kses_post( $content_text ); ?>
		</p>
	<?php endif; ?>

	<?php if ( ! empty( $primary_button['text'] ) || ! empty( $secondary_button['text'] ) ) : ?>
		<nav class="wp-block-theme-oh-my-brand-hero__buttons" aria-label="<?php esc_attr_e( 'Hero actions', 'theme-oh-my-brand' ); ?>">
			<?php echo omb_hero_render_button( $primary_button, 'primary' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php echo omb_hero_render_button( $secondary_button, 'secondary' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</nav>
	<?php endif; ?>

	<?php if ( $has_video ) : ?>
		<button
			type="button"
			class="wp-block-theme-oh-my-brand-hero__video-toggle"
			aria-label="<?php esc_attr_e( 'Pause background video', 'theme-oh-my-brand' ); ?>"
			aria-pressed="false"
		>
			<span class="wp-block-theme-oh-my-brand-hero__video-toggle-icon" aria-hidden="true"></span>
		</button>
	<?php endif; ?>
</omb-hero>
