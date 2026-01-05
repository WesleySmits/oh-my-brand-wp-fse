<?php

namespace OMB\Blocks\Faq;

require_once __DIR__ . '/helpers.php';

$post_id = get_the_ID();
$faq = get_faq_data($post_id);
$is_editor = is_admin();

if (empty($faq) && !$is_editor) {
  return;
}


if (function_exists('get_block_wrapper_attributes') && !wp_doing_ajax()) {
  $wrapper_attrs = get_block_wrapper_attributes();
} else {
  $wrapper_attrs = '';
}
?>
<div <?php echo $wrapper_attrs; ?> data-faq-wrapper>
  <div class="faq-container">
    <?php if (!empty($faq)): ?>
      <ul class="faq-items" data-faq-items>
        <?php foreach ($faq as $index => $item): ?>
          <li class="faq-item">
            <details name="faq" data-faq-item>
              <summary><?php echo esc_html($item['question']); ?></summary>
              <p><?php echo esc_html($item['answer']); ?></p>
            </details>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php elseif ($is_editor): ?>
      <p><em>Er zijn nog geen FAQ items toegevoegd.</em></p>
    <?php endif; ?>
  </div>
</div>

<?php if (!empty($faq) && !$is_editor): ?>
  <script type="application/ld+json">
    <?php echo generate_faq_json_ld($faq); ?>
  </script>
<?php endif; ?>
