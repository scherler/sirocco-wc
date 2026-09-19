---
name: frontend-dev
description: Expert guidance for building modern web UIs with Lit, Tailwind CSS, Material Web Components, and DRY principles using sirocco patterns
dependencies: sirocco-wc
version: 1.0.0
---

# Frontend Development - Sirocco Patterns Expert

Build modern, accessible web frontends using **Lit web components**, **Tailwind CSS**, **Material Web Components**, and proven **DRY (Don't Repeat Yourself)** principles. This skill provides expert guidance on sirocco-wc patterns for creating scalable, maintainable component libraries.

## Overview

This skill helps you build production-ready web frontends that follow industry best practices for:
- **Component architecture** - Lit web components with Shadow DOM isolation
- **Styling** - Tailwind CSS with global CSS variables for theming
- **Material Design** - Material Web Components integration
- **Code reusability** - DRY principles and component composition
- **Accessibility** - WCAG 2.1 AA compliance built-in
- **Performance** - Optimized builds with tree-shaking and lazy loading

## Key Features

1. **Global Theming System** - Single source of truth for colors, spacing, typography
2. **Shadow DOM Best Practices** - Proper encapsulation without style leakage
3. **Tailwind Integration** - Utility-first CSS with per-component compilation
4. **Material Web Components** - Pre-built, accessible components
5. **DRY Principles** - Reusable patterns, mixins, and utilities
6. **TypeScript Support** - Full type safety across components
7. **Testing Ready** - Playwright and Jest integration patterns

## Core Principles

**NEVER hardcode colors** - Always use global CSS variables for theming consistency
- See: `references/core-principles.md` (global CSS variables, theme setup)

**DRY Component Composition** - Extract common patterns into base components
- See: `references/core-principles.md` (base components, composition patterns)

**Material Web Components** - Use pre-built, accessible components
- See: `references/material-web-components.md` (component catalog, import patterns)

**Tailwind Utility-First CSS** - Prefer utilities over custom CSS
- See: `references/core-principles.md` (utility patterns, best practices)

## Quick Start

### Creating Components

```bash
# Add new component (default: components)
sirocco-wc add MyComponent

# Add component with type
sirocco-wc add MyView -t views
```

Detailed patterns: `references/component-patterns.md`

### Development Workflow

```bash
# Watch CSS changes and start dev server
yarn sirocco:watch
yarn dev

# Build for production
yarn build
```

All commands: `references/commands.md`

### Component Structure

```typescript
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './MyComponent.styles';

@customElement('my-component')
export class MyComponent extends LitElement {
  static styles = [Styles];

  @property({ type: String }) title = '';

  render() {
    return html`
      <div class="p-4 bg-[var(--surface-primary)]">
        <h2>${this.title}</h2>
      </div>
    `;
  }
}
```

Detailed examples: `references/component-patterns.md`

## Workflow Steps

### Step 1: Project Initialization
Set up sirocco-wc project, configure Tailwind with global theming
- See: `workflow/step1-init-project.md`

### Step 2: Component Creation
Create components with sirocco-wc CLI, define API, implement rendering
- See: `workflow/step2-create-component.md`

### Step 3: Global Theming
Define theme tokens, implement theme switching, test light/dark modes
- See: `workflow/step3-global-theme.md`

### Step 4: DRY Best Practices
Extract common patterns, create reusable mixins, document patterns
- See: `workflow/step4-best-practices.md`

### Step 5: Testing & Accessibility
Write E2E tests, test keyboard navigation, verify ARIA and contrast
- See: `workflow/step5-testing.md`

## Best Practices

### ✅ Do's
- Use global CSS variables for all colors
- Follow DRY principles - extract common patterns
- Use Material Web Components for standard UI
- Write semantic HTML with proper ARIA labels
- Keep components small and focused
- Run `sirocco-wc buildCss` after editing .css files

### ❌ Don'ts
- Don't edit .styles.ts files manually (auto-generated)
- Don't hardcode colors in components
- Don't skip accessibility testing
- Don't mix imperative DOM with declarative rendering

Full list: `references/best-practices.md`

## Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Color contrast ≥ 4.5:1 for normal text
- Color contrast ≥ 3:1 for large text and UI components

Details: `references/best-practices.md`

## Common Commands

```bash
# Development
yarn sirocco:watch    # Watch CSS changes
yarn dev              # Start dev server
yarn build            # Build for production

# Component Management
sirocco-wc add MyComponent     # Add new component
sirocco-wc buildCss            # Build CSS to .styles.ts
sirocco-wc watchCss            # Watch CSS changes

# Testing
yarn test             # Run all tests
yarn test:e2e         # E2E tests with Playwright
yarn test:watch       # Watch mode
```

All commands: `references/commands.md`

## Reference Documentation

- **Core Principles**: `references/core-principles.md` - CSS variables, DRY, Material Web, Tailwind
- **Component Patterns**: `references/component-patterns.md` - Component structure, theme setup
- **Material Web**: `references/material-web-components.md` - Component catalog
- **Commands**: `references/commands.md` - Development, testing, component management
- **Best Practices**: `references/best-practices.md` - Do's/Don'ts, accessibility

## Workflow Guides

- **Step 1**: `workflow/step1-init-project.md` - Project initialization
- **Step 2**: `workflow/step2-create-component.md` - Component creation
- **Step 3**: `workflow/step3-global-theme.md` - Global theming
- **Step 4**: `workflow/step4-best-practices.md` - DRY best practices
- **Step 5**: `workflow/step5-testing.md` - Testing & accessibility

## External Resources

- **Sirocco WC**: https://github.com/scherler/sirocco-wc
- **Material Web**: https://github.com/material-components/material-web

---

**Version**: 1.0.0
**Status**: Production Ready
**Expertise Level**: Expert guidance for modern web component development
