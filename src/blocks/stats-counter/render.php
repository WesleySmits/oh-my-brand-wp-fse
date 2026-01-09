<?php
/**
 * Stats Counter Block - Server-side Rendering
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
$omb_heading            = $attributes['heading'] ?? '';
$omb_heading_level      = $attributes['headingLevel'] ?? 'h2';
$omb_description        = $attributes['description'] ?? '';
$omb_stats              = $attributes['stats'] ?? [];
$omb_columns            = $attributes['columns'] ?? 4;
$omb_stat_style         = $attributes['statStyle'] ?? 'default';
$omb_show_icons         = $attributes['showIcons'] ?? true;
$omb_animate_on_scroll  = $attributes['animateOnScroll'] ?? true;
$omb_animation_duration = $attributes['animationDuration'] ?? 2000;
$omb_content_alignment  = $attributes['contentAlignment'] ?? 'center';

// Return early if no stats.
if ( empty( $omb_stats ) ) {
	return;
}

// Build CSS classes.
$omb_classes = [
	'wp-block-theme-oh-my-brand-stats-counter',
	'wp-block-theme-oh-my-brand-stats-counter--style-' . $omb_stat_style,
	'wp-block-theme-oh-my-brand-stats-counter--align-' . $omb_content_alignment,
];

// Add is-visible class if animation is disabled.
if ( ! $omb_animate_on_scroll ) {
	$omb_classes[] = 'is-visible';
}

// Build inline styles for CSS custom properties.
$omb_custom_styles = sprintf(
	'--stats-columns: %d; --stats-animation-duration: %dms;',
	$omb_columns,
	$omb_animation_duration
);

// Get wrapper attributes.
$omb_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => implode( ' ', $omb_classes ),
		'style' => $omb_custom_styles,
	]
);

// Generate unique ID for accessibility.
$omb_block_id = wp_unique_id( 'stats-counter-' );
?>

<omb-stats-counter
	<?php echo $omb_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes. ?>
	data-animate="<?php echo $omb_animate_on_scroll ? 'true' : 'false'; ?>"
	data-duration="<?php echo esc_attr( (string) $omb_animation_duration ); ?>"
>
	<?php if ( ! empty( $omb_heading ) || ! empty( $omb_description ) ) : ?>
		<header class="wp-block-theme-oh-my-brand-stats-counter__header">
			<?php if ( ! empty( $omb_heading ) ) : ?>
				<<?php echo esc_attr( $omb_heading_level ); ?> class="wp-block-theme-oh-my-brand-stats-counter__heading">
					<?php echo wp_kses_post( $omb_heading ); ?>
				</<?php echo esc_attr( $omb_heading_level ); ?>>
			<?php endif; ?>

			<?php if ( ! empty( $omb_description ) ) : ?>
				<p class="wp-block-theme-oh-my-brand-stats-counter__description">
					<?php echo wp_kses_post( $omb_description ); ?>
				</p>
			<?php endif; ?>
		</header>
	<?php endif; ?>

	<dl class="wp-block-theme-oh-my-brand-stats-counter__list" role="list">
		<?php foreach ( $omb_stats as $omb_index => $omb_stat ) : ?>
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Function returns escaped HTML.
			echo omb_stats_render_stat( $omb_stat, $omb_show_icons );
			?>
		<?php endforeach; ?>
	</dl>
</omb-stats-counter>
