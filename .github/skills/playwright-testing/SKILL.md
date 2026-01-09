---
name: playwright-testing
description: Playwright E2E testing for Oh My Brand! theme. Browser automation, accessibility testing, visual regression, and block editor workflows. Use when writing end-to-end tests.
metadata:
  author: Wesley Smits
  version: "1.0.0"
---

# Playwright Testing

End-to-end testing with Playwright for the Oh My Brand! WordPress FSE theme.

---

## When to Use

- Testing block frontend behavior in real browsers
- Accessibility compliance testing
- Visual regression testing
- Block editor insertion and configuration workflows

---

## Configuration

See [playwright.config.ts](references/playwright.config.ts) for the full configuration template.

| Property | Value | Description |
|----------|-------|-------------|
| `testDir` | `./tests/e2e` | Test files location |
| `baseURL` | `http://localhost:8888` | wp-env URL |
| `trace` | `on-first-retry` | Debug failed tests |
| `screenshot` | `only-on-failure` | Capture failures |

### Browser Projects

| Project | Device | Purpose |
|---------|--------|---------|
| chromium | Desktop Chrome | Primary testing |
| webkit | Desktop Safari | macOS/iOS |
| mobile-chrome | Pixel 5 | Android mobile |
| mobile-safari | iPhone 12 | iOS mobile |

---

## Test Templates

### Frontend Block Tests

| Template | Purpose |
|----------|---------|
| [gallery-block.spec.ts](references/gallery-block.spec.ts) | Gallery carousel tests (visibility, navigation, button states) |
| [keyboard-navigation.spec.ts](references/keyboard-navigation.spec.ts) | Arrow keys, Escape, focus handling |
| [faq-block.spec.ts](references/faq-block.spec.ts) | Accordion expand/collapse, exclusive behavior |

### Accessibility Tests

| Template | Purpose |
|----------|---------|
| [accessibility.spec.ts](references/accessibility.spec.ts) | Axe-core WCAG compliance (wcag2a, wcag2aa, wcag21aa) |
| [focus-management.spec.ts](references/focus-management.spec.ts) | ARIA labels, live regions, focus trapping |

### Visual Testing

| Template | Purpose |
|----------|---------|
| [visual-regression.spec.ts](references/visual-regression.spec.ts) | Screenshot snapshots, responsive layouts |

### Block Editor Tests

| Template | Purpose |
|----------|---------|
| [block-editor.spec.ts](references/block-editor.spec.ts) | Insert block, configure settings, media upload, preview |

---

## Common Patterns

### Page Navigation

```typescript
test.beforeEach(async ({ page }) => {
    await page.goto('/gallery-page/');
});
```

### Element Selection

```typescript
// By class
const gallery = page.locator('.wp-block-theme-oh-my-brand-gallery');

// By data attribute
const button = page.locator('[data-gallery-next]');

// By role
const dialog = page.locator('dialog');
```

### Assertions

```typescript
await expect(element).toBeVisible();
await expect(element).toBeDisabled();
await expect(element).toHaveAttribute('aria-label');
await expect(element).toHaveScreenshot('name.png');
```

### Wait Patterns

```typescript
// Animation completion
await page.waitForTimeout(350);

// Element state
await page.waitForSelector('.editor-styles-wrapper');
```

---

## Accessibility with Axe

```typescript
import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page })
    .include('.wp-block-theme-oh-my-brand-gallery')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

expect(results.violations).toEqual([]);
```

---

## Running Tests

| Command | Purpose |
|---------|---------|
| `pnpm run test:e2e` | Run all E2E tests |
| `pnpm run test:e2e:ui` | Interactive UI mode |
| `pnpm run test:e2e -- --project=chromium` | Specific browser |
| `pnpm run test:e2e -- --headed` | Visible browser |
| `pnpm run test:e2e -- --debug` | Debug mode |
| `pnpm run test:e2e -- --update-snapshots` | Update visual snapshots |

---

## Related Skills

- [vitest-testing](../vitest-testing/SKILL.md) - Unit testing
- [phpunit-testing](../phpunit-testing/SKILL.md) - PHP unit testing
- [html-standards](../html-standards/SKILL.md) - Accessibility requirements
- [native-block-development](../native-block-development/SKILL.md) - Block development

---

## References

- [Playwright Documentation](https://playwright.dev/)
- [Axe-Core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WordPress E2E Testing](https://developer.wordpress.org/block-editor/contributors/code/testing-overview/)
