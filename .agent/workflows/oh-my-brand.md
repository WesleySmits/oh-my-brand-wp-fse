# Oh My Brand! WordPress FSE Theme

This workflow provides AI assistant guidelines for the Oh My Brand! WordPress Full Site Editing child theme.

**Primary Reference:** See [AGENT.md](../../AGENT.md) for complete AI assistant guidelines.

---

## Project Overview

**Oh My Brand!** is a WordPress Full Site Editing (FSE) child theme built on the Ollie parent theme. It provides custom blocks for building branded websites.

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

---

## Quick Commands

| Task | Command |
|------|---------|
| Build for production | `pnpm run build` |
| Watch mode | `pnpm run watch` |
| Lint all code | `pnpm run lint` |
| Fix linting issues | `pnpm run lint:fix` |
| Run JS tests | `pnpm test` |
| Run PHP tests | `composer test` |
| Run E2E tests | `pnpm run test:e2e` |

---

## Skills

Specialized guides for common development tasks. Skills are located in `.shared/oh-my-brand/skills/` (symlinked from `.github/skills/`).

### Block Development

| Skill | Description |
|-------|-------------|
| [native-block-development](../../.shared/oh-my-brand/skills/native-block-development/SKILL.md) | Creating native WordPress blocks |
| [acf-block-registration](../../.shared/oh-my-brand/skills/acf-block-registration/SKILL.md) | ACF PRO blocks with field groups |
| [web-components](../../.shared/oh-my-brand/skills/web-components/SKILL.md) | Frontend interactivity patterns |
| [block-editor-components](../../.shared/oh-my-brand/skills/block-editor-components/SKILL.md) | React editor components |
| [block-scaffolds](../../.shared/oh-my-brand/skills/block-scaffolds/SKILL.md) | Copy-paste templates |

### Coding Standards

| Skill | Description |
|-------|-------------|
| [php-standards](../../.shared/oh-my-brand/skills/php-standards/SKILL.md) | PHP type safety and WordPress standards |
| [typescript-standards](../../.shared/oh-my-brand/skills/typescript-standards/SKILL.md) | TypeScript strict mode and patterns |
| [css-standards](../../.shared/oh-my-brand/skills/css-standards/SKILL.md) | BEM methodology and theme.json tokens |
| [html-standards](../../.shared/oh-my-brand/skills/html-standards/SKILL.md) | Semantic markup and accessibility |

### Testing

| Skill | Description |
|-------|-------------|
| [vitest-testing](../../.shared/oh-my-brand/skills/vitest-testing/SKILL.md) | TypeScript unit testing |
| [phpunit-testing](../../.shared/oh-my-brand/skills/phpunit-testing/SKILL.md) | PHP unit testing |
| [playwright-testing](../../.shared/oh-my-brand/skills/playwright-testing/SKILL.md) | E2E browser testing |

### Workflow & Architecture

| Skill | Description |
|-------|-------------|
| [fse-architecture](../../.shared/oh-my-brand/skills/fse-architecture/SKILL.md) | Project structure and data flow |
| [fse-git-workflow](../../.shared/oh-my-brand/skills/fse-git-workflow/SKILL.md) | Conventional Commits and CI/CD |

---

## Commit Message Format

Follow Conventional Commits specification:

```
<type>(<scope>): <description>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```bash
feat(gallery): Add lightbox functionality
fix(faq): Resolve accordion animation glitch
test(gallery): Add carousel navigation tests
```

---

## Important Conventions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| PHP Classes | PascalCase | `GalleryBlock` |
| PHP Functions | snake_case | `get_gallery_images()` |
| TS Classes | PascalCase | `GalleryCarousel` |
| TS Functions | camelCase | `initCarousel()` |
| CSS Classes | kebab-case BEM | `.wp-block-theme-oh-my-brand-gallery__item--active` |
| Native Blocks | theme-oh-my-brand/{name} | `theme-oh-my-brand/gallery` |
| ACF Blocks | acf/{name} | `acf/faq` |

### Security Practices

1. **Never trust user input** — Always validate and sanitize
2. **Escape output** — Use `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`
3. **Use nonces** — For form submissions and AJAX
4. **Capability checks** — Verify user permissions

---

*For complete guidelines, see [AGENT.md](../../AGENT.md).*
