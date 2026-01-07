# CSS Coding Standards

This document defines the CSS coding standards for the Oh My Brand! theme.

We use BEM methodology with CSS custom properties.

## Table of Contents

- [File Structure](#file-structure)
- [BEM Naming](#bem-naming)
- [Custom Properties](#custom-properties)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

---

## File Structure

```css
/**
 * Block: Gallery Carousel
 *
 * Styles for the gallery carousel component.
 */

/* ==========================================================================
   Custom Properties
   ========================================================================== */

.acf-gallery-carousel {
    --carousel-gap: 1rem;
    --carousel-transition-duration: 300ms;
    --carousel-transition-timing: ease-out;
    --carousel-button-size: 3rem;
    --carousel-button-color: var(--wp--preset--color--primary);
}

/* ==========================================================================
   Block Styles
   ========================================================================== */

.acf-gallery-carousel {
    position: relative;
    overflow: hidden;
}

/* ==========================================================================
   Element Styles
   ========================================================================== */

.acf-gallery-carousel__track {
    display: flex;
    gap: var(--carousel-gap);
    transition: transform var(--carousel-transition-duration) var(--carousel-transition-timing);
}

.acf-gallery-carousel__slide {
    flex: 0 0 100%;
}

.acf-gallery-carousel__image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

/* ==========================================================================
   Navigation
   ========================================================================== */

.acf-gallery-carousel__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.acf-gallery-carousel__button {
    width: var(--carousel-button-size);
    height: var(--carousel-button-size);
    border: none;
    background: var(--carousel-button-color);
    cursor: pointer;
}

.acf-gallery-carousel__button--prev {
    left: 1rem;
}

.acf-gallery-carousel__button--next {
    right: 1rem;
}

/* ==========================================================================
   States
   ========================================================================== */

.acf-gallery-carousel__button:hover {
    opacity: 0.8;
}

.acf-gallery-carousel__button:focus-visible {
    outline: 2px solid var(--wp--preset--color--primary);
    outline-offset: 2px;
}

.acf-gallery-carousel__button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ==========================================================================
   Responsive
   ========================================================================== */

@media (min-width: 768px) {
    .acf-gallery-carousel {
        --carousel-gap: 1.5rem;
        --carousel-button-size: 4rem;
    }

    .acf-gallery-carousel__slide {
        flex: 0 0 calc(50% - var(--carousel-gap) / 2);
    }
}

@media (min-width: 1024px) {
    .acf-gallery-carousel__slide {
        flex: 0 0 calc(33.333% - var(--carousel-gap) * 2 / 3);
    }
}
```

---

## BEM Naming

```css
/* Block */
.acf-gallery-carousel { }

/* Element (part of the block) */
.acf-gallery-carousel__track { }
.acf-gallery-carousel__slide { }
.acf-gallery-carousel__button { }

/* Modifier (variation of block or element) */
.acf-gallery-carousel--fullwidth { }
.acf-gallery-carousel__button--prev { }
.acf-gallery-carousel__button--next { }
.acf-gallery-carousel__slide--active { }
```

### BEM Rules

1. **Block** - Standalone entity that is meaningful on its own
2. **Element** - Part of a block with no standalone meaning (double underscore `__`)
3. **Modifier** - Flag on a block or element to change appearance/behavior (double dash `--`)

---

## Custom Properties

Define at block level, use theme.json tokens:

```css
.acf-block {
    /* Block-specific properties */
    --block-spacing: 1rem;
    --block-transition: 200ms ease;

    /* Reference theme.json tokens */
    color: var(--wp--preset--color--contrast);
    background: var(--wp--preset--color--base);
    font-family: var(--wp--preset--font-family--body);
    font-size: var(--wp--preset--font-size--medium);
}
```

### Benefits

- Easy theming and customization
- Consistent values across components
- Integration with WordPress theme.json
- Runtime modifications possible

---

## Responsive Design

Mobile-first with `min-width` breakpoints:

```css
/* Base (mobile) styles */
.acf-gallery {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .acf-gallery {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .acf-gallery {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }
}

/* Large desktop */
@media (min-width: 1280px) {
    .acf-gallery {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| Mobile | < 768px | Phones |
| Tablet | ≥ 768px | Tablets |
| Desktop | ≥ 1024px | Laptops |
| Large | ≥ 1280px | Desktops |

---

## Accessibility

### Focus Styles

```css
.acf-button:focus-visible {
    outline: 2px solid var(--wp--preset--color--primary);
    outline-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    .acf-carousel__track {
        transition: none;
    }
}
```

### High Contrast

```css
@media (prefers-contrast: high) {
    .acf-button {
        border: 2px solid currentColor;
    }
}
```

### Screen Reader Only

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

---

*Back to [Coding Standards](CODING_STANDARDS.md) | See also: [PHP Standards](CODING_STANDARDS_PHP.md), [TypeScript Standards](CODING_STANDARDS_TYPESCRIPT.md), [HTML Standards](CODING_STANDARDS_HTML.md)*
