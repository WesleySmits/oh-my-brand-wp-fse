<?php
/**
 * YouTube Block - Server-side render template.
 *
 * Uses facade pattern: shows thumbnail initially, loads iframe on user interaction.
 * This improves initial page load by ~500KB per video.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$url        = $attributes['url'] ?? '';
$video_title = $attributes['videoTitle'] ?? '';
$lazy_load  = $attributes['lazyLoad'] ?? true;

$video_id = omb_youtube_get_video_id( $url );

if ( ! $video_id ) {
	// Show placeholder in editor preview, nothing on frontend.
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		?>
		<div class="wp-block-theme-oh-my-brand-youtube__placeholder" style="padding: 2rem; background: #f0f0f0; text-align: center; border-radius: 0.5rem;">
			<?php esc_html_e( 'Add a YouTube URL in the block settings to preview the video.', 'theme-oh-my-brand' ); ?>
		</div>
		<?php
	}
	return;
}

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'      => 'wp-block-theme-oh-my-brand-youtube acf-youtube-embed',
		'role'       => 'region',
		'aria-label' => __( 'YouTube video player', 'theme-oh-my-brand' ),
	]
);

$embed_url     = omb_youtube_get_embed_url( $video_id );
$thumbnail_url = omb_youtube_get_thumbnail_url( $video_id, 'maxresdefault' );
$play_label    = $video_title
	? sprintf(
		/* translators: %s: video title */
		__( 'Play video: %s', 'theme-oh-my-brand' ),
		$video_title
	)
	: __( 'Play YouTube video', 'theme-oh-my-brand' );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<omb-youtube-facade
		class="youtube-facade"
		embed-url="<?php echo esc_url( $embed_url ); ?>"
		video-title="<?php echo esc_attr( $video_title ?: __( 'YouTube video', 'theme-oh-my-brand' ) ); ?>"
		tabindex="0"
		role="button"
		aria-label="<?php echo esc_attr( $play_label ); ?>"
	>
		<img
			class="youtube-facade__thumbnail"
			src="<?php echo esc_url( $thumbnail_url ); ?>"
			alt=""
			loading="<?php echo $lazy_load ? 'lazy' : 'eager'; ?>"
			decoding="async"
			fetchpriority="<?php echo $lazy_load ? 'low' : 'high'; ?>"
		>
		<button
			class="youtube-facade__play"
			type="button"
			aria-label="<?php echo esc_attr( $play_label ); ?>"
		>
			<svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">
				<path class="youtube-facade__play-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
				<path d="M 45,24 27,14 27,34" fill="#fff"></path>
			</svg>
		</button>
	</omb-youtube-facade>
</div>
