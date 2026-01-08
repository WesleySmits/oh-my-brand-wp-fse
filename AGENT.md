# AI Assistant Guidelines for Oh My Brand! Theme

This document serves as the central reference for AI assistants (GitHub Copilot, Claude, ChatGPT, Cursor, etc.) working on this WordPress Full Site Editing theme.

## Project Overview

**Oh My Brand!** is a WordPress Full Site Editing (FSE) child theme built on the Ollie parent theme. It provides custom ACF-powered blocks for building branded websites.

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| WordPress | 6.4+ | CMS Platform |
| PHP | 8.4+ | Server-side language |
| TypeScript | ES2020 | Client-side language |
| Vite | 6.x | Build tool |
| ACF PRO | Latest | Custom blocks |
| Vitest | Latest | JS unit testing |
| PHPUnit | 10.5 | PHP unit testing |
| Playwright | Latest | E2E testing |

### Development Environments

- **Local Development**: Local by Flywheel (`demo-site.local`)
- **CI/Testing**: wp-env (Docker-based, `localhost:8888`)

## Quick Reference

| Task | Command |
|------|---------|
| Build for production | `pnpm run build` |
| Watch mode | `pnpm run watch` |
| Lint all code | `pnpm run lint` |
| Fix linting issues | `pnpm run lint:fix` |
| Run JS tests | `pnpm test` |
| Run PHP tests | `composer test` |
| Run E2E tests | `pnpm run test:e2e` |

## Documentation Structure

- **[CODING_STANDARDS.md](docs/CODING_STANDARDS.md)** - Code style, naming conventions, patterns
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Project structure, block anatomy, data flow
- **[TESTING.md](docs/TESTING.md)** - Testing strategies and guidelines
- **[WORKFLOWS.md](docs/WORKFLOWS.md)** - Development, Git, and CI/CD workflows

## Code Guidelines Summary

### PHP Guidelines

```php
<?php
/**
 * Short description of file purpose.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OhMyBrand\Blocks;

/**
 * Class description.
 */
class ExampleBlock {
    /**
     * Method description.
     *
     * @param array<string, mixed> $attributes Block attributes.
     * @return string Rendered HTML.
     */
    public function render(array $attributes): string {
        // Implementation
    }
}
```

**Key PHP Rules:**
- Use `declare(strict_types=1)` in all PHP files
- Follow WordPress Coding Standards (WPCS)
- Use typed parameters and return types
- Escape all output (`esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`)
- Use `wp_enqueue_*` for assets, never inline

### TypeScript Guidelines

```typescript
/**
 * Component description.
 */
export class ComponentName {
    private readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.init();
    }

    private init(): void {
        // Implementation
    }
}
```

**Key TypeScript Rules:**
- Prefer `const` over `let`, never use `var`
- Use explicit types (avoid `any`)
- Use `readonly` for properties that shouldn't change
- Prefer composition over inheritance
- Export functions and classes, not default exports

### CSS Guidelines

```css
/* Block: Gallery Carousel */
.acf-gallery-carousel {
    --gallery-gap: 1rem;
    --gallery-transition: 300ms ease;

    display: grid;
    gap: var(--gallery-gap);
}

.acf-gallery-carousel__item {
    transition: opacity var(--gallery-transition);
}

.acf-gallery-carousel__item--active {
    opacity: 1;
}
```

**Key CSS Rules:**
- Use BEM naming: `.block__element--modifier`
- Define CSS custom properties at block root
- Mobile-first approach with `min-width` breakpoints
- Leverage `theme.json` design tokens

## Commit Message Format

