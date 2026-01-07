# HTML Coding Standards

This document defines the HTML coding standards for the Oh My Brand! theme.

## Table of Contents

- [Semantic Structure](#semantic-structure)
- [Accessibility Requirements](#accessibility-requirements)
- [Attributes Best Practices](#attributes-best-practices)

---

## Semantic Structure

Use semantic HTML elements to convey meaning:

```html
<!-- Use semantic elements -->
<article class="acf-gallery-carousel">
    <header class="acf-gallery-carousel__header">
        <h2 class="acf-gallery-carousel__title">Gallery Title</h2>
    </header>

    <div class="acf-gallery-carousel__track" role="region" aria-label="Image gallery">
        <figure class="acf-gallery-carousel__slide">
            <img
                class="acf-gallery-carousel__image"
                src="image.jpg"
                alt="Descriptive alt text"
                width="800"
                height="600"
                loading="lazy"
            >
            <figcaption class="acf-gallery-carousel__caption">
                Image caption
            </figcaption>
        </figure>
    </div>

    <nav class="acf-gallery-carousel__nav" aria-label="Gallery navigation">
        <button
            class="acf-gallery-carousel__button acf-gallery-carousel__button--prev"
            type="button"
            aria-label="Previous image"
        >
            <span class="sr-only">Previous</span>
        </button>
        <button
            class="acf-gallery-carousel__button acf-gallery-carousel__button--next"
            type="button"
            aria-label="Next image"
        >
            <span class="sr-only">Next</span>
        </button>
    </nav>
</article>
```

### Semantic Element Usage

| Element | Usage |
|---------|-------|
| `<article>` | Self-contained content (blocks, posts) |
| `<section>` | Thematic grouping of content |
| `<header>` | Introductory content or navigational aids |
| `<nav>` | Navigation links |
| `<main>` | Main content of the document |
| `<aside>` | Tangentially related content |
| `<footer>` | Footer of section or page |
| `<figure>` | Self-contained content like images |
| `<figcaption>` | Caption for a figure |

---

## Accessibility Requirements

### Images

- All images **must** have `alt` attributes
- Decorative images should use `alt=""`
- Complex images need detailed descriptions

```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% in Q4 2025">

<!-- Decorative image -->
<img src="decorative-border.png" alt="">
```

### Interactive Elements

- Must be keyboard accessible
- Must have visible focus states
- Must have accessible names

```html
<button type="button" aria-label="Close dialog">
    <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

### ARIA Labels

Use ARIA labels for non-text content:

```html
<nav aria-label="Main navigation">
    <!-- navigation items -->
</nav>

<div role="region" aria-label="Image gallery">
    <!-- gallery content -->
</div>
```

### Heading Hierarchy

Maintain logical heading hierarchy:

```html
<h1>Page Title</h1>
    <h2>Section Title</h2>
        <h3>Subsection Title</h3>
    <h2>Another Section</h2>
```

### Color Contrast

- Ensure sufficient color contrast (WCAG 2.1 AA)
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

---

## Attributes Best Practices

### Image Attributes

```html
<img
    src="image.jpg"
    alt="Descriptive text"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
>
```

| Attribute | Purpose |
|-----------|---------|
| `alt` | Alternative text for accessibility |
| `width` / `height` | Prevents layout shift |
| `loading="lazy"` | Defers off-screen images |
| `decoding="async"` | Non-blocking decode |

### Button Attributes

```html
<button
    type="button"
    aria-label="Action description"
    aria-expanded="false"
    aria-controls="panel-id"
>
    Button Text
</button>
```

### Link Attributes

```html
<!-- External link -->
<a
    href="https://example.com"
    target="_blank"
    rel="noopener noreferrer"
>
    External Site
</a>

<!-- Internal link -->
<a href="/page/">Internal Page</a>
```

### Form Inputs

```html
<label for="email">Email Address</label>
<input
    type="email"
    id="email"
    name="email"
    required
    aria-describedby="email-hint"
>
<span id="email-hint">We'll never share your email.</span>
```

---

*Back to [Coding Standards](CODING_STANDARDS.md) | See also: [PHP Standards](CODING_STANDARDS_PHP.md), [TypeScript Standards](CODING_STANDARDS_TYPESCRIPT.md), [CSS Standards](CODING_STANDARDS_CSS.md)*
