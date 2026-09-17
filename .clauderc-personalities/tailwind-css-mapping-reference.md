# Complete Tailwind CSS to Custom CSS Mapping Reference

**Purpose**: Comprehensive guide for migrating custom CSS properties to Tailwind utility classes using `@apply`.

## Core Principle

**ALWAYS use Tailwind utilities when they exist. Only use custom CSS for:**
- CSS variables: `var(--variable-name)`
- Complex calculations: `calc(100% - 2rem)`
- Non-standard values with no Tailwind equivalent
- Browser-specific properties: `-webkit-*`, `-moz-*`

---

## Layout

### Display

```css
/* ❌ Custom CSS */
display: block;
display: inline-block;
display: flex;
display: inline-flex;
display: grid;
display: inline-grid;
display: none;
display: contents;

/* ✅ Tailwind */
@apply block;
@apply inline-block;
@apply flex;
@apply inline-flex;
@apply grid;
@apply inline-grid;
@apply hidden;
@apply contents;
```

### Position

```css
/* ❌ Custom CSS */
position: static;
position: fixed;
position: absolute;
position: relative;
position: sticky;

/* ✅ Tailwind */
@apply static;
@apply fixed;
@apply absolute;
@apply relative;
@apply sticky;
```

### Overflow

```css
/* ❌ Custom CSS */
overflow: auto;
overflow: hidden;
overflow: visible;
overflow: scroll;
overflow-x: auto;
overflow-y: auto;

/* ✅ Tailwind */
@apply overflow-auto;
@apply overflow-hidden;
@apply overflow-visible;
@apply overflow-scroll;
@apply overflow-x-auto;
@apply overflow-y-auto;
```

### Z-Index

```css
/* ❌ Custom CSS */
z-index: 0;
z-index: 10;
z-index: 20;
z-index: 30;
z-index: 40;
z-index: 50;

/* ✅ Tailwind */
@apply z-0;
@apply z-10;
@apply z-20;
@apply z-30;
@apply z-40;
@apply z-50;
```

---

## Flexbox & Grid

### Flex Direction

```css
/* ❌ Custom CSS */
flex-direction: row;
flex-direction: row-reverse;
flex-direction: column;
flex-direction: column-reverse;

/* ✅ Tailwind */
@apply flex-row;
@apply flex-row-reverse;
@apply flex-col;
@apply flex-col-reverse;
```

### Flex Wrap

```css
/* ❌ Custom CSS */
flex-wrap: wrap;
flex-wrap: wrap-reverse;
flex-wrap: nowrap;

/* ✅ Tailwind */
@apply flex-wrap;
@apply flex-wrap-reverse;
@apply flex-nowrap;
```

### Flex

```css
/* ❌ Custom CSS */
flex: 1 1 0%;
flex: 1 1 auto;
flex: none;

/* ✅ Tailwind */
@apply flex-1;
@apply flex-auto;
@apply flex-none;
```

### Flex Grow & Shrink

```css
/* ❌ Custom CSS */
flex-grow: 0;
flex-grow: 1;
flex-shrink: 0;
flex-shrink: 1;

/* ✅ Tailwind */
@apply grow-0;
@apply grow;
@apply shrink-0;
@apply shrink;
```

### Justify Content

```css
/* ❌ Custom CSS */
justify-content: flex-start;
justify-content: flex-end;
justify-content: center;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;

/* ✅ Tailwind */
@apply justify-start;
@apply justify-end;
@apply justify-center;
@apply justify-between;
@apply justify-around;
@apply justify-evenly;
```

### Align Items

```css
/* ❌ Custom CSS */
align-items: flex-start;
align-items: flex-end;
align-items: center;
align-items: baseline;
align-items: stretch;

/* ✅ Tailwind */
@apply items-start;
@apply items-end;
@apply items-center;
@apply items-baseline;
@apply items-stretch;
```

### Gap

```css
/* ❌ Custom CSS */
gap: 0.25rem;  /* 4px */
gap: 0.5rem;   /* 8px */
gap: 0.75rem;  /* 12px */
gap: 1rem;     /* 16px */
gap: 1.5rem;   /* 24px */
gap: 2rem;     /* 32px */
gap: 3rem;     /* 48px */

/* ✅ Tailwind */
@apply gap-1;
@apply gap-2;
@apply gap-3;
@apply gap-4;
@apply gap-6;
@apply gap-8;
@apply gap-12;
```

