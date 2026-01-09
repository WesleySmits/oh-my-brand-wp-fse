<?php
/**
 * BLOCK_TITLE - Render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $block      Block settings.
 * @var string   $content    Block inner HTML.
 * @var bool     $is_preview True during preview render.
 * @var int      $post_id    Post ID.
 */

declare(strict_types=1);

namespace OMB\Blocks\BLOCK_CLASS;

require_once __DIR__ . '/helpers.php';

// Get data.
$post_id   = get_the_ID();
$items     = get_BLOCK_NAME_data( $post_id );
$is_editor = is_admin();

// Early return for empty state.
if ( empty( $items ) && ! $is_editor ) {
	return;
}

// Build wrapper attributes.
if ( function_exists( 'get_block_wrapper_attributes' ) && ! wp_doing_ajax() ) {
	$wrapper_attrs = get_block_wrapper_attributes(
		[
			'class'      => 'wp-block-acf-BLOCK_NAME',
			'role'       => 'region',
			'aria-label' => __( 'BLOCK_DESCRIPTION', 'theme-oh-my-brand' ),
		]
	);
} else {
	$wrapper_attrs = 'class="wp-block-acf-BLOCK_NAME"';
}
?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! empty( $items ) ) : ?>
		<!-- Render items -->
	<?php elseif ( $is_editor ) : ?>
		<p class="block-placeholder">
			<em><?php esc_html_e( 'Add items to see preview.', 'theme-oh-my-brand' ); ?></em>
		</p>
	<?php endif; ?>
</div>
