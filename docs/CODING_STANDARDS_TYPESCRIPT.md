# TypeScript Coding Standards

This document defines the TypeScript coding standards for the Oh My Brand! theme.

We use modern TypeScript with strict type checking.

> **Important**: All client-side code must be written in TypeScript. No `.js` files are permitted in the `src/` directory. This ensures type safety, better tooling support, and consistent code quality across the project.

## Table of Contents

- [File Structure](#file-structure)
- [Type Definitions](#type-definitions)
- [Naming Conventions](#naming-conventions)
- [Classes](#classes)
- [Functions](#functions)
- [DOM Manipulation](#dom-manipulation)
- [Event Handling](#event-handling)
- [Anti-Patterns](#anti-patterns)

---

## File Structure

```typescript
/**
 * Module description.
 *
 * @module ComponentName
 */

// Imports - external libraries first, then internal
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
export class ComponentName {
    // ...
}

// Module initialization
export function initComponent(): void {
    // ...
}
```

---

## Type Definitions

### Interfaces vs Types

Use interfaces for object shapes, types for unions/primitives:

```typescript
// Interface for object shapes
interface GalleryImage {
    readonly id: number;
    url: string;
    alt: string;
    width: number;
    height: number;
}

// Type for unions
type GalleryLayout = 'grid' | 'masonry' | 'carousel';

// Type for function signatures
type ImageClickHandler = (image: GalleryImage, index: number) => void;
```

### Readonly Properties

Use `readonly` for properties that shouldn't change:

```typescript
interface BlockConfig {
    readonly id: string;
    readonly type: string;
    options: BlockOptions; // Can be modified
}

class Gallery {
    private readonly element: HTMLElement;
    private readonly images: readonly GalleryImage[];

    constructor(element: HTMLElement, images: GalleryImage[]) {
        this.element = element;
        this.images = Object.freeze([...images]);
    }
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `GalleryCarousel`, `ImageLoader` |
| Interfaces | PascalCase | `GalleryOptions`, `ImageData` |
| Types | PascalCase | `LayoutType`, `EventHandler` |
| Functions | camelCase | `initGallery()`, `handleClick()` |
| Variables | camelCase | `imageCount`, `galleryItems` |
| Constants | SCREAMING_SNAKE | `MAX_IMAGES`, `API_ENDPOINT` |
| Private members | camelCase | `this.imageCache` |
| Files | kebab-case | `gallery-carousel.ts` |

---

## Classes

```typescript
/**
 * Gallery carousel component.
 *
 * Provides carousel functionality for image galleries with
 * touch support and keyboard navigation.
 */
export class GalleryCarousel {
    private readonly element: HTMLElement;
    private readonly options: Required<CarouselOptions>;
    private currentIndex: number = 0;
    private isAnimating: boolean = false;

    /**
     * Creates a new GalleryCarousel instance.
     *
     * @param element - The container element.
     * @param options - Configuration options.
     */
    constructor(element: HTMLElement, options: CarouselOptions = {}) {
        this.element = element;
        this.options = this.mergeOptions(options);
        this.init();
    }

    /**
     * Navigate to a specific slide.
     *
     * @param index - The slide index to navigate to.
     */
    public goToSlide(index: number): void {
        if (this.isAnimating || index === this.currentIndex) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex = this.normalizeIndex(index);
        this.updateSlides();
    }

    /**
     * Cleans up event listeners and resources.
     */
    public destroy(): void {
        this.removeEventListeners();
        this.element.innerHTML = '';
    }

    private init(): void {
        this.setupDOM();
        this.attachEventListeners();
    }

    private mergeOptions(options: CarouselOptions): Required<CarouselOptions> {
        return {
            autoplay: false,
            interval: 5000,
            ...options,
        };
    }

    private normalizeIndex(index: number): number {
        const slideCount = this.getSlideCount();
        return ((index % slideCount) + slideCount) % slideCount;
    }
}
```

---

## Functions

Prefer pure functions and explicit return types:

```typescript
/**
 * Debounces a function call.
 *
 * @param func - The function to debounce.
 * @param wait - The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}
```

---

## DOM Manipulation

Use type-safe DOM queries:

```typescript
/**
 * Safely query for an element.
 */
function getElement<T extends HTMLElement>(
    selector: string,
    parent: ParentNode = document
): T | null {
    return parent.querySelector<T>(selector);
}

/**
 * Query for elements with type safety.
 */
function getElements<T extends HTMLElement>(
    selector: string,
    parent: ParentNode = document
): T[] {
    return Array.from(parent.querySelectorAll<T>(selector));
}

// Usage
const gallery = getElement<HTMLDivElement>('.gallery');
const images = getElements<HTMLImageElement>('.gallery img');
```

---

## Event Handling

Use proper event typing:

```typescript
class Component {
    private handleClick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        // Handle click
    };

    private handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    private attachListeners(): void {
        this.element.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeydown);
    }

    private removeListeners(): void {
        this.element.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}
```

---

## Anti-Patterns

### Avoid These Patterns

```typescript
// ❌ Don't use `any`
function process(data: any): any { }

// ✅ Use proper types or generics
function process<T>(data: T): ProcessedData<T> { }

// ❌ Don't use `var`
var count = 0;

// ✅ Use `const` or `let`
const count = 0;
let mutableCount = 0;

// ❌ Don't use non-null assertion without reason
const element = document.querySelector('.item')!;

// ✅ Handle null cases
const element = document.querySelector('.item');
if (element) {
    // Use element
}

// ❌ Don't use default exports
export default class Gallery { }

// ✅ Use named exports
export class Gallery { }
```

---

*Back to [Coding Standards](CODING_STANDARDS.md) | See also: [PHP Standards](CODING_STANDARDS_PHP.md), [CSS Standards](CODING_STANDARDS_CSS.md), [HTML Standards](CODING_STANDARDS_HTML.md)*