---

## Spacing (Padding & Margin)

### All Sides

```css
/* ❌ Custom CSS */
padding: 1rem;     /* 16px */
padding: 1.5rem;   /* 24px */
padding: 2rem;     /* 32px */
margin: 1rem;
margin: 2rem;

/* ✅ Tailwind */
@apply p-4;
@apply p-6;
@apply p-8;
@apply m-4;
@apply m-8;
```

### Directional

```css
/* ❌ Custom CSS */
padding-top: 1rem;
padding-right: 1rem;
padding-bottom: 1rem;
padding-left: 1rem;
margin-top: 1rem;
margin-bottom: 1rem;

/* ✅ Tailwind */
@apply pt-4;
@apply pr-4;
@apply pb-4;
@apply pl-4;
@apply mt-4;
@apply mb-4;
```

### Axis

```css
/* ❌ Custom CSS */
padding-left: 1rem;
padding-right: 1rem;
padding-top: 1rem;
padding-bottom: 1rem;

/* ✅ Tailwind */
@apply px-4;  /* horizontal */
@apply py-4;  /* vertical */
```

### Negative Margin

```css
/* ❌ Custom CSS */
margin-top: -1rem;
margin-left: -0.5rem;

/* ✅ Tailwind */
@apply -mt-4;
@apply -ml-2;
```

---

## Sizing

### Width

```css
/* ❌ Custom CSS */
width: 100%;
width: 50%;
width: 25%;
width: auto;
width: 16rem;   /* 256px */
width: 20rem;   /* 320px */
max-width: 100%;
min-width: 0;

/* ✅ Tailwind */
@apply w-full;
@apply w-1/2;
@apply w-1/4;
@apply w-auto;
@apply w-64;
@apply w-80;
@apply max-w-full;
@apply min-w-0;
```

### Height

```css
/* ❌ Custom CSS */
height: 100%;
height: 100vh;
height: auto;
height: 2rem;    /* 32px */
min-height: 100vh;
max-height: 80vh;

/* ✅ Tailwind */
@apply h-full;
@apply h-screen;
@apply h-auto;
@apply h-8;
@apply min-h-screen;
@apply max-h-[80vh]; /* arbitrary value */
```

---

## Typography

### Font Family

```css
/* ❌ Custom CSS */
font-family: ui-sans-serif, system-ui;
font-family: ui-serif, Georgia;
font-family: ui-monospace, monospace;

/* ✅ Tailwind */
@apply font-sans;
@apply font-serif;
@apply font-mono;
```

### Font Size

```css
/* ❌ Custom CSS */
font-size: 0.75rem;   /* 12px */
font-size: 0.875rem;  /* 14px */
font-size: 1rem;      /* 16px */
font-size: 1.125rem;  /* 18px */
font-size: 1.25rem;   /* 20px */
font-size: 1.5rem;    /* 24px */
font-size: 2rem;      /* 32px */
font-size: 3rem;      /* 48px */

/* ✅ Tailwind */
@apply text-xs;
@apply text-sm;
@apply text-base;
@apply text-lg;
@apply text-xl;
@apply text-2xl;
@apply text-3xl;
@apply text-5xl;
```

### Font Weight

```css
/* ❌ Custom CSS */
font-weight: 100;
font-weight: 300;
font-weight: 400;
font-weight: 500;
font-weight: 600;
font-weight: 700;
font-weight: 800;

/* ✅ Tailwind */
@apply font-thin;
@apply font-light;
@apply font-normal;
@apply font-medium;
@apply font-semibold;
@apply font-bold;
@apply font-extrabold;
```

### Line Height

