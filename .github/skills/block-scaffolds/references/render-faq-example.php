<?php
/**
 * FAQ Block - Render template.
 *
 * Full example of an ACF block render template with:
 * - Helper function integration
 * - Editor placeholder state
 * - Accessible markup
 * - JSON-LD structured data
 *
 * @package theme-oh-my-brand
 *
 * @var array    $block      Block settings and attributes.
 * @var string   $content    Block inner HTML (empty for ACF blocks).
 * @var bool     $is_preview True during backend preview render.
 * @var int      $post_id    Post ID the block is on.
 * @var array    $context    Block context values.
 */

declare(strict_types=1);

namespace OMB\Blocks\Faq;

require_once __DIR__ . '/helpers.php';

// Get data using helper function.
$post_id   = get_the_ID();
$faq_items = get_faq_data( $post_id );
$is_editor = is_admin();

// Early return for empty state (except in editor).
if ( empty( $faq_items ) && ! $is_editor ) {
	return;
}

// Build wrapper attributes.
if ( function_exists( 'get_block_wrapper_attributes' ) && ! wp_doing_ajax() ) {
	$wrapper_attrs = get_block_wrapper_attributes(
		[
			'class'      => 'wp-block-acf-faq',
			'role'       => 'region',
			'aria-label' => __( 'Frequently Asked Questions', 'theme-oh-my-brand' ),
		]
	);
} else {
	$wrapper_attrs = 'class="wp-block-acf-faq"';
}
?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-faq-wrapper>
	<div class="faq-container">
		<?php if ( ! empty( $faq_items ) ) : ?>
			<ul class="faq-items" data-faq-items>
				<?php foreach ( $faq_items as $index => $item ) : ?>
					<li class="faq-item">
						<details name="faq" data-faq-item>
							<summary><?php echo esc_html( $item['question'] ); ?></summary>
							<p><?php echo esc_html( $item['answer'] ); ?></p>
						</details>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php elseif ( $is_editor ) : ?>
			<p class="faq-placeholder">
				<em><?php esc_html_e( 'No FAQ items added yet.', 'theme-oh-my-brand' ); ?></em>
			</p>
		<?php endif; ?>
	</div>
</div>

<?php if ( ! empty( $faq_items ) && ! $is_editor ) : ?>
	<script type="application/ld+json">
	<?php echo generate_faq_json_ld( $faq_items ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</script>
<?php endif; ?>
