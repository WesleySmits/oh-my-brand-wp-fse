# Coding Standards

This document serves as the index for all coding standards and conventions for the Oh My Brand! theme. Each language has its own dedicated document with detailed guidelines.

## Standards Documents

| Document | Description |
|----------|-------------|
| [WordPress Standards](CODING_STANDARDS_WORDPRESS.md) | FSE blocks, functions.php, REST API, hooks, theme.json |
| [PHP Standards](CODING_STANDARDS_PHP.md) | WordPress Coding Standards, strict typing, security practices |
| [TypeScript Standards](CODING_STANDARDS_TYPESCRIPT.md) | Type definitions, classes, DOM manipulation, patterns |
| [CSS Standards](CODING_STANDARDS_CSS.md) | BEM methodology, custom properties, responsive design |
| [HTML Standards](CODING_STANDARDS_HTML.md) | Semantic structure, accessibility requirements |

---

## Quick Reference

### Naming Conventions

| Type | PHP | TypeScript | CSS |
|------|-----|------------|-----|
| Classes | `PascalCase` | `PascalCase` | n/a |
| Methods/Functions | `snake_case` | `camelCase` | n/a |
| Variables | `snake_case` | `camelCase` | `--kebab-case` |
| Constants | `SCREAMING_SNAKE` | `SCREAMING_SNAKE` | n/a |
| Files | `kebab-case.php` | `kebab-case.ts` | `kebab-case.css` |

### CSS Class Naming (BEM)

```
.block                    → Component container
.block__element           → Child element
.block--modifier          → Block variation
.block__element--modifier → Element variation
```

Example: `.acf-gallery-carousel__button--prev`

---

## General Principles

### Code Quality

1. **Readability** - Write code that's easy to understand
2. **Maintainability** - Think about future developers
3. **Consistency** - Follow established patterns
4. **Simplicity** - Prefer simple solutions

### Performance

1. Minimize DOM operations
2. Use efficient selectors
3. Lazy load non-critical assets
4. Optimize images and media
5. Cache expensive computations

### Testing

1. Write tests for new functionality
2. Test edge cases
3. Ensure accessibility compliance
4. Test across browsers and devices

---

*For detailed guidelines, see the language-specific documents linked above. For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md). For testing guidelines, see [TESTING.md](TESTING.md). For workflows, see [WORKFLOWS.md](WORKFLOWS.md).*