Follow Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(gallery): add lightbox functionality
fix(faq): resolve accordion animation glitch
docs(readme): update installation instructions
test(gallery): add carousel navigation tests
```

## Common Tasks

### Creating a New ACF Block

1. Create block directory: `blocks/acf-{block-name}/`
2. Add required files:
   - `block.json` - Block registration
   - `render.php` - Server-side rendering
   - `helpers.php` - Helper functions
   - `style.css` - Block styles
   - `index.ts` - Client-side functionality (if needed)
3. Register in `functions.php` if not auto-discovered
4. Add ACF field group in admin or `acf-json/`

### Adding Tests

**Unit Test (TypeScript):**
```typescript
// blocks/acf-{block-name}/ComponentName.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    it('should initialize correctly', () => {
        const component = new ComponentName(element);
        expect(component).toBeDefined();
    });
});
```

**Unit Test (PHP):**
```php
<?php
namespace OhMyBrand\Tests\Blocks;

use PHPUnit\Framework\TestCase;

class BlockNameTest extends TestCase {
    public function test_render_returns_html(): void {
        // Arrange
        $attributes = ['field' => 'value'];

        // Act
        $result = render_block($attributes);

        // Assert
        $this->assertStringContainsString('<div', $result);
    }
}
```

### Debugging

**PHP Debugging:**
```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// In code
error_log(print_r($variable, true));
```

**TypeScript Debugging:**
- Use VS Code debugger with provided launch configurations
- Check browser DevTools console
- Use `console.log()` for quick debugging

## File Organization

```
oh-my-brand/
├── AGENT.md                 # This file - AI guidelines
├── README.md                # Project documentation
├── functions.php            # Theme setup and registration
├── style.css               # Theme metadata
├── theme.json              # Global styles and settings
├── assets/                 # Static assets
│   ├── css/               # Global stylesheets
│   ├── js/                # Compiled JavaScript
│   ├── icons/             # SVG icons
│   └── images/            # Theme images
├── blocks/                 # ACF custom blocks
│   ├── acf-{name}/        # Individual block
│   │   ├── block.json
│   │   ├── render.php
│   │   ├── helpers.php
│   │   ├── style.css
│   │   └── *.ts           # TypeScript if needed
│   └── utils/             # Shared utilities
├── includes/              # PHP includes
│   ├── assets.php         # Asset registration
│   ├── block-helpers.php  # Block utilities
│   └── post-types/        # Custom post types
├── patterns/              # Block patterns
├── acf-json/              # ACF field groups
├── tests/                 # Test files
│   ├── php/              # PHPUnit tests
│   ├── e2e/              # Playwright tests
│   └── setup.ts          # Vitest setup
└── docs/                  # Documentation
    ├── CODING_STANDARDS.md
    ├── ARCHITECTURE.md
    ├── TESTING.md
    └── WORKFLOWS.md
```

## Important Conventions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| PHP Classes | PascalCase | `GalleryBlock` |
| PHP Functions | snake_case | `get_gallery_images()` |
| PHP Constants | SCREAMING_SNAKE | `THEME_VERSION` |
| TS Classes | PascalCase | `GalleryCarousel` |
| TS Functions | camelCase | `initCarousel()` |
| CSS Classes | kebab-case BEM | `.acf-gallery__item--active` |
| Files | kebab-case | `gallery-carousel.ts` |
| Blocks | acf-{name} | `acf-gallery-block` |

### Security Practices

1. **Never trust user input** - Always validate and sanitize
2. **Escape output** - Use appropriate escaping functions
3. **Use nonces** - For form submissions and AJAX
4. **Capability checks** - Verify user permissions
5. **Prepared statements** - Use `$wpdb->prepare()` for queries

### Performance Considerations

1. **Lazy load images** - Use `loading="lazy"` attribute
2. **Defer non-critical JS** - Use `defer` or `async`
3. **Minimize DOM queries** - Cache element references
4. **Use CSS transforms** - For animations (GPU accelerated)
5. **Optimize images** - Proper sizes and formats

## When in Doubt

1. Check existing code for patterns
2. Reference the documentation files
3. Follow WordPress Coding Standards
4. Write tests for new functionality
5. Use TypeScript's type system
6. Keep accessibility in mind (WCAG 2.1 AA)

---

*This document is the central hub for AI assistants. For detailed information, see the linked documentation files.*
