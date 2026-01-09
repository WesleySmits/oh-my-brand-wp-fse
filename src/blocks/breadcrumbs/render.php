<?php
/**
 * Breadcrumbs block render template.
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

// Get breadcrumb trail.
$omb_items = omb_breadcrumbs_get_trail( $attributes );

// Don't render if no items or only home on front page.
if ( empty( $omb_items ) || ( count( $omb_items ) === 1 && is_front_page() ) ) {
	return;
}

// Extract attributes.
$omb_show_schema        = $attributes['showSchema'] ?? true;
$omb_truncate_on_mobile = $attributes['truncateOnMobile'] ?? true;
$omb_anchor             = $attributes['anchor'] ?? '';

// Build wrapper classes.
$omb_wrapper_classes = [ 'wp-block-theme-oh-my-brand-breadcrumbs' ];
if ( $omb_truncate_on_mobile ) {
	$omb_wrapper_classes[] = 'wp-block-theme-oh-my-brand-breadcrumbs--truncatable';
}

// Build wrapper attributes.
$omb_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'      => implode( ' ', $omb_wrapper_classes ),
		'aria-label' => __( 'Breadcrumb', 'oh-my-brand' ),
	]
);

// Add anchor if provided.
if ( $omb_anchor ) {
	$omb_wrapper_attributes = str_replace( 'class="', 'id="' . esc_attr( $omb_anchor ) . '" class="', $omb_wrapper_attributes );
}
?>

<nav <?php echo $omb_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<ol class="wp-block-theme-oh-my-brand-breadcrumbs__list" itemscope itemtype="https://schema.org/BreadcrumbList">
		<?php echo omb_breadcrumbs_render_items( $omb_items, $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</ol>
</nav>

<?php if ( $omb_show_schema ) : ?>
	<?php echo omb_breadcrumbs_get_schema( $omb_items ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
<?php endif; ?>
