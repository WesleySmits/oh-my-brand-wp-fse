# Development Workflows

This document describes the development, Git, and CI/CD workflows for the Oh My Brand! theme.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [CI/CD Pipeline](#cicd-pipeline)
- [Release Process](#release-process)
- [Troubleshooting](#troubleshooting)

---

## Development Workflow

### Initial Setup

```bash
# 1. Clone the repository
git clone git@github.com:WesleySmits/oh-my-brand-wp-fse.git
cd oh-my-brand-wp-fse

# 2. Install dependencies
npm install
composer install

# 3. Set up Git hooks
npm run prepare

# 4. Verify setup
npm run lint
npm test
composer test
```

### Daily Development

```bash
# 1. Start development
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Run watch mode for TypeScript
npm run watch

# 3. Make changes and test locally
# Local site: https://demo-site.local

# 4. Run linting before commit
npm run lint
npm run lint:fix  # Auto-fix issues

# 5. Run tests
npm test
composer test

# 6. Commit changes (triggers hooks)
git add .
git commit -m "feat(gallery): add lightbox feature"

# 7. Push and create PR
git push -u origin feature/your-feature-name
```

### Environment Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build |
| `npm run watch` | Development watch mode |
| `npm run lint` | Run all linters |
| `npm run lint:fix` | Fix linting issues |
| `npm test` | Run JS/TS tests |
| `npm run test:watch` | Watch mode for tests |
| `npm run test:coverage` | Tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `composer test` | Run PHP tests |
| `composer lint` | Run PHPCS |
| `composer lint:fix` | Run PHPCBF |

---

## Git Workflow

### Branch Naming

```
<type>/<description>

Types:
- feature/  → New features
- fix/      → Bug fixes
- docs/     → Documentation
- refactor/ → Code refactoring
- test/     → Test additions/updates
- chore/    → Maintenance tasks

Examples:
- feature/gallery-lightbox
- fix/carousel-navigation
- docs/update-readme
- refactor/optimize-helpers
- test/add-faq-tests
- chore/update-dependencies
```

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(gallery): add zoom functionality` |
| `fix` | Bug fix | `fix(faq): resolve accordion collapse issue` |
| `docs` | Documentation | `docs(readme): update installation steps` |
| `style` | Code style | `style(css): fix indentation` |
| `refactor` | Refactoring | `refactor(carousel): simplify state management` |
| `test` | Tests | `test(gallery): add navigation tests` |
| `chore` | Maintenance | `chore(deps): update vite to 6.0.1` |
| `perf` | Performance | `perf(images): implement lazy loading` |
| `ci` | CI changes | `ci(github): add e2e job` |

#### Scopes

Common scopes for this project:

- `gallery` - Gallery block
- `faq` - FAQ block
- `youtube` - YouTube block
- `theme` - Theme-wide changes
- `assets` - Asset pipeline
- `deps` - Dependencies
- `ci` - CI/CD configuration

#### Examples

```bash
# Feature with body
git commit -m "feat(gallery): add lightbox functionality

Implemented lightbox view for gallery images with:
- Click to open full-size image
- Keyboard navigation (arrows, escape)
- Touch swipe support

Closes #123"

# Simple fix
git commit -m "fix(carousel): prevent navigation beyond bounds"

# Breaking change
git commit -m "feat(api)!: change image format response

BREAKING CHANGE: Image response now includes srcset by default.
Update consuming code to handle new format."
```

### Git Hooks

Managed by Husky, hooks run automatically:

#### pre-commit
```bash
# Runs lint-staged on staged files
- ESLint for *.ts, *.js
- Stylelint for *.css
- PHPCS for *.php
```

#### commit-msg
```bash
# Validates commit message format
npx commitlint --edit $1
```

### Pull Request Process

1. **Create PR** from feature branch to `main`
2. **Fill template** with description and checklist
3. **CI runs** - all checks must pass
4. **Review** - get approval from maintainer
5. **Squash merge** to main

#### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No linting errors

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #123
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose

  lint-js:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint:js
      - run: npm run lint:css

  lint-php:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
      - run: composer install
      - run: composer lint

  test-unit-js:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4

  test-unit-php:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
      - run: composer install
      - run: composer test

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install chromium webkit
      - name: Start wp-env
        run: |
          npm install -g @wordpress/env
          wp-env start
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [lint-js, lint-php, test-unit-js, test-unit-php]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: assets/js/
```

### Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        Pull Request                               │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Commitlint                                  │
│                 (Validate commit messages)                        │
└───────────────────────────┬──────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│    Lint JS/CSS   │ │   Lint PHP   │ │   Unit Tests     │
│    (parallel)    │ │   (parallel) │ │   (parallel)     │
└────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
         │                  │                   │
         └──────────────────┼───────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                         E2E Tests                                 │
│                    (wp-env + Playwright)                          │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                          Build                                    │
│                   (Production bundle)                             │
└──────────────────────────────────────────────────────────────────┘
```

### Status Checks

All checks must pass before merging:

- ✅ commitlint
- ✅ lint-js
- ✅ lint-php
- ✅ test-unit-js
- ✅ test-unit-php
- ✅ test-e2e
- ✅ build

---

## Release Process

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

MAJOR → Breaking changes
MINOR → New features (backward compatible)
PATCH → Bug fixes (backward compatible)
```

### Creating a Release

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Update version in files
# - style.css (Theme Version)
# - package.json (version)
# - functions.php (THEME_OH_MY_BRAND_VERSION)

# 3. Update changelog
# Add entry to CHANGELOG.md

# 4. Commit version bump
git add .
git commit -m "chore(release): bump version to 1.2.0"

# 5. Create and push tag
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 6. Create GitHub release
# Go to GitHub → Releases → Create new release
# Select tag, add release notes
```

### Release Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in all files
- [ ] Tag created and pushed
- [ ] GitHub release created
- [ ] Deployment verified

---

## Troubleshooting

### Common Issues

#### npm install fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### composer install fails

```bash
# Check PHP version
php -v

# Clear cache and reinstall
rm -rf vendor composer.lock
composer clear-cache
composer install
```

#### Tests failing locally but passing in CI

```bash
# Reset test environment
rm -rf node_modules/.vitest
npm test -- --clearCache

# For PHP
rm -rf vendor
composer install
```

#### Git hooks not running

```bash
# Reinstall hooks
rm -rf .husky/_
npm run prepare
```

#### ESLint not finding config

```bash
# Ensure you're in project root
pwd

# Check config exists
ls -la eslint.config.js
```

#### Playwright browsers missing

```bash
# Install browsers
npx playwright install
```

#### wp-env issues

```bash
# Check Docker is running
docker info

# Reset wp-env
wp-env destroy
wp-env start --update
```

### Debug Tips

#### PHP Debugging

```php
// In wp-config.php (Local by Flywheel)
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);

// In code
error_log(print_r($variable, true));
// Check: wp-content/debug.log
```

#### TypeScript Debugging

```typescript
// Use VS Code debugger
// Set breakpoints in .ts files

// Or use console
console.log('Debug:', variable);
console.table(array);
console.trace();
```

#### Test Debugging

```bash
# Run single test file
npm test -- blocks/utils/debounce.test.ts

# Run with verbose output
npm test -- --reporter=verbose

# Run matching pattern
npm test -- --testNamePattern="should navigate"

# PHP single test
./vendor/bin/phpunit --filter test_render_returns_html
```

### Getting Help

1. Check this documentation first
2. Search existing GitHub issues
3. Check WordPress Developer Resources
4. Ask in team chat
5. Create a GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

---

*For code style, see [CODING_STANDARDS.md](CODING_STANDARDS.md). For architecture, see [ARCHITECTURE.md](ARCHITECTURE.md). For testing, see [TESTING.md](TESTING.md).*
