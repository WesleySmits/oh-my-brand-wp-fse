# WordPress Coding Standards

This document covers WordPress-specific development patterns, FSE theme conventions, and best practices for the Oh My Brand! theme.

## Table of Contents

- [File Structure](#file-structure)
- [functions.php Organization](#functionsphp-organization)
- [FSE Block Registration](#fse-block-registration)
- [ACF Block Setup](#acf-block-setup)
- [File Length Guidelines](#file-length-guidelines)
- [REST API Endpoints](#rest-api-endpoints)
- [Hooks and Filters](#hooks-and-filters)
- [Asset Enqueuing](#asset-enqueuing)
- [Theme.json Configuration](#themejson-configuration)
- [Security Practices](#security-practices)

---

## File Structure

### Theme Directory Organization

```
oh-my-brand/
├── functions.php            # Theme bootstrap (keep minimal)
├── style.css               # Theme metadata only
├── theme.json              # Global styles and settings
│
├── includes/               # PHP functionality
│   ├── assets.php          # Asset registration
│   ├── block-helpers.php   # Shared block utilities
│   └── post-types/         # CPT definitions (one per file)
│       └── {post-type}.php
│
├── blocks/                 # ACF custom blocks
│   └── acf-{block-name}/   # One directory per block
│       ├── block.json
│       ├── render.php
│       ├── helpers.php
│       └── style.css
│
├── patterns/               # Block patterns
│   └── {pattern-name}.php
│
├── parts/                  # Template parts
│   └── {part-name}.html
│
├── templates/              # Page templates
│   └── {template-name}.html
│
├── assets/                 # Static assets
│   ├── css/               # Global styles
│   ├── js/                # Compiled scripts
│   ├── icons/             # SVG icons
│   └── images/            # Theme images
│
└── acf-json/              # ACF field group sync
    └── group_*.json
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Include files | `kebab-case.php` | `block-helpers.php` |
| Block directories | `acf-{name}` | `acf-gallery-block/` |
| Post type files | `{post-type}.php` | `social-links.php` |
| Pattern files | `{pattern-name}.php` | `hero-section.php` |
| Template parts | `{name}.html` | `header.html` |

---

## functions.php Organization

### Structure

Keep `functions.php` as a bootstrap file only. Delegate functionality to include files.

```php
<?php
/**
 * Oh My Brand! theme functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// ==========================================================================
// Constants
// ==========================================================================

define('THEME_OH_MY_BRAND_VERSION', '1.0.0');
define('THEME_OH_MY_BRAND_PATH', get_stylesheet_directory());
define('THEME_OH_MY_BRAND_URI', get_stylesheet_directory_uri());

// ==========================================================================
// Includes
// ==========================================================================

$includes = [
    '/includes/assets.php',
    '/includes/block-helpers.php',
    '/includes/post-types/social-links.php',
];

foreach ($includes as $file) {
    $filepath = THEME_OH_MY_BRAND_PATH . $file;
    if (file_exists($filepath)) {
        require_once $filepath;
    }
}

// ==========================================================================
// Theme Setup
// ==========================================================================

add_action('after_setup_theme', 'theme_oh_my_brand_setup');

/**
 * Sets up theme defaults and registers support for WordPress features.
 *
 * @return void
 */
function theme_oh_my_brand_setup(): void {
    // Add theme supports
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', [
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);

    // Load editor styles
    add_editor_style('assets/css/theme.css');
}
```

### Guidelines

1. **Maximum 150 lines** in functions.php
2. **No business logic** - only bootstrap code
3. **Group by purpose** using section comments
4. **Use includes** for all functionality
5. **Define constants** at the top

---

## FSE Block Registration

### block.json Structure

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "acf/gallery-block",
    "title": "Gallery",
    "description": "Display images in a carousel gallery.",
    "category": "media",
    "icon": "images-alt2",
    "keywords": ["gallery", "carousel", "images", "slider"],
    "textdomain": "theme-oh-my-brand",
    "acf": {
        "mode": "preview",
        "renderTemplate": "render.php"
    },
    "supports": {
        "align": ["wide", "full"],
        "anchor": true,
        "className": true,
        "customClassName": true,
        "html": false,
        "color": {
            "background": true,
            "text": false,
            "gradients": true
        },
        "spacing": {
            "margin": true,
            "padding": true
        },
        "typography": {
            "fontSize": true
        }
    },
    "style": "file:./style.css",
    "editorStyle": "file:./editor.css",
    "script": "file:./index.js",
    "example": {
        "attributes": {
            "mode": "preview",
            "data": {
                "gallery_images": []
            }
        }
    }
}
```

### Block Registration (if not auto-discovered)

```php
<?php
/**
 * Register ACF blocks.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_action('init', 'theme_oh_my_brand_register_blocks');

/**
 * Register custom ACF blocks.
 *
 * @return void
 */
function theme_oh_my_brand_register_blocks(): void {
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    $blocks_dir = THEME_OH_MY_BRAND_PATH . '/blocks';
    $block_dirs = glob($blocks_dir . '/acf-*', GLOB_ONLYDIR);

    foreach ($block_dirs as $block_dir) {
        $block_json = $block_dir . '/block.json';

        if (file_exists($block_json)) {
            register_block_type($block_json);
        }
    }
}
```

---

## ACF Block Setup

### Required Files Per Block

```
blocks/acf-{block-name}/
├── block.json      # Block metadata (required)
├── render.php      # Server-side template (required)
├── helpers.php     # Block-specific functions (recommended)
├── style.css       # Frontend styles (required)
├── editor.css      # Editor-only styles (optional)
├── index.ts        # Frontend JavaScript (optional)
└── screenshot.png  # Block preview image (optional)
```

### render.php Template

```php
<?php
/**
 * Gallery block render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array<string, mixed> $block      Block settings and attributes.
 * @var string               $content    Block inner HTML (empty for ACF blocks).
 * @var bool                 $is_preview True during preview in editor.
 * @var int                  $post_id    Post ID the block is on.
 * @var array<string, mixed> $context    Block context values.
 * @var WP_Block             $block_instance Full block instance.
 */

declare(strict_types=1);

// Load block helpers
require_once __DIR__ . '/helpers.php';

// ==========================================================================
// Data Extraction
// ==========================================================================

$block_id   = $block['id'] ?? wp_unique_id('acf-gallery-');
$class_name = $block['className'] ?? '';
$align      = $block['align'] ?? '';
$anchor     = $block['anchor'] ?? '';

// Get ACF fields with defaults
$images       = get_field('gallery_images') ?: [];
$layout       = get_field('gallery_layout') ?: 'grid';
$show_caption = get_field('show_captions') ?? true;
$columns      = get_field('columns') ?: 3;

// ==========================================================================
// Early Return Conditions
// ==========================================================================

if (empty($images) && !$is_preview) {
    return; // Don't render empty blocks on frontend
}

// ==========================================================================
// Build Classes and Attributes
// ==========================================================================

$classes = array_filter([
    'acf-gallery-block',
    $class_name,
    $align ? "align{$align}" : '',
    "acf-gallery-block--{$layout}",
    "acf-gallery-block--cols-{$columns}",
]);

$wrapper_attributes = get_block_wrapper_attributes([
    'class'          => implode(' ', $classes),
    'data-block-id'  => esc_attr($block_id),
    'data-layout'    => esc_attr($layout),
    'data-columns'   => esc_attr((string) $columns),
]);

if ($anchor) {
    $wrapper_attributes .= ' id="' . esc_attr($anchor) . '"';
}

// ==========================================================================
// Render
// ==========================================================================

?>
<div <?php echo $wrapper_attributes; ?>>
    <?php if (empty($images)) : ?>
        <p class="acf-gallery-block__placeholder">
            <?php esc_html_e('Select images for the gallery.', 'theme-oh-my-brand'); ?>
        </p>
    <?php else : ?>
        <div class="acf-gallery-block__grid">
            <?php foreach ($images as $index => $image) : ?>
                <?php echo render_gallery_item($image, $index, $show_caption); ?>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
```

### helpers.php Structure

```php
<?php
/**
 * Gallery block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Render a single gallery item.
 *
 * @param array<string, mixed> $image        Image data from ACF.
 * @param int                  $index        Zero-based image index.
 * @param bool                 $show_caption Whether to display caption.
 * @return string Rendered HTML.
 */
function render_gallery_item(array $image, int $index, bool $show_caption): string {
    $id      = $image['ID'] ?? 0;
    $url     = $image['url'] ?? '';
    $alt     = $image['alt'] ?? '';
    $caption = $image['caption'] ?? '';

    if (empty($url)) {
        return '';
    }

    $loading = $index < 4 ? 'eager' : 'lazy';

    ob_start();
    ?>
    <figure class="acf-gallery-block__item" data-index="<?php echo esc_attr((string) $index); ?>">
        <img
            class="acf-gallery-block__image"
            src="<?php echo esc_url($url); ?>"
            alt="<?php echo esc_attr($alt); ?>"
            loading="<?php echo esc_attr($loading); ?>"
            decoding="async"
        />
        <?php if ($show_caption && $caption) : ?>
            <figcaption class="acf-gallery-block__caption">
                <?php echo wp_kses_post($caption); ?>
            </figcaption>
        <?php endif; ?>
    </figure>
    <?php
    return ob_get_clean() ?: '';
}
```

---

## File Length Guidelines

### Maximum Lines Per File Type

| File Type | Max Lines | Recommendation |
|-----------|-----------|----------------|
| functions.php | 150 | Bootstrap only, use includes |
| Include files | 300 | Split if exceeds |
| Block render.php | 200 | Extract to helpers.php |
| Block helpers.php | 250 | One helper per function |
| Pattern files | 100 | Keep patterns focused |
| CSS files | 400 | Split by component |

### Maximum Lines Per Unit

| Unit | Max Lines | Action if Exceeded |
|------|-----------|-------------------|
| Functions | 50 | Extract sub-functions |
| Methods | 40 | Extract private methods |
| Classes | 300 | Split responsibilities |

### Complexity Guidelines

```php
// ❌ Bad: Function too long, doing too much
function process_gallery_data(array $data): array {
    // 80+ lines of validation, transformation, and formatting
}

// ✅ Good: Split into focused functions
function process_gallery_data(array $data): array {
    $validated = validate_gallery_data($data);
    $transformed = transform_gallery_images($validated);
    return format_gallery_output($transformed);
}

function validate_gallery_data(array $data): array {
    // 15 lines
}

function transform_gallery_images(array $images): array {
    // 20 lines
}

function format_gallery_output(array $images): array {
    // 15 lines
}
```

---

## Native WordPress Block Development

### File Structure for Native Blocks

Native WordPress blocks (using `@wordpress/scripts`) use a `src/` directory structure:

```
src/blocks/{block-name}/
├── block.json       # Block metadata and registration
├── edit.tsx         # Editor component (TypeScript/React)
├── render.php       # Server-side rendering template
├── helpers.php      # Block-specific helper functions
├── style.css        # Frontend styles (auto-enqueued)
├── editor.css       # Editor-only styles
├── view.ts          # Frontend TypeScript (optional, Web Component)
└── index.ts         # Block registration entry point
```

### Block Logic Separation

**Principle**: Separate concerns between rendering (render.php), logic (helpers.php), and interactivity (view.ts/edit.tsx).

#### render.php - Template Only

Keep render.php focused on HTML structure only:

```php
<?php
/**
 * Block render template.
 */

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

// Extract attributes
$images = $attributes['images'] ?? [];

// Generate data using helpers
$schema_markup = omb_gallery_generate_schema($images);
$gallery_style = omb_gallery_build_style($attributes);

// Render HTML only
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    <!-- HTML structure only, no complex logic -->
</div>
<?php echo $schema_markup; ?>
```

#### helpers.php - Business Logic

Extract all complex logic to helpers:

```php
<?php
/**
 * Block helper functions.
 */

declare(strict_types=1);

if (!function_exists('omb_gallery_generate_schema')) {
    /**
     * Generate JSON-LD schema for SEO.
     *
     * @param array $images Image data.
     * @return string JSON-LD script tag.
     */
    function omb_gallery_generate_schema(array $images): string {
        // Complex logic here
    }
}
```

#### view.ts - Frontend Interactivity

Handle all client-side behavior using Web Components:

```typescript
/**
 * Block frontend script using Web Component.
 */

import { debounce } from '../utils/debounce';

class BlockComponent {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Event handlers
    }
}

// Initialize on DOM ready
document.querySelectorAll('[data-block-wrapper]').forEach((el) => {
    new BlockComponent(el);
});
```

### TypeScript Edit Components

Use TypeScript for type-safe editor components:

```typescript
/**
 * Block editor component.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';

interface BlockAttributes {
    items: Array<{ id: string; content: string }>;
    columns: number;
}

export default function Edit({
    attributes,
    setAttributes
}: BlockEditProps<BlockAttributes>): JSX.Element {
    const { items, columns } = attributes;
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Settings', 'theme-oh-my-brand')}>
                    <RangeControl
                        label={__('Columns', 'theme-oh-my-brand')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={6}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* Block preview */}
            </div>
        </>
    );
}
```

### Shared Utilities

Place reusable code in `src/blocks/utils/`:

```
src/blocks/utils/
├── index.ts           # Re-exports all utilities
├── debounce.ts        # Debounce function
├── debounce.test.ts   # Tests for debounce
├── Lightbox.ts        # Reusable lightbox component
├── Lightbox.test.ts   # Tests for lightbox
└── lightbox.css       # Lightbox styles
```

Example utility with TypeScript:

```typescript
/**
 * Debounce utility.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
    func: T,
    delay: number = 100
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: unknown, ...args: Parameters<T>): void {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
```

---

## REST API Endpoints

### Registration Pattern

```php
<?php
/**
 * REST API endpoints for gallery functionality.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_action('rest_api_init', 'theme_oh_my_brand_register_gallery_endpoints');

/**
 * Register gallery REST API endpoints.
 *
 * @return void
 */
function theme_oh_my_brand_register_gallery_endpoints(): void {
    register_rest_route(
        'theme-oh-my-brand/v1',
        '/gallery/(?P<id>\d+)',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'theme_oh_my_brand_get_gallery',
            'permission_callback' => '__return_true',
            'args'                => [
                'id' => [
                    'required'          => true,
                    'validate_callback' => 'absint',
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]
    );

    register_rest_route(
        'theme-oh-my-brand/v1',
        '/gallery',
        [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'theme_oh_my_brand_create_gallery',
            'permission_callback' => 'theme_oh_my_brand_can_manage_galleries',
            'args'                => theme_oh_my_brand_get_gallery_schema(),
        ]
    );
}
```

### Endpoint Callback Pattern

```php
/**
 * Get gallery data.
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response or error.
 */
function theme_oh_my_brand_get_gallery(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $gallery_id = $request->get_param('id');
    $gallery    = get_post($gallery_id);

    if (!$gallery || $gallery->post_type !== 'gallery') {
        return new WP_Error(
            'gallery_not_found',
            __('Gallery not found.', 'theme-oh-my-brand'),
            ['status' => 404]
        );
    }

    $data = [
        'id'     => $gallery->ID,
        'title'  => $gallery->post_title,
        'images' => get_field('gallery_images', $gallery->ID) ?: [],
    ];

    return new WP_REST_Response($data, 200);
}
```

### Permission Callbacks

```php
/**
 * Check if user can manage galleries.
 *
 * @return bool True if user has permission.
 */
function theme_oh_my_brand_can_manage_galleries(): bool {
    return current_user_can('edit_posts');
}

/**
 * Check if user can delete galleries.
 *
 * @return bool True if user has permission.
 */
function theme_oh_my_brand_can_delete_galleries(): bool {
    return current_user_can('delete_posts');
}
```

### Schema Definition

```php
/**
 * Get gallery endpoint schema.
 *
 * @return array<string, array<string, mixed>> Schema definition.
 */
function theme_oh_my_brand_get_gallery_schema(): array {
    return [
        'title' => [
            'required'          => true,
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'validate_callback' => function ($value): bool {
                return !empty($value) && strlen($value) <= 200;
            },
        ],
        'images' => [
            'required'          => true,
            'type'              => 'array',
            'items'             => [
                'type' => 'integer',
            ],
            'sanitize_callback' => function ($value): array {
                return array_map('absint', (array) $value);
            },
        ],
    ];
}
```

---

## Hooks and Filters

### Action Hook Naming

```php
// Theme-specific hooks: {theme_slug}_{action}
do_action('theme_oh_my_brand_before_gallery');
do_action('theme_oh_my_brand_after_gallery', $gallery_id);
do_action('theme_oh_my_brand_gallery_item', $image, $index);
```

### Filter Hook Naming

```php
// Theme-specific filters: {theme_slug}_{what}_{action}
$images = apply_filters('theme_oh_my_brand_gallery_images', $images, $gallery_id);
$classes = apply_filters('theme_oh_my_brand_gallery_classes', $classes);
$output = apply_filters('theme_oh_my_brand_gallery_output', $output, $attributes);
```

### Hook Priority Guidelines

| Priority | Use Case |
|----------|----------|
| 5 | Early modifications (before most plugins) |
| 10 | Default (standard execution) |
| 15 | After default processing |
| 20 | Late modifications |
| 99 | Final modifications |
| PHP_INT_MAX | Absolute last (use sparingly) |

### Hook Documentation

```php
/**
 * Fires before rendering the gallery block.
 *
 * @since 1.0.0
 *
 * @param int   $gallery_id Gallery post ID.
 * @param array $attributes Block attributes.
 */
do_action('theme_oh_my_brand_before_gallery', $gallery_id, $attributes);

/**
 * Filters the gallery images before rendering.
 *
 * @since 1.0.0
 *
 * @param array $images     Array of image data.
 * @param int   $gallery_id Gallery post ID.
 * @return array Modified images array.
 */
$images = apply_filters('theme_oh_my_brand_gallery_images', $images, $gallery_id);
```

---

## Asset Enqueuing

### Script Registration

```php
<?php
/**
 * Asset registration and enqueuing.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_action('wp_enqueue_scripts', 'theme_oh_my_brand_enqueue_scripts');
add_action('enqueue_block_editor_assets', 'theme_oh_my_brand_enqueue_editor_assets');

/**
 * Enqueue frontend scripts and styles.
 *
 * @return void
 */
function theme_oh_my_brand_enqueue_scripts(): void {
    // Theme stylesheet
    wp_enqueue_style(
        'theme-oh-my-brand-styles',
        THEME_OH_MY_BRAND_URI . '/assets/css/theme.css',
        [],
        THEME_OH_MY_BRAND_VERSION
    );

    // Gallery script (only when needed)
    if (has_block('acf/gallery-block')) {
        wp_enqueue_script(
            'theme-oh-my-brand-gallery',
            THEME_OH_MY_BRAND_URI . '/assets/js/gallery.js',
            [],
            THEME_OH_MY_BRAND_VERSION,
            ['strategy' => 'defer', 'in_footer' => true]
        );
    }
}

/**
 * Enqueue editor-specific assets.
 *
 * @return void
 */
function theme_oh_my_brand_enqueue_editor_assets(): void {
    wp_enqueue_style(
        'theme-oh-my-brand-editor',
        THEME_OH_MY_BRAND_URI . '/assets/css/editor.css',
        ['wp-edit-blocks'],
        THEME_OH_MY_BRAND_VERSION
    );
}
```

### Conditional Loading

```php
// Load only on specific pages
if (is_singular('gallery')) {
    wp_enqueue_script('theme-oh-my-brand-lightbox', ...);
}

// Load only when block is present
if (has_block('acf/gallery-block')) {
    wp_enqueue_script('theme-oh-my-brand-gallery', ...);
}

// Load only in admin
if (is_admin()) {
    wp_enqueue_script('theme-oh-my-brand-admin', ...);
}
```

### Script Loading Strategies

```php
// Modern script loading (WordPress 6.3+)
wp_enqueue_script(
    'my-script',
    $script_url,
    $deps,
    $version,
    [
        'strategy'  => 'defer',  // 'defer' or 'async'
        'in_footer' => true,
    ]
);
```

---

## Theme.json Configuration

### Structure

```json
{
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {
        "appearanceTools": true,
        "useRootPaddingAwareAlignments": true,
        "color": {
            "palette": [
                {
                    "slug": "primary",
                    "color": "#0066cc",
                    "name": "Primary"
                },
                {
                    "slug": "secondary",
                    "color": "#6c757d",
                    "name": "Secondary"
                }
            ],
            "gradients": [],
            "custom": true,
            "customGradient": true,
            "defaultPalette": false
        },
        "typography": {
            "fluid": true,
            "fontFamilies": [
                {
                    "fontFamily": "'Inter', system-ui, sans-serif",
                    "slug": "body",
                    "name": "Body"
                }
            ],
            "fontSizes": [
                {
                    "slug": "small",
                    "size": "0.875rem",
                    "name": "Small"
                },
                {
                    "slug": "medium",
                    "size": "1rem",
                    "name": "Medium"
                },
                {
                    "slug": "large",
                    "size": "1.25rem",
                    "name": "Large"
                }
            ]
        },
        "spacing": {
            "units": ["px", "rem", "%", "vw"],
            "spacingSizes": [
                {
                    "slug": "10",
                    "size": "0.625rem",
                    "name": "Extra Small"
                },
                {
                    "slug": "20",
                    "size": "1rem",
                    "name": "Small"
                }
            ]
        },
        "layout": {
            "contentSize": "720px",
            "wideSize": "1200px"
        }
    },
    "styles": {
        "blocks": {
            "acf/gallery-block": {
                "spacing": {
                    "padding": {
                        "top": "var(--wp--preset--spacing--40)",
                        "bottom": "var(--wp--preset--spacing--40)"
                    }
                }
            }
        }
    }
}
```

---

## Security Practices

### Nonce Verification

```php
// Form submission
if (!wp_verify_nonce($_POST['_wpnonce'] ?? '', 'gallery_action')) {
    wp_die(__('Security check failed.', 'theme-oh-my-brand'));
}

// AJAX requests
check_ajax_referer('gallery_nonce', 'nonce');
```

### Capability Checks

```php
// Before any privileged action
if (!current_user_can('edit_posts')) {
    wp_die(__('You do not have permission to perform this action.', 'theme-oh-my-brand'));
}

// For specific post
if (!current_user_can('edit_post', $post_id)) {
    return new WP_Error('forbidden', 'Access denied', ['status' => 403]);
}
```

### Data Validation

```php
// Validate and sanitize input
$gallery_id = isset($_GET['id']) ? absint($_GET['id']) : 0;
$title = isset($_POST['title']) ? sanitize_text_field($_POST['title']) : '';
$content = isset($_POST['content']) ? wp_kses_post($_POST['content']) : '';
$email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
$url = isset($_POST['url']) ? esc_url_raw($_POST['url']) : '';
```

### Database Queries

```php
global $wpdb;

// Always use prepare() for queries with variables
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE post_type = %s AND post_status = %s",
        'gallery',
        'publish'
    )
);

// Never interpolate variables directly
// ❌ Bad: "SELECT * FROM {$wpdb->posts} WHERE ID = {$id}"
// ✅ Good: $wpdb->prepare("SELECT * FROM {$wpdb->posts} WHERE ID = %d", $id)
```

---

*For PHP syntax and typing, see [CODING_STANDARDS_PHP.md](CODING_STANDARDS_PHP.md). For architecture overview, see [ARCHITECTURE.md](ARCHITECTURE.md). For testing, see [TESTING.md](TESTING.md).*
