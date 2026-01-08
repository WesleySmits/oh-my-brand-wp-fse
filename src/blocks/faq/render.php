<?php
/**
 * FAQ Block - Server-side render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

$items = $attributes['items'] ?? [];

if ( empty( $items ) ) {
	return;
}

// Build wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class'            => 'wp-block-theme-oh-my-brand-faq',
		'role'             => 'region',
		'aria-label'       => __( 'Frequently asked questions', 'theme-oh-my-brand' ),
		'data-faq-wrapper' => '',
	]
);

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="faq-container">
		<ul class="faq-items" data-faq-items>
			<?php foreach ( $items as $item ) : ?>
				<?php
				$question = $item['question'] ?? '';
				$answer   = $item['answer'] ?? '';

				if ( empty( $question ) && empty( $answer ) ) {
					continue;
				}
				?>
				<li class="faq-item">
					<details name="faq" data-faq-item>
						<summary><?php echo wp_kses_post( $question ); ?></summary>
						<p><?php echo wp_kses_post( $answer ); ?></p>
					</details>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</div>
<?php
// Output JSON-LD only on frontend, not in editor.
if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
	echo omb_generate_faq_json_ld( $items ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
?>
