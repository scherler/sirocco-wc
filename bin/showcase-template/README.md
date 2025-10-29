# [NAME]

[DESCRIPTION]

A comprehensive showcase and tutorial application demonstrating best practices for building modern web components using [Sirocco](https://github.com/scherler/sirocco-wc), Lit, and Tailwind CSS.

## Overview

This showcase application serves as an interactive tutorial and reference implementation for modern web component development. It demonstrates key concepts including theming, accessibility, performance optimization, and component architecture.

## Features Demonstrated

- **Web Component Architecture**: Built with Lit for lightweight, efficient components
- **Material Web Components Integration**: Demonstrates best practices for integrating Material Design components
- **Global Theming System**: Sophisticated CSS variable system supporting light, dark, and auto theme modes
- **Accessibility Best Practices**: ARIA labeling, keyboard navigation, and semantic HTML
- **Performance Optimization**: Efficient state management and CSS transform animations
- **Interactive Tutorials**: Built-in tutorial system covering:
  - Quick start guide
  - Accessible carousel implementation
  - Dark mode implementation
  - CSS variable usage
  - Material Web Components integration
  - Tailwind theming

## Technologies

- [Lit](https://lit.dev/docs/) - Web component library
- [Sirocco](https://github.com/scherler/sirocco-wc) - Web component development tooling
- [Material Web Components](https://github.com/material-components/material-web) - Google's Material Design web components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Parcel](https://parceljs.org/) - Zero-config build tool
- [Playwright](https://playwright.dev/) - Testing framework

This project follows the [open-wc](https://github.com/open-wc/open-wc) recommendations.

## Getting Started

Install dependencies:

```bash
yarn
```

## Development

Start the development server with hot reloading:

```bash
yarn start
```

The server will run at http://localhost:1234

This command automatically builds CSS and watches for changes to your Tailwind styles.

## Building

Build the project for production:

```bash
yarn build
```

This will:
1. Build optimized CSS with Tailwind
2. Bundle the TypeScript/JavaScript with Parcel
3. Output to the `dist` directory

## Testing

Run end-to-end tests with Playwright:

```bash
yarn test
```

## Project Structure

The source code is organized in `src/main/ts`:

```
src/main/ts/
├── components/     # Reusable web components
├── helper/         # Utility functions
├── index.ts        # Entry point
└── views/          # Page-level views and layouts
```

### Components

The `components` directory contains reusable web components like buttons, cards, carousels, and theme toggles. Each component is self-contained with its own styles.

### Views

The `views` directory contains higher-level views that compose components together. The showcase uses these to demonstrate different features and patterns.

### Helpers

The `helper` directory contains utility functions shared across components and views, including theme management and configuration helpers.

All components are built with [Lit](https://lit.dev/). For learning Lit, we recommend the interactive [tutorials](https://lit.dev/tutorials/).

## Component Architecture

### Anatomy of a Component

Each component/view follows a consistent structure:

```
ComponentName/
├── index.ts           # Barrel export
├── ComponentName.css  # Component styles
├── ComponentName.styles.ts  # Generated - DO NOT EDIT
└── ComponentName.ts   # Component logic
```

- **index.ts**: Barrel export for clean imports
- **ComponentName.css**: Write your styles here (Tailwind or vanilla CSS)
- **ComponentName.styles.ts**: Auto-generated during build - never edit manually
- **ComponentName.ts**: Component logic using Lit

Components use Shadow DOM for style encapsulation, so styles are scoped to each component.

### Creating New Components

Create a new component with the Sirocco CLI:

```bash
yarn :add newcomponent
```

Create a new view:

```bash
yarn :add myview -t views
```

The `-t` flag specifies the component type. If omitted, defaults to `components`.

### Styling

We use [Tailwind CSS](https://tailwindcss.com/docs) as the styling framework. You can use Tailwind classes directly in your templates or write CSS in the component's `.css` file.

Key points:
- The `.css` file must exist to trigger style generation
- Styles are automatically optimized to include only what's used
- Shadow DOM ensures complete style encapsulation
- Each component's styles are isolated from others

### Material Web Components Integration

Following Sirocco best practices, all Material Web Component imports are centralized in `src/main/ts/material-components.ts`. This pattern provides:

- **Better maintainability**: All external component imports in one place
- **Easy customization**: Add or remove components from a single file
- **Clear documentation**: Self-documenting list of available Material components

To use Material Web Components:

1. Install the package:

```bash
yarn add @material/web
```

2. Import the centralized file (already done in `index.ts`):

```typescript
import './material-components';
```

3. Use components in your templates:

```typescript
render() {
  return html`
    <md-filled-button>Click Me</md-filled-button>
    <md-filled-text-field label="Name"></md-filled-text-field>
  `;
}
```

4. Theme Material components using CSS variables in `ThemesVariables.css`:

```css
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
}
```

See `src/main/ts/material-components.ts` for the full list of available components and theming documentation.

## Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: Linting with TypeScript and Lit-specific rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

Format code:

```bash
yarn prettier
```

Lint code:

```bash
yarn lint
```

## Learning Resources

- [Lit Documentation](https://lit.dev/docs/)
- [Lit Interactive Tutorials](https://lit.dev/tutorials/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sirocco GitHub](https://github.com/scherler/sirocco-wc)
- [Open Web Components](https://open-wc.org/)

## License

MIT

## Author

Thorsten Scherler
