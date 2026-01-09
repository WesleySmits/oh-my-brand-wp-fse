<?php
/**
 * Social Share block render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Block inner HTML.
 * @var WP_Block             $block      Block instance.
 */

declare(strict_types=1);

// Load helpers.
require_once __DIR__ . '/helpers.php';

// Get attributes with defaults.
$platforms      = $attributes['platforms'] ?? array( 'facebook', 'x', 'linkedin', 'email' );
$display_style  = $attributes['displayStyle'] ?? 'icon';
$layout         = $attributes['layout'] ?? 'horizontal';
$size           = $attributes['size'] ?? 'medium';
$use_native     = $attributes['useNativeShare'] ?? true;
$show_label     = $attributes['showLabel'] ?? false;
$label_text     = $attributes['labelText'] ?? __( 'Share this:', 'theme-oh-my-brand' );
$open_in_popup  = $attributes['openInPopup'] ?? true;
$alignment      = $attributes['alignment'] ?? 'left';

// Don't render if no platforms selected.
if ( empty( $platforms ) ) {
	return;
}

// Get current page data for sharing.
$share_url   = get_permalink();
$share_title = get_the_title();
$share_image = get_the_post_thumbnail_url( get_the_ID(), 'large' ) ?: '';

// Build wrapper classes.
$wrapper_classes = array(
	'wp-block-theme-oh-my-brand-social-share',
	'social-share',
	"social-share--layout-{$layout}",
	"social-share--style-{$display_style}",
	"social-share--size-{$size}",
	"social-share--align-{$alignment}",
);

// Build data attributes for web component.
$data_attrs = array(
	'data-native-share' => $use_native ? 'true' : 'false',
	'data-popup'        => $open_in_popup ? 'true' : 'false',
	'data-url'          => esc_url( $share_url ),
	'data-title'        => esc_attr( $share_title ),
	'data-image'        => esc_url( $share_image ),
);

$data_string = '';
foreach ( $data_attrs as $key => $value ) {
	$data_string .= sprintf( ' %s="%s"', $key, $value );
}
?>

<omb-social-share
	<?php echo get_block_wrapper_attributes( array( 'class' => implode( ' ', $wrapper_classes ) ) ); ?>
	<?php echo $data_string; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped above. ?>
>
	<?php if ( $show_label ) : ?>
		<span class="social-share__label"><?php echo esc_html( $label_text ); ?></span>
	<?php endif; ?>

	<ul class="social-share__list">
		<?php foreach ( $platforms as $platform ) : ?>
			<?php
			$platform_data = get_share_platform_data( $platform, $share_url, $share_title, $share_image );
			if ( ! $platform_data ) {
				continue;
			}
			?>
			<li class="social-share__item">
				<button
					type="button"
					class="social-share__button social-share__button--<?php echo esc_attr( $platform ); ?>"
					data-platform="<?php echo esc_attr( $platform ); ?>"
					data-share-url="<?php echo esc_url( $platform_data['url'] ); ?>"
					aria-label="<?php echo esc_attr( $platform_data['aria_label'] ); ?>"
				>
					<?php if ( 'label' !== $display_style ) : ?>
						<span class="social-share__icon">
							<?php echo get_social_icon( $platform ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is safe. ?>
						</span>
					<?php endif; ?>

					<?php if ( 'icon' !== $display_style ) : ?>
						<span class="social-share__text">
							<?php echo esc_html( $platform_data['label'] ); ?>
						</span>
					<?php endif; ?>
				</button>
			</li>
		<?php endforeach; ?>
	</ul>

	<!-- Toast notification for copy feedback -->
	<div class="social-share__toast" role="status" aria-live="polite" aria-atomic="true" hidden>
		<?php esc_html_e( 'Link copied to clipboard!', 'theme-oh-my-brand' ); ?>
	</div>
</omb-social-share>
