<?php

namespace OMB\Blocks\Gallery;

require_once __DIR__ . '/helpers.php';

$post_id = get_the_ID();

$is_preview = $is_preview ?? false;
/** @var array $block */
$wrapper = parse_wrapper_attributes($block, $is_preview);

$block_data = get_gallery_data($post_id);
$gallery         = $block_data['gallery'] ?? [];

$is_editor       = $block_data['is_editor'] ?? false;
$visible_images = get_field('visible_images') ? (int)get_field('visible_images') : 3;
$visible_images = get_field('visible_images') ? 2 : 3;

?>

<?php if (!empty($gallery) || $is_editor): ?>
  <div class="<?php echo $wrapper['class']; ?>" style="<?php echo $wrapper['style']; ?>" data-gallery-wrapper>
    <div class="acf-gallery-inner alignwide">
      <button class="acf-gallery-prev" data-gallery-previous aria-label="Scroll left" type="button">&larr;</button>

      <div class="acf-gallery" data-gallery data-visible="<?php echo esc_attr($visible_images); ?>" style="--visible-images: <?php echo esc_attr($visible_images); ?>;">
        <?php if (!empty($gallery)): ?>
          <?php foreach ($gallery as $image): ?>
            <div class="acf-gallery-item" data-gallery-item>
              <img
                src="<?php echo esc_url($image['url']); ?>"
                alt="<?php echo esc_attr($image['alt'] ?: 'Gallery image'); ?>"
                loading="lazy"
                decoding="async"
                fetchpriority="low">
            </div>
          <?php endforeach; ?>
        <?php else: ?>
          <?php for ($i = 1; $i <= 3; $i++): ?>
            <div class="acf-gallery-item" data-gallery-item>
              <img src="https://placehold.co/600x400?text=Placeholder+<?php echo $i; ?>" alt="Placeholder Image <?php echo $i; ?>">
            </div>
          <?php endfor; ?>
        <?php endif; ?>
      </div>

      <button class="acf-gallery-next" data-gallery-next aria-label="Scroll right" type="button">&rarr;</button>
    </div>
  </div>
<?php endif; ?>