```css
/* ❌ Custom CSS */
line-height: 1;
line-height: 1.25;
line-height: 1.375;
line-height: 1.5;
line-height: 1.625;
line-height: 1.75;
line-height: 2;

/* ✅ Tailwind (Named utilities) */
@apply leading-none;     /* 1 */
@apply leading-tight;    /* 1.25 */
@apply leading-snug;     /* 1.375 */
@apply leading-normal;   /* 1.5 */
@apply leading-relaxed;  /* 1.625 */
@apply leading-loose;    /* 2 */

/* ✅ Tailwind (Arbitrary values for non-standard) */
@apply leading-[1.6];    /* 1.6 - custom value */
@apply leading-[1.75];   /* 1.75 - custom value */
@apply leading-[1.8];    /* 1.8 - custom value */

/* ✅ Tailwind (Spacing-based for rem values) */
@apply leading-7;        /* 1.75rem */
@apply leading-8;        /* 2rem */
```

**When to use which:**
- **Named utilities** (leading-tight, leading-normal, etc.): Best for standard line heights
- **Arbitrary unitless values** (leading-[1.6]): For specific unitless ratios not in Tailwind's scale
- **Spacing values** (leading-7): For absolute rem-based line heights
```

### Text Align

```css
/* ❌ Custom CSS */
text-align: left;
text-align: center;
text-align: right;
text-align: justify;

/* ✅ Tailwind */
@apply text-left;
@apply text-center;
@apply text-right;
@apply text-justify;
```

### Text Color

```css
/* ❌ Custom CSS */
color: #000000;
color: #ffffff;
color: rgb(255 255 255);
color: var(--text-primary);

/* ✅ Tailwind */
@apply text-black;
@apply text-white;
@apply text-white;
@apply text-[var(--text-primary)]; /* CSS variable with arbitrary value */
```

### Text Decoration

```css
/* ❌ Custom CSS */
text-decoration: underline;
text-decoration: line-through;
text-decoration: none;

/* ✅ Tailwind */
@apply underline;
@apply line-through;
@apply no-underline;
```

### Text Transform

```css
/* ❌ Custom CSS */
text-transform: uppercase;
text-transform: lowercase;
text-transform: capitalize;
text-transform: none;

/* ✅ Tailwind */
@apply uppercase;
@apply lowercase;
@apply capitalize;
@apply normal-case;
```

### White Space

```css
/* ❌ Custom CSS */
white-space: normal;
white-space: nowrap;
white-space: pre;
white-space: pre-line;
white-space: pre-wrap;

/* ✅ Tailwind */
@apply whitespace-normal;
@apply whitespace-nowrap;
@apply whitespace-pre;
@apply whitespace-pre-line;
@apply whitespace-pre-wrap;
```

---

## Backgrounds

### Background Color

```css
/* ❌ Custom CSS */
background-color: #ffffff;
background-color: rgb(255 255 255);
background-color: var(--surface-primary);

