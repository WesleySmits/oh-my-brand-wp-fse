<?php
/**
 * Gallery Block - Server-side render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$images         = $attributes['images'] ?? [];
$visible_images = $attributes['visibleImages'] ?? 3;

if ( empty( $images ) ) {
	return;
}

// Get block gap and build style using helpers.
$block_gap     = omb_gallery_get_block_gap( $attributes );
$gallery_style = omb_gallery_build_style( $visible_images, $block_gap );

// Generate a unique ID for the gallery.
$gallery_id = wp_unique_id( 'gallery-' );

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'                => 'wp-block-theme-oh-my-brand-gallery acf-gallery-wrapper',
		'role'                 => 'region',
		'aria-label'           => __( 'Image gallery carousel', 'theme-oh-my-brand' ),
		'aria-roledescription' => __( 'carousel', 'theme-oh-my-brand' ),
		'id'                   => $gallery_id,
	]
);

// Generate SEO schema.
$schema_markup = omb_gallery_generate_schema( $images, $gallery_id );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<omb-gallery-carousel
		class="acf-gallery-inner alignwide"
		visible-images="<?php echo esc_attr( (string) $visible_images ); ?>"
		lightbox="true"
	>
		<button
			class="acf-gallery-prev"
			data-gallery-previous
			aria-label="<?php esc_attr_e( 'Scroll left', 'theme-oh-my-brand' ); ?>"
		>&larr;</button>

		<div
			class="acf-gallery"
			data-gallery
			data-visible="<?php echo esc_attr( (string) $visible_images ); ?>"
			style="<?php echo esc_attr( $gallery_style ); ?>"
		>
			<?php foreach ( $images as $index => $image ) : ?>
				<?php
				$image_id       = $image['id'] ?? 0;
				$image_url      = $image['url'] ?? '';
				$image_alt      = $image['alt'] ?? '';
				$image_full_url = $image['fullUrl'] ?? $image_url;
				$image_caption  = $image['caption'] ?? '';

				if ( empty( $image_url ) ) {
					continue;
				}

				// Get image dimensions for CLS prevention.
				$image_width  = '';
				$image_height = '';
				$srcset       = '';
				$sizes        = '';

				if ( $image_id ) {
					$image_meta = wp_get_attachment_metadata( $image_id );
					if ( $image_meta && isset( $image_meta['width'], $image_meta['height'] ) ) {
						$image_width  = $image_meta['width'];
						$image_height = $image_meta['height'];
					}

					// Generate srcset for responsive images.
					$srcset = wp_get_attachment_image_srcset( $image_id, 'large' );
					$sizes  = wp_get_attachment_image_sizes( $image_id, 'large' );
				}

				// Set loading strategy - eager for first few visible images.
				$loading       = $index < $visible_images ? 'eager' : 'lazy';
				$fetchpriority = $index === 0 ? 'high' : 'low';
				?>
				<div class="acf-gallery-item" data-gallery-item>
					<a
						href="<?php echo esc_url( $image_full_url ); ?>"
						class="acf-gallery-item__link"
						<?php if ( ! empty( $image_caption ) ) : ?>
							data-caption="<?php echo esc_attr( $image_caption ); ?>"
						<?php endif; ?>
						aria-label="<?php echo esc_attr( sprintf( __( 'View %s in lightbox', 'theme-oh-my-brand' ), $image_alt ?: __( 'image', 'theme-oh-my-brand' ) ) ); ?>"
					>
						<img
							src="<?php echo esc_url( $image_url ); ?>"
							alt="<?php echo esc_attr( $image_alt ); ?>"
							<?php if ( $image_width && $image_height ) : ?>
								width="<?php echo esc_attr( (string) $image_width ); ?>"
								height="<?php echo esc_attr( (string) $image_height ); ?>"
							<?php endif; ?>
							<?php if ( $srcset ) : ?>
								srcset="<?php echo esc_attr( $srcset ); ?>"
							<?php endif; ?>
							<?php if ( $sizes ) : ?>
								sizes="<?php echo esc_attr( $sizes ); ?>"
							<?php endif; ?>
							loading="<?php echo esc_attr( $loading ); ?>"
							decoding="async"
							fetchpriority="<?php echo esc_attr( $fetchpriority ); ?>"
						>
					</a>
				</div>
			<?php endforeach; ?>
		</div>

		<button
			class="acf-gallery-next"
			data-gallery-next
			aria-label="<?php esc_attr_e( 'Scroll right', 'theme-oh-my-brand' ); ?>"
		>&rarr;</button>

		<!-- Live region for screen reader announcements -->
		<div class="acf-gallery-live" aria-live="polite" aria-atomic="true" data-gallery-live></div>
	</omb-gallery-carousel>

	<?php
	// Output SEO schema markup.
	echo $schema_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON-LD is escaped in helper function.
	?>
</div>
