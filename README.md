# Oh My Brand! WordPress FSE Theme

A modern WordPress Full Site Editing (FSE) child theme based on [Ollie](https://developer.wordpress.org/themes/templates/). Built with ACF custom blocks, TypeScript, and professional development tooling.

## Requirements

- **PHP**: 8.4+
- **Node.js**: 20+
- **WordPress**: 6.4+
- **Parent Theme**: [Ollie](https://wordpress.org/themes/ollie/)
- **ACF PRO**: Required for custom blocks

## Quick Start

```bash
# Clone the repository
git clone https://github.com/WesleySmits/oh-my-brand-wp-fse.git

# Navigate to theme directory
cd oh-my-brand-wp-fse

# Install Node dependencies
npm install

# Install PHP dependencies
composer install

# Build assets
npm run build

# Start development (watch mode)
npm run dev
```

## Development

### Available Scripts

#### JavaScript/TypeScript

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite in watch mode |
| `npm run build` | Build production assets |
| `npm run lint` | Run ESLint and Stylelint |
| `npm run lint:js` | Run ESLint only |
| `npm run lint:css` | Run Stylelint only |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

#### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |

#### PHP

| Command | Description |
|---------|-------------|
| `composer phpcs` | Run PHP CodeSniffer |
| `composer phpcbf` | Auto-fix PHP issues |
| `composer test` | Run PHPUnit tests |
| `composer test:coverage` | Generate PHP coverage |

### Project Structure

```
oh-my-brand/
├── assets/               # Compiled assets
│   ├── css/              # CSS layers
│   │   ├── theme.css     # Main entry (imports all layers)
│   │   ├── base.css      # CSS custom properties, resets
│   │   ├── layout.css    # Layout utilities
│   │   ├── typography.css
│   │   ├── buttons.css
│   │   ├── components.css
│   │   └── utils.css
│   └── js/               # Compiled JavaScript
├── blocks/               # ACF custom blocks
│   ├── acf-gallery-block/
│   ├── acf-faq/
│   ├── acf-youtube-block/
│   └── utils/            # Shared TypeScript utilities
├── includes/             # PHP includes
│   ├── post-types/       # Custom post types
│   └── *.php
├── patterns/             # Block patterns
├── acf-json/             # ACF field exports
├── tests/                # Test files
│   ├── e2e/              # Playwright tests
│   └── php/              # PHPUnit tests
└── .github/
    ├── copilot-instructions.md
    └── workflows/ci.yml
```

### Creating a New ACF Block

1. Create directory structure:
   ```bash
   mkdir -p blocks/acf-{block-name}
   ```

2. Add required files:
   - `block.json` - Block registration
   - `render.php` - Render template
   - `helpers.php` - Helper functions (namespaced)
   - `style.css` - Block styles
   - `{BlockName}.ts` - TypeScript (if interactive)
   - `{BlockName}.test.ts` - Unit tests

3. Register in ACF

Example `helpers.php`:

```php
<?php
declare(strict_types=1);

namespace OMB\Blocks\BlockName;

function get_block_data(int $post_id): array {
    return [
        'field' => get_field('field_name', $post_id) ?? 'default',
    ];
}
```

### Code Style

#### PHP
- Use `declare(strict_types=1)` in all files
- Namespace all files: `OMB\Blocks\*` or `OMB\*`
- Follow WordPress Coding Standards
- Prefix functions with `omb_`

#### TypeScript
- Use private class fields (`#privateField`)
- Explicit return types on all functions
- Avoid `any` type
- Co-locate tests with source files

#### CSS
- Use CSS layers for organization
- CSS custom properties for theming
- BEM-like naming for custom classes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): Subject in sentence case

Body explaining what and why (optional)

Closes #123 (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes**: `blocks`, `gallery`, `faq`, `youtube`, `theme`, `assets`, `acf`, `deps`, `config`, `ci`

### Git Hooks

Pre-commit hooks automatically run:
- ESLint on TypeScript files
- Stylelint on CSS files
- Prettier formatting
- PHPCS on PHP files

Commit message hook validates Conventional Commits format.

## Testing

### Unit Tests (Vitest)

Tests are co-located with source files:

```
blocks/utils/debounce.ts
blocks/utils/debounce.test.ts
```

Run tests:
```bash
npm test
npm run test:coverage
```

### PHP Tests (PHPUnit)

Tests are in `tests/php/`:

```bash
# Install WordPress test suite (first time)
bash bin/install-wp-tests.sh wordpress_test root root localhost latest

# Run tests
composer test
```

### E2E Tests (Playwright)

Tests are in `tests/e2e/`:

```bash
# Install browsers
npx playwright install

# Run tests against local site
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

Configure base URL in `.env`:
```
WP_BASE_URL=http://demo-site.local
```

## CI/CD

GitHub Actions runs on push/PR to `main` and `develop`:

1. **Commit Lint** - Validates commit messages (PR only)
2. **Lint JS/CSS** - ESLint, Stylelint, Prettier, TypeScript
3. **Lint PHP** - PHPCS with WordPress standards
4. **Unit Tests (JS)** - Vitest with coverage
5. **Unit Tests (PHP)** - PHPUnit
6. **E2E Tests** - Playwright with wp-env
7. **Build** - Verifies production build

## VSCode Setup

Recommended extensions are listed in `.vscode/extensions.json`. Install them for:
- ESLint, Stylelint, Prettier integration
- PHP IntelliSense and debugging
- Vitest and Playwright test runners
- WordPress hooks and toolbox

## License

GPL-2.0-or-later

## Author

[Wesley Smits](https://github.com/WesleySmits)
