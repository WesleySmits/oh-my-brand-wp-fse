---
name: typescript-standards
description: TypeScript coding standards for Oh My Brand! theme. Strict mode, interfaces, type definitions, classes, DOM manipulation, and patterns. Use when writing TypeScript components, utilities, or Web Components.
metadata:
  author: Wesley Smits
  version: "1.0.0"
---

# TypeScript Standards

TypeScript coding standards and patterns for the Oh My Brand! WordPress FSE theme.

---

## When to Use

- Writing TypeScript components or utilities
- Creating Web Components for block frontends
- Building editor components (`edit.tsx`)
- Working with DOM manipulation
- Defining type interfaces

---

## Reference Files

| File | Purpose |
|------|---------|
| [GalleryCarousel-example.ts](references/GalleryCarousel-example.ts) | Full class example (~110 lines) |
| [utility-functions.ts](references/utility-functions.ts) | Debounce/throttle utilities (~60 lines) |

---

## File Structure

```typescript
/**
 * Module description.
 */

// Imports - external first, then internal
import { someFunction } from 'external-library';
import { helperFunction } from '../utils/helper';

// Types and interfaces
interface ComponentOptions {
    readonly selector: string;
    animationDuration?: number;
}

// Constants
const DEFAULT_DURATION = 300;

// Main implementation
export class ComponentName { }

// Module initialization
export function initComponent(): void { }
```

---

## Strict Mode

TypeScript `strict: true` is enforced. All client-side code must be TypeScript (no `.js` files in `src/`).

---

## Type Definitions

### Interfaces vs Types

```typescript
// Interface for object shapes
interface GalleryImage {
    readonly id: number;
    url: string;
    alt: string;
}

// Interface for options
interface CarouselOptions {
    readonly visibleCount: number;
    autoplay?: boolean;
}

// Type for unions
type GalleryLayout = 'grid' | 'masonry' | 'carousel';

// Type for function signatures
type ImageClickHandler = (image: GalleryImage, index: number) => void;
```

### Readonly Properties

```typescript
interface BlockConfig {
    readonly id: string;
    readonly type: string;
    options: BlockOptions; // Can be modified
}

class Gallery {
    private readonly element: HTMLElement;
    private readonly images: readonly GalleryImage[];
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `GalleryCarousel` |
| Interfaces | PascalCase | `CarouselOptions` |
| Functions | camelCase | `initCarousel()` |
| Variables | camelCase | `currentIndex` |
| Constants | SCREAMING_SNAKE | `DEFAULT_DURATION` |
| Private fields | `#` prefix | `#currentIndex` |
| Files | kebab-case | `gallery-carousel.ts` |

---

## Classes

```typescript
export class GalleryCarousel {
    readonly #element: HTMLElement;
    readonly #options: Required<CarouselOptions>;
    #currentIndex = 0;

    constructor(element: HTMLElement, options: CarouselOptions = {}) {
        this.#element = element;
        this.#options = this.#mergeOptions(options);
        this.#init();
    }

    public goToSlide(index: number): void {
        this.#currentIndex = this.#normalizeIndex(index);
        this.#updateSlides();
    }

    public getCurrentIndex(): number {
        return this.#currentIndex;
    }

    public destroy(): void {
        this.#removeEventListeners();
    }

    #init(): void { }
    #mergeOptions(options: CarouselOptions): Required<CarouselOptions> { }
    #normalizeIndex(index: number): number { }
}
```

See [GalleryCarousel-example.ts](references/GalleryCarousel-example.ts) for the full implementation.

---

## Functions

```typescript
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}
```

See [utility-functions.ts](references/utility-functions.ts) for debounce and throttle implementations.

---

## DOM Manipulation

### Type-Safe Queries

```typescript
function getElement<T extends HTMLElement>(
    selector: string,
    parent: ParentNode = document
): T | null {
    return parent.querySelector<T>(selector);
}

// Usage
const gallery = getElement<HTMLDivElement>('.gallery');
const buttons = getElements<HTMLButtonElement>('[data-action]');
```

### Null Handling

```typescript
// Early return
const element = document.querySelector<HTMLElement>('.gallery');
if (!element) return;

// Optional chaining
const width = element?.offsetWidth ?? 0;

// Assertion (use sparingly)
const button = document.querySelector<HTMLButtonElement>('.btn')!;
```

---

## Event Handling

### Arrow Function Methods

```typescript
class Component {
    #handleClick = (event: MouseEvent): void => {
        event.preventDefault();
        this.#doSomething();
    };

    #bindEvents(): void {
        this.addEventListener('click', this.#handleClick);
    }

    #unbindEvents(): void {
        this.removeEventListener('click', this.#handleClick);
    }
}
```

### Custom Events

```typescript
this.dispatchEvent(
    new CustomEvent('gallery:slide-change', {
        bubbles: true,
        detail: { index: this.#currentIndex, total: this.#slideCount },
    })
);
```

---

## Exports

### Named Exports Only

```typescript
// ✅ Good - named exports
export class GalleryCarousel { }
export function initGallery(): void { }
export type { CarouselOptions, GalleryImage };

// ❌ Bad - default exports
export default class GalleryCarousel { }
```

---

## Anti-Patterns

| Avoid | Use Instead |
|-------|-------------|
| `any` | Proper types or generics |
| `var` | `const` (preferred) or `let` |
| Non-null assertion (`!`) without reason | Null handling with guards |
| Implicit return types | Explicit return types |

---

## Related Skills

- [web-components](../web-components/SKILL.md) - Web Component patterns
- [vitest-testing](../vitest-testing/SKILL.md) - TypeScript unit testing
- [block-editor-components](../block-editor-components/SKILL.md) - React editor components
- [html-standards](../html-standards/SKILL.md) - HTML and accessibility

---

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
