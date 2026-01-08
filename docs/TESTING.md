# Testing Guidelines

This document covers testing strategies and best practices for the Oh My Brand! theme.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Unit Testing (Vitest)](#unit-testing-vitest)
- [PHP Unit Testing (PHPUnit)](#php-unit-testing-phpunit)
- [End-to-End Testing (Playwright)](#end-to-end-testing-playwright)
- [Test Organization](#test-organization)
- [Coverage Requirements](#coverage-requirements)
- [Mocking and Fixtures](#mocking-and-fixtures)

---

## Testing Stack

| Tool | Purpose | Config File |
|------|---------|-------------|
| Vitest | TypeScript/JavaScript unit tests | `vitest.config.ts` |
| PHPUnit | PHP unit tests | `phpunit.xml` |
| Playwright | End-to-end browser tests | `playwright.config.ts` |

### Quick Commands

```bash
# JavaScript/TypeScript tests
pnpm test                    # Run once
pnpm run test:watch          # Watch mode
pnpm run test:coverage       # With coverage

# PHP tests
composer test               # Run PHPUnit

# E2E tests
pnpm run test:e2e            # Run Playwright
pnpm run test:e2e:ui         # Interactive UI mode
```

---

## Unit Testing (Vitest)

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: ['node_modules', 'tests', '*.config.*'],
        },
        setupFiles: ['./tests/setup.ts'],
    },
});
```

### Test Setup

```typescript
// tests/setup.ts
import { beforeEach, afterEach, vi } from 'vitest';

// Reset DOM before each test
beforeEach(() => {
    document.body.innerHTML = '';
});

// Clear all mocks after each test
afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});
```

### Writing Unit Tests

#### Basic Test Structure

```typescript
// blocks/acf-gallery-block/GalleryCarousel.test.ts
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { GalleryCarousel } from './GalleryCarousel';

describe('GalleryCarousel', () => {
    let element: HTMLElement;
    let carousel: GalleryCarousel;

    beforeEach(() => {
        // Setup DOM
        element = document.createElement('div');
        element.className = 'acf-gallery-carousel';
        element.innerHTML = `
            <div class="acf-gallery-carousel__track">
                <div class="acf-gallery-carousel__slide" data-index="0"></div>
                <div class="acf-gallery-carousel__slide" data-index="1"></div>
                <div class="acf-gallery-carousel__slide" data-index="2"></div>
            </div>
            <button class="acf-gallery-carousel__button--prev"></button>
            <button class="acf-gallery-carousel__button--next"></button>
        `;
        document.body.appendChild(element);

        // Create instance
        carousel = new GalleryCarousel(element);
    });

    describe('initialization', () => {
        it('should create instance with element', () => {
            expect(carousel).toBeDefined();
        });

        it('should find all slides', () => {
            expect(carousel.getSlideCount()).toBe(3);
        });

        it('should start at index 0', () => {
            expect(carousel.getCurrentIndex()).toBe(0);
        });
    });

    describe('navigation', () => {
        it('should go to next slide', () => {
            carousel.next();
            expect(carousel.getCurrentIndex()).toBe(1);
        });

        it('should go to previous slide', () => {
            carousel.goToSlide(2);
            carousel.prev();
            expect(carousel.getCurrentIndex()).toBe(1);
        });

        it('should not go below 0', () => {
            carousel.prev();
            expect(carousel.getCurrentIndex()).toBe(0);
        });

        it('should not exceed slide count', () => {
            carousel.goToSlide(10);
            expect(carousel.getCurrentIndex()).toBe(2);
        });
    });

    describe('button states', () => {
        it('should disable prev button at start', () => {
            const prevButton = element.querySelector('.acf-gallery-carousel__button--prev') as HTMLButtonElement;
            expect(prevButton.disabled).toBe(true);
        });

        it('should disable next button at end', () => {
            carousel.goToSlide(2);
            const nextButton = element.querySelector('.acf-gallery-carousel__button--next') as HTMLButtonElement;
            expect(nextButton.disabled).toBe(true);
        });
    });
});
```

#### Testing Async Code

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('AsyncComponent', () => {
    it('should load data', async () => {
        const component = new AsyncComponent();

        await component.loadData();

        expect(component.isLoaded).toBe(true);
    });

    it('should handle timeouts', async () => {
        vi.useFakeTimers();

        const callback = vi.fn();
        debounce(callback, 100)();

        // Fast-forward time
        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });
});
```

