# PHP Coding Standards

This document defines the PHP coding standards for the Oh My Brand! theme.

We follow the [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/) with additional strict typing requirements.

## Table of Contents

- [File Structure](#file-structure)
- [Strict Typing](#strict-typing)
- [Type Declarations](#type-declarations)
- [Naming Conventions](#naming-conventions)
- [DocBlocks](#docblocks)
- [Security](#security)
- [WordPress Hooks](#wordpress-hooks)
- [Error Handling](#error-handling)

---

## File Structure

```php
<?php
/**
 * Short description of the file.
 *
 * Longer description if needed.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OhMyBrand\Component;

// Imports (use statements)
use OhMyBrand\Utils\Helper;

// Code implementation
```

---

## Strict Typing

Always use `declare(strict_types=1)` at the top of PHP files:

```php
<?php
declare(strict_types=1);

function get_gallery_count(array $images): int {
    return count($images);
}
```

---

## Type Declarations

Use type hints for all function parameters and return types:

```php
/**
 * Get formatted gallery images.
 *
 * @param array<int, array{id: int, url: string, alt: string}> $images Raw image data.
 * @param int $limit Maximum images to return.
 * @return array<int, array{id: int, url: string, alt: string, srcset: string}>
 */
function format_gallery_images(array $images, int $limit = 10): array {
    // Implementation
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `GalleryBlock`, `ImageHelper` |
| Methods | snake_case | `get_images()`, `render_block()` |
| Functions | snake_case | `theme_setup()`, `enqueue_assets()` |
| Constants | SCREAMING_SNAKE | `THEME_VERSION`, `MAX_IMAGES` |
| Variables | snake_case | `$image_count`, `$gallery_items` |
| Properties | snake_case | `$this->image_ids` |

---

## DocBlocks

Every function, method, and class requires a DocBlock:

```php
/**
 * Renders the gallery block.
 *
 * Takes an array of image IDs and renders them as a responsive
 * gallery with lightbox functionality.
 *
 * @since 1.0.0
 *
 * @param array<string, mixed> $attributes {
 *     Block attributes.
 *
 *     @type array  $images     Array of image IDs.
 *     @type string $layout     Gallery layout type.
 *     @type bool   $lightbox   Whether to enable lightbox.
 * }
 * @param string $content Block inner content.
 * @param WP_Block $block Block instance.
 * @return string Rendered HTML.
 */
function render_gallery_block(
    array $attributes,
    string $content,
    WP_Block $block
): string {
    // Implementation
}
```

---

## Security

### Output Escaping

Always escape output based on context:

```php
// HTML content
echo esc_html($title);

// HTML attributes
echo '<div class="' . esc_attr($class) . '">';

// URLs
echo '<a href="' . esc_url($link) . '">';

// JavaScript values
echo '<script>var config = ' . wp_json_encode($config) . ';</script>';

// Rich HTML (post content)
echo wp_kses_post($content);

// Translation with escaping
echo esc_html__('Gallery', 'theme-oh-my-brand');
echo esc_attr__('Close gallery', 'theme-oh-my-brand');
```

### Input Sanitization

Sanitize all input data:

```php
// Text input
$title = sanitize_text_field($_POST['title'] ?? '');

// Textarea
$description = sanitize_textarea_field($_POST['description'] ?? '');

// Email
$email = sanitize_email($_POST['email'] ?? '');

// Integer
$count = absint($_GET['count'] ?? 0);

// URL
$link = esc_url_raw($_POST['link'] ?? '');
```

### Nonce Verification

Use nonces for form submissions and AJAX:

```php
// Create nonce
wp_nonce_field('gallery_action', 'gallery_nonce');

// Verify nonce
if (!wp_verify_nonce($_POST['gallery_nonce'] ?? '', 'gallery_action')) {
    wp_die('Security check failed');
}
```

---

## WordPress Hooks

Use clear, namespaced hook names:

```php
// Actions
add_action('init', 'theme_oh_my_brand_register_blocks');
add_action('wp_enqueue_scripts', 'theme_oh_my_brand_enqueue_assets');

// Filters
add_filter('body_class', 'theme_oh_my_brand_body_classes');

// Custom hooks
do_action('theme_oh_my_brand_before_gallery', $gallery_id);
$images = apply_filters('theme_oh_my_brand_gallery_images', $images, $gallery_id);
```

---

## Error Handling

Use early returns and guard clauses:

```php
function get_gallery_html(int $gallery_id): string {
    // Guard clause
    if ($gallery_id <= 0) {
        return '';
    }

    $gallery = get_post($gallery_id);

    // Early return
    if (!$gallery instanceof WP_Post) {
        return '';
    }

    if ($gallery->post_type !== 'gallery') {
        return '';
    }

    // Main logic
    return render_gallery($gallery);
}
```

---

*Back to [Coding Standards](CODING_STANDARDS.md) | See also: [TypeScript Standards](CODING_STANDARDS_TYPESCRIPT.md), [CSS Standards](CODING_STANDARDS_CSS.md), [HTML Standards](CODING_STANDARDS_HTML.md)*
