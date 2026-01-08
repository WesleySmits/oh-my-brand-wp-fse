<?php
require_once __DIR__ . '/helpers.php';

if ( ! isset( $block ) ) {
	return;
}

if ( ! isset( $is_preview ) ) {
	$is_preview = false;
}

$youtube_url_or_iframe = omb_acf_youtube_get_url_or_iframe( $block );
if ( $is_preview && ! $youtube_url_or_iframe ) {
	?>
	<div class="acf-youtube-embed__placeholder" style="padding:2em; text-align:center; background:#f9f9f9; border:1px dashed #ccc;">
		<?php esc_html_e( 'Add a YouTube URL in the block settings to preview the video.', 'oh-my-brand' ); ?>
	</div>
	<?php
	return;
}

if ( ! $youtube_url_or_iframe ) {
	return;
}

$lazy_load = get_field( 'lazy_load' ) ?: true;
$width     = get_field( 'width' ) ?: 1280;
$height    = get_field( 'height' ) ?: 720;
$title     = get_field( 'title' ) ?: '';

$block_id   = 'acf-youtube-' . esc_attr( $block['id'] );
$class_name = omb_acf_youtube_get_class_name( $block );

$youtube_iframe = omb_acf_youtube_build_iframe(
	$youtube_url_or_iframe,
	[
		'width'  => $width,
		'height' => $height,
		'lazy'   => $lazy_load,
		'title'  => $title,
	]
);
?>

<div id="<?php echo esc_attr( $block_id ); ?>" class="<?php echo esc_attr( $class_name ); ?>">
	<?php echo $youtube_iframe; ?>
</div>
