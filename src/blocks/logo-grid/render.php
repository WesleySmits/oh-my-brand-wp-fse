<?php
/**
 * Logo Grid block render template.
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

// Get attributes with defaults.
$omb_heading          = $attributes['heading'] ?? '';
$omb_heading_level    = $attributes['headingLevel'] ?? 'h2';
$omb_source           = $attributes['source'] ?? 'manual';
$omb_post_type        = $attributes['postType'] ?? '';
$omb_image_source     = $attributes['imageSource'] ?? 'featured_image';
$omb_link_source      = $attributes['linkSource'] ?? 'permalink';
$omb_alt_source       = $attributes['altSource'] ?? 'title';
$omb_max_logos        = $attributes['maxLogos'] ?? 12;
$omb_order_by         = $attributes['orderBy'] ?? 'menu_order';
$omb_order            = $attributes['order'] ?? 'ASC';
$omb_images           = $attributes['images'] ?? [];
$omb_columns          = $attributes['columns'] ?? 4;
$omb_columns_mobile   = $attributes['columnsMobile'] ?? 2;
$omb_grayscale        = $attributes['grayscale'] ?? true;
$omb_color_on_hover   = $attributes['colorOnHover'] ?? true;
$omb_logo_max_height  = $attributes['logoMaxHeight'] ?? 80;
$omb_enable_marquee   = $attributes['enableMarquee'] ?? false;
$omb_marquee_speed    = $attributes['marqueeSpeed'] ?? 'medium';
$omb_marquee_direction = $attributes['marqueeDirection'] ?? 'left';
$omb_pause_on_hover   = $attributes['pauseOnHover'] ?? true;

// Determine logos based on source.
if ( 'dynamic' === $omb_source && ! empty( $omb_post_type ) ) {
	$omb_logos = omb_logo_grid_get_dynamic_logos(
		$omb_post_type,
		$omb_image_source,
		$omb_link_source,
		$omb_alt_source,
		$omb_max_logos,
		$omb_order_by,
		$omb_order
	);
} else {
	$omb_logos = $omb_images;
}

// Validate heading level.
$omb_allowed_levels = array( 'h2', 'h3', 'h4' );
if ( ! in_array( $omb_heading_level, $omb_allowed_levels, true ) ) {
	$omb_heading_level = 'h2';
}

// Build CSS custom properties.
$omb_custom_properties = array(
	'--logo-grid-columns'        => $omb_columns,
	'--logo-grid-columns-mobile' => $omb_columns_mobile,
	'--logo-grid-logo-height'    => $omb_logo_max_height . 'px',
	'--logo-grid-grayscale'      => $omb_grayscale ? '1' : '0',
);

$omb_style_string = '';
foreach ( $omb_custom_properties as $omb_property => $omb_value ) {
	$omb_style_string .= esc_attr( $omb_property ) . ':' . esc_attr( (string) $omb_value ) . ';';
}

// Build class names.
$omb_class_names = array( 'wp-block-theme-oh-my-brand-logo-grid' );

if ( $omb_grayscale && $omb_color_on_hover ) {
	$omb_class_names[] = 'wp-block-theme-oh-my-brand-logo-grid--color-on-hover';
}

if ( $omb_enable_marquee ) {
	$omb_class_names[] = 'wp-block-theme-oh-my-brand-logo-grid--marquee';
}

$omb_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $omb_class_names ),
		'style' => $omb_style_string,
	)
);
?>

<section <?php echo $omb_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $omb_heading ) ) : ?>
		<<?php echo esc_html( $omb_heading_level ); ?> class="wp-block-theme-oh-my-brand-logo-grid__heading">
			<?php echo esc_html( $omb_heading ); ?>
		</<?php echo esc_html( $omb_heading_level ); ?>>
	<?php endif; ?>

	<?php if ( ! empty( $omb_logos ) ) : ?>
		<?php if ( $omb_enable_marquee ) : ?>
		<omb-logo-marquee
			speed="<?php echo esc_attr( $omb_marquee_speed ); ?>"
			direction="<?php echo esc_attr( $omb_marquee_direction ); ?>"
			pause-on-hover="<?php echo $omb_pause_on_hover ? 'true' : 'false'; ?>"
		>
		<?php endif; ?>
		<ul class="wp-block-theme-oh-my-brand-logo-grid__list" role="list">
			<?php foreach ( $omb_logos as $omb_logo ) : ?>
				<li class="wp-block-theme-oh-my-brand-logo-grid__item">
					<?php
					echo omb_logo_grid_render_image( $omb_logo ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in function.
					?>
				</li>
			<?php endforeach; ?>
		</ul>
		<?php if ( $omb_enable_marquee ) : ?>
		</omb-logo-marquee>
		<?php endif; ?>
	<?php else : ?>
		<p class="wp-block-theme-oh-my-brand-logo-grid__empty">
			<?php esc_html_e( 'No logos selected.', 'oh-my-brand' ); ?>
		</p>
	<?php endif; ?>
</section>