#### Testing DOM Events

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('EventHandling', () => {
    it('should handle click events', () => {
        const button = document.createElement('button');
        const handler = vi.fn();

        button.addEventListener('click', handler);
        button.click();

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', () => {
        const element = document.createElement('div');
        const handler = vi.fn();

        element.addEventListener('keydown', handler);
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].key).toBe('Escape');
    });
});
```

---

## PHP Unit Testing (PHPUnit)

### Configuration

```xml
<!-- phpunit.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<phpunit
    bootstrap="tests/php/bootstrap.php"
    colors="true"
    stopOnFailure="false"
>
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">tests/php</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">blocks</directory>
            <directory suffix=".php">includes</directory>
        </include>
    </coverage>
</phpunit>
```

### Bootstrap File

```php
<?php
// tests/php/bootstrap.php

declare(strict_types=1);

// Load Composer autoloader
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

// Define test constants
define('THEME_OH_MY_BRAND_PATH', dirname(__DIR__, 2));
define('THEME_OH_MY_BRAND_URI', 'http://localhost/wp-content/themes/oh-my-brand');
define('THEME_OH_MY_BRAND_VERSION', '1.0.0-test');

// Mock WordPress functions if not in integration test
if (!function_exists('esc_html')) {
    function esc_html(string $text): string {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_attr')) {
    function esc_attr(string $text): string {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_url')) {
    function esc_url(string $url): string {
        return filter_var($url, FILTER_SANITIZE_URL) ?: '';
    }
}

if (!function_exists('wp_kses_post')) {
    function wp_kses_post(string $content): string {
        return strip_tags($content, '<p><br><strong><em><a><ul><ol><li>');
    }
}
```

### Writing PHP Tests

#### Basic Test Structure

```php
<?php
// tests/php/Blocks/GalleryBlockTest.php

declare(strict_types=1);

namespace OhMyBrand\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

class GalleryBlockTest extends TestCase
{
    private array $defaultAttributes;

    protected function setUp(): void
    {
        parent::setUp();

        $this->defaultAttributes = [
            'id' => 'block_123',
            'className' => '',
            'align' => '',
        ];
    }

    #[Test]
    public function it_renders_empty_state_without_images(): void
    {
        // Arrange
        $attributes = $this->defaultAttributes;

        // Act
        $html = $this->renderBlock($attributes, []);

        // Assert
        $this->assertStringContainsString('acf-gallery-carousel__empty', $html);
        $this->assertStringContainsString('No images selected', $html);
    }

    #[Test]
    public function it_renders_images_when_provided(): void
    {
        // Arrange
        $images = [
            ['ID' => 1, 'url' => 'https://example.com/image1.jpg', 'alt' => 'Image 1'],
            ['ID' => 2, 'url' => 'https://example.com/image2.jpg', 'alt' => 'Image 2'],
        ];

        // Act
        $html = $this->renderBlock($this->defaultAttributes, $images);

        // Assert
        $this->assertStringContainsString('acf-gallery-carousel__slide', $html);
        $this->assertStringContainsString('image1.jpg', $html);
        $this->assertStringContainsString('image2.jpg', $html);
    }

    #[Test]
    public function it_adds_alignment_class(): void
    {
        // Arrange
        $attributes = array_merge($this->defaultAttributes, ['align' => 'wide']);

        // Act
        $html = $this->renderBlock($attributes, []);

        // Assert
        $this->assertStringContainsString('alignwide', $html);
    }

    #[Test]
    #[DataProvider('layoutProvider')]
    public function it_applies_layout_modifier(string $layout, string $expectedClass): void
    {
        // Arrange
        $attributes = $this->defaultAttributes;

        // Act
        $html = $this->renderBlock($attributes, [], $layout);

        // Assert
        $this->assertStringContainsString($expectedClass, $html);
    }

    public static function layoutProvider(): array
    {
        return [
            'grid layout' => ['grid', 'acf-gallery-carousel--grid'],
            'masonry layout' => ['masonry', 'acf-gallery-carousel--masonry'],
            'carousel layout' => ['carousel', 'acf-gallery-carousel--carousel'],
        ];
    }

    private function renderBlock(array $attributes, array $images, string $layout = 'grid'): string
    {
        // Mock ACF get_field
        // In real tests, you'd use a proper mocking framework
        ob_start();
        include THEME_OH_MY_BRAND_PATH . '/blocks/acf-gallery-block/render.php';
        return ob_get_clean();
    }
}
```

#### Testing Helper Functions

```php
<?php
// tests/php/Blocks/GalleryHelpersTest.php

declare(strict_types=1);

namespace OhMyBrand\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

require_once THEME_OH_MY_BRAND_PATH . '/blocks/acf-gallery-block/helpers.php';

class GalleryHelpersTest extends TestCase
{
    #[Test]
    public function render_gallery_image_returns_figure_element(): void
    {
        $image = [
            'ID' => 1,
            'url' => 'https://example.com/test.jpg',
            'alt' => 'Test image',
            'caption' => 'Test caption',
        ];

        $html = render_gallery_image($image, 0, true);

        $this->assertStringContainsString('<figure', $html);
        $this->assertStringContainsString('</figure>', $html);
    }

    #[Test]
    public function render_gallery_image_escapes_alt_text(): void
    {
        $image = [
            'ID' => 1,
            'url' => 'https://example.com/test.jpg',
            'alt' => '<script>alert("xss")</script>',
            'caption' => '',
        ];

        $html = render_gallery_image($image, 0, false);

        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
    }

    #[Test]
    public function render_gallery_image_returns_empty_string_for_missing_url(): void
    {
        $image = [
            'ID' => 1,
            'url' => '',
            'alt' => 'Test',
        ];

        $html = render_gallery_image($image, 0, false);

        $this->assertEmpty($html);
    }

    #[Test]
    public function first_image_loads_eagerly(): void
    {
        $image = [
            'ID' => 1,
            'url' => 'https://example.com/test.jpg',
            'alt' => 'Test',
        ];

        $html = render_gallery_image($image, 0, false);

        $this->assertStringContainsString('loading="eager"', $html);
    }

    #[Test]
    public function subsequent_images_load_lazily(): void
    {
        $image = [
            'ID' => 2,
            'url' => 'https://example.com/test.jpg',
            'alt' => 'Test',
        ];

        $html = render_gallery_image($image, 1, false);

        $this->assertStringContainsString('loading="lazy"', $html);
    }
}
```

---

## End-to-End Testing (Playwright)

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
});
```

### Writing E2E Tests

#### Basic Page Test

```typescript
// tests/e2e/gallery-block.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Gallery Block', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to a page with the gallery block
        await page.goto('/gallery-page/');
    });

    test('should display gallery carousel', async ({ page }) => {
        const gallery = page.locator('.acf-gallery-carousel');

        await expect(gallery).toBeVisible();
    });

    test('should show navigation buttons for multiple images', async ({ page }) => {
        const prevButton = page.locator('.acf-gallery-carousel__button--prev');
        const nextButton = page.locator('.acf-gallery-carousel__button--next');

        await expect(prevButton).toBeVisible();
        await expect(nextButton).toBeVisible();
    });

    test('should navigate to next slide on click', async ({ page }) => {
        const nextButton = page.locator('.acf-gallery-carousel__button--next');
        const track = page.locator('.acf-gallery-carousel__track');

        // Get initial transform
        const initialTransform = await track.evaluate(
            (el) => getComputedStyle(el).transform
        );

        // Click next
        await nextButton.click();

        // Wait for animation
        await page.waitForTimeout(350);

        // Get new transform
        const newTransform = await track.evaluate(
            (el) => getComputedStyle(el).transform
        );

        expect(newTransform).not.toBe(initialTransform);
    });

    test('should disable prev button on first slide', async ({ page }) => {
        const prevButton = page.locator('.acf-gallery-carousel__button--prev');

        await expect(prevButton).toBeDisabled();
    });

    test('should support keyboard navigation', async ({ page }) => {
        const gallery = page.locator('.acf-gallery-carousel');

        // Focus the gallery
        await gallery.focus();

        // Press right arrow
        await page.keyboard.press('ArrowRight');

        // Verify navigation occurred
        const nextButton = page.locator('.acf-gallery-carousel__button--next');
        const prevButton = page.locator('.acf-gallery-carousel__button--prev');

        // Prev should now be enabled
        await expect(prevButton).not.toBeDisabled();
    });
});
```

#### Accessibility Testing

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('gallery block should have no accessibility violations', async ({ page }) => {
        await page.goto('/gallery-page/');

        const results = await new AxeBuilder({ page })
            .include('.acf-gallery-carousel')
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('navigation buttons should have accessible labels', async ({ page }) => {
        await page.goto('/gallery-page/');

        const prevButton = page.locator('.acf-gallery-carousel__button--prev');
        const nextButton = page.locator('.acf-gallery-carousel__button--next');

        await expect(prevButton).toHaveAttribute('aria-label');
        await expect(nextButton).toHaveAttribute('aria-label');
    });

    test('should be navigable with keyboard only', async ({ page }) => {
        await page.goto('/gallery-page/');

        // Tab to gallery
        await page.keyboard.press('Tab');

        // Should be able to interact
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
    });
});
```

#### Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
    test('gallery block matches snapshot', async ({ page }) => {
        await page.goto('/gallery-page/');

        const gallery = page.locator('.acf-gallery-carousel');

        await expect(gallery).toHaveScreenshot('gallery-default.png');
    });

    test('gallery navigation state matches snapshot', async ({ page }) => {
        await page.goto('/gallery-page/');

        // Navigate to second slide
        await page.locator('.acf-gallery-carousel__button--next').click();
        await page.waitForTimeout(350);

        const gallery = page.locator('.acf-gallery-carousel');

        await expect(gallery).toHaveScreenshot('gallery-second-slide.png');
    });
});
```

---

## Test Organization

### Directory Structure

```
tests/
├── php/                          # PHPUnit tests
│   ├── bootstrap.php             # Test bootstrap
│   ├── Blocks/                   # Block tests
│   │   ├── GalleryBlockTest.php
│   │   ├── GalleryHelpersTest.php
│   │   └── FAQBlockTest.php
│   └── Includes/                 # Include tests
│       └── AssetsTest.php
│
├── e2e/                          # Playwright tests
│   ├── gallery-block.spec.ts
│   ├── faq-block.spec.ts
│   ├── accessibility.spec.ts
│   └── visual.spec.ts
│
├── setup.ts                      # Vitest setup
└── fixtures/                     # Test fixtures
    └── images/
```

### Naming Conventions

| Test Type | File Pattern | Example |
|-----------|--------------|---------|
| Unit (TS) | `*.test.ts` | `GalleryCarousel.test.ts` |
| Unit (PHP) | `*Test.php` | `GalleryBlockTest.php` |
| E2E | `*.spec.ts` | `gallery-block.spec.ts` |

---

## Coverage Requirements

### Minimum Thresholds

```typescript
// vitest.config.ts
coverage: {
    thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
    },
}
```

### What to Test

**Always test:**
- Public methods and functions
- Edge cases (empty arrays, null values, etc.)
- Error handling paths
- User interactions
- Accessibility features

**Don't test:**
- Third-party library internals
- WordPress core functions
- Simple getters/setters
- Private implementation details

---

## Mocking and Fixtures

### Vitest Mocking

```typescript
import { vi } from 'vitest';

// Mock a module
vi.mock('./utils/api', () => ({
    fetchData: vi.fn().mockResolvedValue({ data: [] }),
}));

// Mock a function
const mockCallback = vi.fn();
mockCallback.mockReturnValue('mocked value');

// Mock timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();

// Spy on method
const spy = vi.spyOn(object, 'method');
expect(spy).toHaveBeenCalledWith('arg');
```

### PHP Mocking

```php
<?php
use PHPUnit\Framework\TestCase;

class MockingTest extends TestCase
{
    public function test_with_mock(): void
    {
        // Create mock
        $mock = $this->createMock(SomeClass::class);

        // Configure mock
        $mock->expects($this->once())
             ->method('someMethod')
             ->with('argument')
             ->willReturn('result');

        // Use mock
        $result = $mock->someMethod('argument');

        $this->assertEquals('result', $result);
    }
}
```

### Test Fixtures

```typescript
// tests/fixtures/gallery.ts
export const mockGalleryImages = [
    {
        ID: 1,
        url: 'https://example.com/image1.jpg',
        alt: 'First image',
        width: 800,
        height: 600,
    },
    {
        ID: 2,
        url: 'https://example.com/image2.jpg',
        alt: 'Second image',
        width: 800,
        height: 600,
    },
];

export const mockEmptyGallery = {
    images: [],
    layout: 'grid',
};
```

---

*For code style, see [CODING_STANDARDS.md](CODING_STANDARDS.md). For architecture, see [ARCHITECTURE.md](ARCHITECTURE.md). For workflows, see [WORKFLOWS.md](WORKFLOWS.md).*
