# Architecture

This document describes the architecture and structure of the Oh My Brand! WordPress FSE theme.

## Table of Contents

- [Project Structure](#project-structure)
- [Theme Architecture](#theme-architecture)
- [ACF Block Anatomy](#acf-block-anatomy)
- [Asset Pipeline](#asset-pipeline)
- [Data Flow](#data-flow)
- [Patterns and Templates](#patterns-and-templates)

---

## Project Structure

```
oh-my-brand/
├── 📄 functions.php          # Theme setup, hooks, block registration
├── 📄 style.css              # Theme metadata (required by WP)
├── 📄 theme.json             # Global styles, settings, block configuration
│
├── 📁 assets/                # Static assets
│   ├── 📁 css/              # Global stylesheets
│   │   ├── base.css         # Reset and base styles
│   │   ├── typography.css   # Typography rules
│   │   ├── layout.css       # Layout utilities
│   │   ├── buttons.css      # Button styles
│   │   ├── components.css   # Shared components
│   │   ├── media.css        # Media styles
│   │   ├── utils.css        # Utility classes
│   │   └── theme.css        # Theme-specific styles
│   ├── 📁 js/               # Compiled JavaScript
│   │   └── gallery.js       # Compiled gallery bundle
│   ├── 📁 icons/            # SVG icon files
│   └── 📁 images/           # Theme images
│
├── 📁 blocks/                # ACF custom blocks
│   ├── 📁 acf-faq/          # FAQ accordion block
│   ├── 📁 acf-gallery-block/# Image gallery block
│   ├── 📁 acf-youtube-block/# YouTube embed block
│   └── 📁 utils/            # Shared TypeScript utilities
│       ├── debounce.ts
│       └── debounce.test.ts
│
├── 📁 includes/              # PHP includes
│   ├── assets.php           # Asset registration
│   ├── block-helpers.php    # Block utility functions
│   ├── custom-image-controls.php
│   └── 📁 post-types/       # Custom post type definitions
│       └── social-links.php
│
├── 📁 patterns/              # Block patterns
│
├── 📁 acf-json/              # ACF field group JSON (auto-sync)
│   ├── group_*.json         # Field group definitions
│   └── ui_options_page_*.json
│
├── 📁 tests/                 # Test files
│   ├── 📁 php/              # PHPUnit tests
│   │   ├── bootstrap.php
│   │   └── 📁 Blocks/
│   ├── 📁 e2e/              # Playwright E2E tests
│   └── setup.ts             # Vitest setup
│
├── 📁 docs/                  # Documentation
│   ├── CODING_STANDARDS.md
│   ├── ARCHITECTURE.md      # This file
│   ├── TESTING.md
│   └── WORKFLOWS.md
│
├── 📁 .github/               # GitHub configuration
│   ├── 📁 workflows/        # GitHub Actions
│   │   └── ci.yml
│   └── copilot-instructions.md
│
└── 📄 Configuration files
    ├── AGENT.md             # AI assistant guidelines
    ├── README.md            # Project documentation
    ├── package.json         # Node dependencies
    ├── composer.json        # PHP dependencies
    ├── tsconfig.json        # TypeScript configuration
    ├── vite.config.ts       # Vite build configuration
    ├── vitest.config.ts     # Vitest test configuration
    ├── playwright.config.ts # Playwright E2E configuration
    ├── eslint.config.js     # ESLint configuration
    ├── stylelint.config.js  # Stylelint configuration
    ├── commitlint.config.js # Commit message linting
    ├── phpcs.xml            # PHP CodeSniffer rules
    ├── phpunit.xml          # PHPUnit configuration
    ├── .editorconfig        # Editor settings
    └── .wp-env.json         # wp-env configuration
```

---

## Theme Architecture

### Parent-Child Relationship

```
┌─────────────────────────────────────┐
│           WordPress Core            │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│         Ollie Parent Theme          │
│  ─────────────────────────────────  │
│  • Base FSE templates               │
│  • Default block styles             │
│  • Core patterns                    │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Oh My Brand! Child Theme       │
│  ─────────────────────────────────  │
│  • Custom ACF blocks                │
│  • Extended theme.json              │
│  • Custom patterns                  │
│  • Brand-specific styles            │
└─────────────────────────────────────┘
```

### File Loading Order

1. **WordPress Core** loads first
2. **Ollie Parent Theme** `functions.php`
3. **Oh My Brand!** `functions.php`
4. **theme.json** merges (child overrides parent)
5. **Block assets** loaded per-block when rendered

### functions.php Structure

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

require_once THEME_OH_MY_BRAND_PATH . '/includes/assets.php';
require_once THEME_OH_MY_BRAND_PATH . '/includes/block-helpers.php';
require_once THEME_OH_MY_BRAND_PATH . '/includes/post-types/social-links.php';

// ==========================================================================
// Theme Setup
// ==========================================================================

add_action('after_setup_theme', 'theme_oh_my_brand_setup');

function theme_oh_my_brand_setup(): void {
    // Theme supports
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');

    // Load editor styles
    add_editor_style('assets/css/theme.css');
}

// ==========================================================================
// Block Registration
// ==========================================================================

add_action('init', 'theme_oh_my_brand_register_blocks');

function theme_oh_my_brand_register_blocks(): void {
    // ACF blocks are auto-registered via block.json
    // Custom registration if needed
}
```

---

## ACF Block Anatomy

### Block Directory Structure

```
blocks/acf-gallery-block/
├── block.json              # Block metadata and registration
├── render.php              # Server-side render template
├── helpers.php             # Block-specific helper functions
├── style.css               # Block styles (auto-enqueued)
├── acf-gallery-block.php   # ACF registration (if not using block.json)
├── index.ts                # TypeScript entry point
├── GalleryCarousel.ts      # Main component class
└── GalleryCarousel.test.ts # Unit tests
```

### block.json

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "acf/gallery-block",
    "title": "Gallery",
    "description": "Display images in a carousel gallery.",
    "category": "media",
    "icon": "images-alt2",
    "keywords": ["gallery", "carousel", "images"],
    "acf": {
        "mode": "preview",
        "renderTemplate": "render.php"
    },
    "supports": {
        "align": ["wide", "full"],
        "anchor": true,
        "className": true,
        "color": {
            "background": true,
            "text": false
        },
        "spacing": {
            "margin": true,
            "padding": true
        }
    },
    "style": "file:./style.css",
    "script": "file:./index.js"
}
```

### render.php

```php
<?php
/**
 * Gallery block render template.
 *
 * @package theme-oh-my-brand
 *
 * @var array    $block      Block settings.
 * @var string   $content    Block inner HTML.
 * @var bool     $is_preview Is preview mode.
 * @var int      $post_id    Post ID.
 * @var array    $context    Block context.
 * @var WP_Block $block_instance Block instance.
 */

declare(strict_types=1);

// Load helpers
require_once __DIR__ . '/helpers.php';

// Get block data
$block_id    = $block['id'] ?? '';
$class_name  = $block['className'] ?? '';
$align       = $block['align'] ?? '';
$anchor      = $block['anchor'] ?? '';

// Get ACF fields
$images      = get_field('gallery_images') ?: [];
$layout      = get_field('gallery_layout') ?: 'grid';
$show_caption = get_field('show_captions') ?: false;

// Build classes
$classes = [
    'acf-gallery-carousel',
    $class_name,
    $align ? "align{$align}" : '',
    "acf-gallery-carousel--{$layout}",
];
$classes = array_filter($classes);

// Build attributes
$attrs = [
    'class' => implode(' ', $classes),
    'data-gallery-id' => esc_attr($block_id),
    'data-layout' => esc_attr($layout),
];

if ($anchor) {
    $attrs['id'] = esc_attr($anchor);
}

// Render
?>
<div <?php echo get_block_wrapper_attributes($attrs); ?>>
    <?php if (empty($images)) : ?>
        <p class="acf-gallery-carousel__empty">
            <?php esc_html_e('No images selected.', 'theme-oh-my-brand'); ?>
        </p>
    <?php else : ?>
        <div class="acf-gallery-carousel__track">
            <?php foreach ($images as $index => $image) : ?>
                <?php echo render_gallery_image($image, $index, $show_caption); ?>
            <?php endforeach; ?>
        </div>

        <?php if (count($images) > 1) : ?>
            <nav class="acf-gallery-carousel__nav" aria-label="<?php esc_attr_e('Gallery navigation', 'theme-oh-my-brand'); ?>">
                <button
                    class="acf-gallery-carousel__button acf-gallery-carousel__button--prev"
                    type="button"
                    aria-label="<?php esc_attr_e('Previous image', 'theme-oh-my-brand'); ?>"
                >
                    <?php echo get_icon('chevron-left'); ?>
                </button>
                <button
                    class="acf-gallery-carousel__button acf-gallery-carousel__button--next"
                    type="button"
                    aria-label="<?php esc_attr_e('Next image', 'theme-oh-my-brand'); ?>"
                >
                    <?php echo get_icon('chevron-right'); ?>
                </button>
            </nav>
        <?php endif; ?>
    <?php endif; ?>
</div>
```

### helpers.php

```php
<?php
/**
 * Gallery block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Render a single gallery image.
 *
 * @param array $image       Image data from ACF.
 * @param int   $index       Image index.
 * @param bool  $show_caption Whether to show caption.
 * @return string HTML output.
 */
function render_gallery_image(array $image, int $index, bool $show_caption): string {
    $id     = $image['ID'] ?? 0;
    $url    = $image['url'] ?? '';
    $alt    = $image['alt'] ?? '';
    $title  = $image['title'] ?? '';
    $caption = $image['caption'] ?? '';

    if (!$url) {
        return '';
    }

    ob_start();
    ?>
    <figure class="acf-gallery-carousel__slide" data-index="<?php echo esc_attr((string) $index); ?>">
        <img
            class="acf-gallery-carousel__image"
            src="<?php echo esc_url($url); ?>"
            alt="<?php echo esc_attr($alt); ?>"
            loading="<?php echo $index === 0 ? 'eager' : 'lazy'; ?>"
        >
        <?php if ($show_caption && $caption) : ?>
            <figcaption class="acf-gallery-carousel__caption">
                <?php echo wp_kses_post($caption); ?>
            </figcaption>
        <?php endif; ?>
    </figure>
    <?php
    return ob_get_clean();
}

/**
 * Get an SVG icon.
 *
 * @param string $name Icon name.
 * @return string SVG HTML.
 */
function get_icon(string $name): string {
    $icon_path = THEME_OH_MY_BRAND_PATH . "/assets/icons/{$name}.svg";

    if (!file_exists($icon_path)) {
        return '';
    }

    return file_get_contents($icon_path);
}
```

### TypeScript Component

```typescript
// blocks/acf-gallery-block/GalleryCarousel.ts

/**
 * Gallery carousel component.
 */
export class GalleryCarousel {
    private readonly element: HTMLElement;
    private readonly track: HTMLElement | null;
    private readonly slides: HTMLElement[];
    private readonly prevButton: HTMLButtonElement | null;
    private readonly nextButton: HTMLButtonElement | null;

    private currentIndex: number = 0;

    constructor(element: HTMLElement) {
        this.element = element;
        this.track = element.querySelector('.acf-gallery-carousel__track');
        this.slides = Array.from(element.querySelectorAll('.acf-gallery-carousel__slide'));
        this.prevButton = element.querySelector('.acf-gallery-carousel__button--prev');
        this.nextButton = element.querySelector('.acf-gallery-carousel__button--next');

        this.init();
    }

    private init(): void {
        this.attachEventListeners();
        this.updateNavigation();
    }

    private attachEventListeners(): void {
        this.prevButton?.addEventListener('click', () => this.prev());
        this.nextButton?.addEventListener('click', () => this.next());

        // Keyboard navigation
        this.element.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    public next(): void {
        this.goToSlide(this.currentIndex + 1);
    }

    public prev(): void {
        this.goToSlide(this.currentIndex - 1);
    }

    public goToSlide(index: number): void {
        const normalizedIndex = this.normalizeIndex(index);

        if (normalizedIndex === this.currentIndex) {
            return;
        }

        this.currentIndex = normalizedIndex;
        this.updateSlidePosition();
        this.updateNavigation();
    }

    private normalizeIndex(index: number): number {
        const max = this.slides.length - 1;
        return Math.max(0, Math.min(index, max));
    }

    private updateSlidePosition(): void {
        if (!this.track) return;

        const offset = this.currentIndex * -100;
        this.track.style.transform = `translateX(${offset}%)`;
    }

    private updateNavigation(): void {
        if (this.prevButton) {
            this.prevButton.disabled = this.currentIndex === 0;
        }
        if (this.nextButton) {
            this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
        }
    }

    private handleKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }
}

// Auto-initialize
document.querySelectorAll<HTMLElement>('.acf-gallery-carousel').forEach((element) => {
    new GalleryCarousel(element);
});
```

---

## Asset Pipeline

### Build Process (Vite)

```
Source Files                    Build Output
─────────────                   ────────────
blocks/
├── acf-gallery-block/
│   ├── index.ts          →    assets/js/gallery.js
│   └── GalleryCarousel.ts
└── utils/
    └── debounce.ts
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'assets/js',
        lib: {
            entry: {
                gallery: resolve(__dirname, 'blocks/acf-gallery-block/index.ts'),
            },
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
});
```

### Asset Registration (PHP)

```php
// includes/assets.php

add_action('wp_enqueue_scripts', 'theme_oh_my_brand_enqueue_assets');

function theme_oh_my_brand_enqueue_assets(): void {
    // Theme styles
    wp_enqueue_style(
        'theme-oh-my-brand-styles',
        THEME_OH_MY_BRAND_URI . '/assets/css/theme.css',
        [],
        THEME_OH_MY_BRAND_VERSION
    );
}

// Block-specific assets are auto-enqueued via block.json
```

---

## Data Flow

### ACF Field → Render Template → Frontend

```
┌─────────────────────┐
│    ACF Field Group  │
│   (acf-json/*.json) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   WordPress Editor  │
│   (Block Preview)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     get_field()     │
│   (ACF Function)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     render.php      │
│  (Block Template)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    HTML Output      │
│  (Frontend/Editor)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   TypeScript/JS     │
│  (Interactivity)    │
└─────────────────────┘
```

### Block Registration Flow

```
1. WordPress scans blocks/ directory
                ↓
2. Finds block.json files
                ↓
3. Registers blocks automatically
                ↓
4. ACF processes 'acf' property in block.json
                ↓
5. Links ACF field groups
                ↓
6. Block available in editor
```

---

## Patterns and Templates

### Block Pattern Structure

```php
// patterns/hero-section.php

<?php
/**
 * Title: Hero Section
 * Slug: theme-oh-my-brand/hero-section
 * Categories: featured
 * Keywords: hero, banner, header
 */
?>

<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull">
    <!-- wp:heading {"level":1} -->
    <h1 class="wp-block-heading">Welcome to Our Site</h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>Your compelling introduction text here.</p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons -->
    <div class="wp-block-buttons">
        <!-- wp:button -->
        <div class="wp-block-button">
            <a class="wp-block-button__link">Get Started</a>
        </div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
</div>
<!-- /wp:group -->
```

### theme.json Integration

```json
{
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {
        "color": {
            "palette": [
                {
                    "slug": "primary",
                    "color": "#0066cc",
                    "name": "Primary"
                }
            ]
        },
        "typography": {
            "fontFamilies": [
                {
                    "fontFamily": "'Inter', sans-serif",
                    "slug": "body",
                    "name": "Body"
                }
            ]
        },
        "spacing": {
            "units": ["px", "rem", "%", "vw"]
        }
    },
    "styles": {
        "blocks": {
            "acf/gallery-block": {
                "spacing": {
                    "padding": {
                        "top": "2rem",
                        "bottom": "2rem"
                    }
                }
            }
        }
    }
}
```

---

*For coding conventions, see [CODING_STANDARDS.md](CODING_STANDARDS.md). For testing, see [TESTING.md](TESTING.md). For workflows, see [WORKFLOWS.md](WORKFLOWS.md).*