/* ✅ Tailwind */
@apply bg-white;
@apply bg-white;
@apply bg-[var(--surface-primary)]; /* CSS variable */
```

### Background

```css
/* ❌ Custom CSS */
background: linear-gradient(to right, #000, #fff);
background: var(--gradient-hero);

/* ✅ Tailwind (when using CSS variables) */
background: var(--gradient-hero); /* Keep as is - complex gradient */

/* ✅ Tailwind (simple gradients) */
@apply bg-gradient-to-r from-black to-white;
```

---

## Borders

### Border Width

```css
/* ❌ Custom CSS */
border-width: 0;
border-width: 1px;
border-width: 2px;
border-width: 4px;
border-top-width: 1px;
border-bottom-width: 2px;

/* ✅ Tailwind */
@apply border-0;
@apply border;      /* 1px */
@apply border-2;
@apply border-4;
@apply border-t;
@apply border-b-2;
```

### Border Color

```css
/* ❌ Custom CSS */
border-color: #e5e7eb;
border-color: var(--border-default);

/* ✅ Tailwind */
@apply border-gray-200;
@apply border-[var(--border-default)];
```

### Border Style

```css
/* ❌ Custom CSS */
border-style: solid;
border-style: dashed;
border-style: dotted;
border-style: none;

/* ✅ Tailwind */
@apply border-solid;
@apply border-dashed;
@apply border-dotted;
@apply border-none;
```

### Border Radius

```css
/* ❌ Custom CSS */
border-radius: 0;
border-radius: 0.25rem;  /* 4px */
border-radius: 0.375rem; /* 6px */
border-radius: 0.5rem;   /* 8px */
border-radius: 0.75rem;  /* 12px */
border-radius: 1rem;     /* 16px */
border-radius: 9999px;   /* full */

/* ✅ Tailwind */
@apply rounded-none;
@apply rounded-sm;
@apply rounded;
@apply rounded-md;
@apply rounded-lg;
@apply rounded-xl;
@apply rounded-full;
```

---

## Effects

### Box Shadow

```css
/* ❌ Custom CSS */
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
box-shadow: var(--shadow-md);

/* ✅ Tailwind */
@apply shadow-sm;
@apply shadow-md;
@apply shadow-[var(--shadow-md)]; /* CSS variable */
```

### Opacity

```css
/* ❌ Custom CSS */
opacity: 0;
opacity: 0.5;
opacity: 0.75;
opacity: 0.9;
opacity: 1;

/* ✅ Tailwind */
@apply opacity-0;
@apply opacity-50;
@apply opacity-75;
@apply opacity-90;
@apply opacity-100;
```

---

## Transitions & Animation

### Transition Property

```css
/* ❌ Custom CSS */
transition-property: all;
transition-property: color, background-color;
transition-property: none;

/* ✅ Tailwind */
@apply transition-all;
@apply transition-colors;
@apply transition-none;
```

### Transition Duration

```css
/* ❌ Custom CSS */
transition-duration: 75ms;
transition-duration: 100ms;
transition-duration: 150ms;
transition-duration: 200ms;
transition-duration: 300ms;

/* ✅ Tailwind */
@apply duration-75;
@apply duration-100;
@apply duration-150;
@apply duration-200;
@apply duration-300;
```

### Transition Timing

```css
/* ❌ Custom CSS */
transition-timing-function: linear;
transition-timing-function: ease-in;
transition-timing-function: ease-out;
transition-timing-function: ease-in-out;

/* ✅ Tailwind */
@apply ease-linear;
@apply ease-in;
@apply ease-out;
@apply ease-in-out;
```

### Transform

```css
/* ❌ Custom CSS */
transform: scale(1.05);
transform: rotate(45deg);
transform: translateX(1rem);
transform: translateY(-0.25rem);

/* ✅ Tailwind */
@apply scale-105;
@apply rotate-45;
@apply translate-x-4;
@apply -translate-y-1;
```

---

## Interactivity

### Cursor

```css
/* ❌ Custom CSS */
cursor: auto;
cursor: default;
cursor: pointer;
cursor: wait;
cursor: text;
cursor: move;
cursor: not-allowed;

/* ✅ Tailwind */
@apply cursor-auto;
@apply cursor-default;
@apply cursor-pointer;
@apply cursor-wait;
@apply cursor-text;
@apply cursor-move;
@apply cursor-not-allowed;
```

### Pointer Events

```css
/* ❌ Custom CSS */
pointer-events: none;
pointer-events: auto;

/* ✅ Tailwind */
@apply pointer-events-none;
@apply pointer-events-auto;
```

### User Select

```css
/* ❌ Custom CSS */
user-select: none;
user-select: text;
user-select: all;
user-select: auto;

/* ✅ Tailwind */
@apply select-none;
@apply select-text;
@apply select-all;
@apply select-auto;
```

---

## Scrollbar Styling

Scrollbar styling often requires custom CSS or can use Tailwind utilities for basic properties:

```css
/* Width/Height */
.element::-webkit-scrollbar {
  @apply w-1.5;      /* width: 6px */
  @apply w-2;        /* width: 8px */
}

/* Track (background) */
.element::-webkit-scrollbar-track {
  @apply bg-[var(--border-subtle)] rounded;
}

/* Thumb (draggable part) */
.element::-webkit-scrollbar-thumb {
  @apply bg-[var(--action-primary)] rounded;
}

/* Hover state */
.element::-webkit-scrollbar-thumb:hover {
  @apply bg-[var(--action-primary-hover)];
}
```

**Note**: While some properties like `width` and `background-color` can use Tailwind utilities via `@apply`, the pseudo-elements themselves (`::-webkit-scrollbar`, etc.) cannot be replaced with utilities.

---

## Special: CSS Variables with Arbitrary Values

Tailwind supports CSS variables using arbitrary value syntax:

```css
/* ❌ Custom CSS */
color: var(--text-primary);
background-color: var(--surface-primary);
border-color: var(--border-default);
box-shadow: var(--shadow-lg);

/* ✅ Tailwind with arbitrary values */
@apply text-[var(--text-primary)];
@apply bg-[var(--surface-primary)];
@apply border-[var(--border-default)];
@apply shadow-[var(--shadow-lg)];
```

**IMPORTANT**: CSS variables MUST use arbitrary value syntax `[var(--name)]`.

---

## Migration Strategy

### Step 1: Identify Properties

Scan CSS files for properties that have Tailwind equivalents.

### Step 2: Group by Priority

1. **High Priority** (most common):
   - Spacing (padding, margin, gap)
   - Typography (font-size, font-weight, line-height, color)
   - Layout (display, flex, grid)
   - Sizing (width, height)

2. **Medium Priority**:
   - Borders (width, radius, color)
   - Backgrounds
   - Effects (shadows, opacity)
   - Transitions

3. **Low Priority**:
   - Transforms
   - Advanced positioning
   - Filters

### Step 3: Refactor Pattern

```css
/* BEFORE */
.my-class {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--surface-primary);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

/* AFTER */
.my-class {
  @apply flex gap-4 p-6 bg-[var(--surface-primary)] rounded-md shadow-[var(--shadow-md)];
}
```

### Step 4: Keep When Necessary

```css
/* ✅ Keep - Complex calc */
width: calc(100% - 2rem);

/* ✅ Keep - Non-standard value */
line-height: 1.15;

/* ✅ Keep - Browser-specific */
-webkit-overflow-scrolling: touch;

/* ✅ Keep - Complex gradient (unless using arbitrary values) */
background: linear-gradient(135deg, var(--color-1) 0%, var(--color-2) 100%);
```

---

## Quick Reference: Common Patterns

| CSS Property | Custom Value | Tailwind Class |
|--------------|-------------|----------------|
| `display: flex` | - | `@apply flex` |
| `flex-direction: column` | - | `@apply flex-col` |
| `gap: 1.5rem` | 24px | `@apply gap-6` |
| `padding: 1rem` | 16px | `@apply p-4` |
| `margin-top: 2rem` | 32px | `@apply mt-8` |
| `width: 100%` | - | `@apply w-full` |
| `height: 100vh` | - | `@apply h-screen` |
| `font-size: 1.5rem` | 24px | `@apply text-2xl` |
| `font-weight: 700` | - | `@apply font-bold` |
| `line-height: 1.75` | - | `@apply leading-7` |
| `color: var(--text-primary)` | CSS var | `@apply text-[var(--text-primary)]` |
| `background-color: #fff` | white | `@apply bg-white` |
| `border-radius: 0.5rem` | 8px | `@apply rounded-md` |
| `border: 1px solid` | - | `@apply border` |
| `box-shadow: 0 4px 6px` | - | `@apply shadow-md` |
| `opacity: 0.9` | 90% | `@apply opacity-90` |
| `transition: all 200ms` | - | `@apply transition-all duration-200` |
| `cursor: pointer` | - | `@apply cursor-pointer` |
| `overflow-y: auto` | - | `@apply overflow-y-auto` |
| `position: relative` | - | `@apply relative` |
| `z-index: 50` | - | `@apply z-50` |

---

## Tooling

### VS Code Extension

Install **Tailwind CSS IntelliSense** for:
- Autocomplete for class names
- Hover previews
- Linting
- Syntax highlighting

### Build Check

After refactoring, always rebuild CSS:
```bash
yarn css:build
```

---

## Summary

**Golden Rules:**
1. ✅ **ALWAYS** check if Tailwind has a utility class first
2. ✅ Use arbitrary values `[var(--name)]` for CSS variables
3. ✅ Combine multiple utilities in single `@apply`
4. ✅ Keep only truly custom CSS (calc, non-standard, browser-specific)
5. ✅ Rebuild CSS after any changes

**Benefits:**
- Consistency with Tailwind's design system
- Smaller generated CSS (tree-shaking)
- Better IDE support (IntelliSense)
- Easier refactoring across projects
- Single source of truth for design tokens
