<?php
/**
 * BLOCK_TITLE - Server-side render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

// Get attributes with defaults.
// $items = $attributes['items'] ?? [];

// Early return for empty state.
// if ( empty( $items ) ) {
// return;
// }

// Generate unique ID.
$block_id = wp_unique_id( 'BLOCK_NAME-' );

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'      => 'wp-block-theme-oh-my-brand-BLOCK_NAME',
		'role'       => 'region',
		'aria-label' => __( 'BLOCK_DESCRIPTION', 'theme-oh-my-brand' ),
		'id'         => $block_id,
	]
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<omb-BLOCK_NAME class="wp-block-theme-oh-my-brand-BLOCK_NAME__inner">
		<!-- Block content -->

		<div
			class="wp-block-theme-oh-my-brand-BLOCK_NAME__live"
			aria-live="polite"
			aria-atomic="true"
			data-live-region
		></div>
	</omb-BLOCK_NAME>
</div>
