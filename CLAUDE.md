# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

sirocco-wc is a CLI scaffolding tool that fuses Lit web components with Tailwind CSS. It provides zero-configuration development using Parcel, with integrated Playwright and Jest testing, specifically designed for Jenkins plugin development.

The tool itself is built in Node.js and provides CLI commands to scaffold projects and generate web components.

## Core Architecture

### CLI Structure (bin/)

The CLI is built using @caporal/core and has four main commands defined in `bin/main.js`:

- **init** (`bin/init.js`): Scaffolds a new project by copying the template directory
- **add** (`bin/add.js`): Creates new Lit components with automatic CSS/TypeScript generation
- **buildCss** (`bin/build.styles.js`): Processes CSS files and generates `.styles.ts` files for Lit components
- **watchCss** (`bin/build.watch.js`): Watches for changes and rebuilds styles automatically

Configuration is centralized in `bin/config.js` with environment variable overrides:
- `SWC_TYPE`: Component type (default: 'components')
- `SWC_PREFIX`: Component prefix (default: 'swc-')
- `SWC_INDEX`: Index file name (default: 'index.ts')
- `SWC_SRC`: Source directory (default: 'src/main/ts')
- `SWC_CSS`: CSS glob pattern (default: 'src/main/ts/**/*.css')

### Component Generation Flow

1. `bin/add.js` creates a new component directory with:
   - `index.ts`: Barrel export file
   - `[ComponentName].ts`: Lit component class with @customElement decorator
   - `[ComponentName].css`: Tailwind CSS file
   - `[ComponentName].styles.ts`: Auto-generated (DO NOT EDIT)

2. The component is automatically registered in the parent `index.ts` file

3. `bin/build.css.js` uses PostCSS + Tailwind to:
   - Wrap CSS with Tailwind directives (@tailwind base/components/utilities)
   - Process through PostCSS pipeline with autoprefixer
   - Generate `.styles.ts` files as Lit css`` tagged templates
   - Strip comments from final output

### Template Structure (bin/template/)

The template provides a complete project setup with:
- Yarn 3.2.4 (Berry) with PnP enabled
- TypeScript configuration
- Parcel for bundling
- Playwright for E2E testing
- Jest for unit testing
- ESLint + Prettier with husky pre-commit hooks
- Tailwind CSS with @tailwindcss/forms, @tailwindcss/typography, @tailwindcss/line-clamp

Generated projects follow the structure:
```
src/main/ts/
├── components/    # Reusable web components
├── views/        # Page-level components
├── helper/       # Utility functions
└── index.ts      # Main entry point
```

## Common Development Commands

### Within sirocco-wc repository (tool development)

No build or test commands are defined in the root package.json. This is a simple Node.js CLI tool that runs directly.

### Within generated projects (for users of sirocco-wc)

```bash
# Install dependencies
yarn

# Start dev server with watch mode (runs on http://localhost:1234)
yarn start

# Build for production (creates bundle in configured DEST directory)
yarn build

# Run CSS build only
yarn css:build

# Watch CSS changes
yarn css:watch

# Add new component (with configured prefix)
yarn :add <componentname> [-t components|views|helper]

# Run tests
yarn test              # Playwright E2E tests
yarn lint              # ESLint
yarn prettier          # Format with Prettier

# Maven integration (for Jenkins plugins)
yarn mvnbuild          # Alias for yarn build
```

## Key Implementation Details

### Shadow DOM and Component Isolation

All components use Shadow DOM, which means:
- CSS is scoped per component (no leakage between components)
- Each component must import its own styles via `.styles.ts` files
- The `.css` file triggers style generation even if empty

### Style Generation Process

The `bin/build.css.js` module:
1. Reads the component's `.css` file
2. Wraps it with Tailwind directives
3. Sets `tailwindConfig.content` to the component's `.ts` file for JIT compilation
4. Processes through PostCSS with Tailwind and autoprefixer
5. Outputs as Lit-compatible `css\`...\`` template in `.styles.ts`
6. Strips comments and escapes backticks

This ensures only used Tailwind classes are included per component.

### Jenkins Plugin Integration

Generated projects are designed for Jenkins plugin development:
- Build outputs to configurable `[DEST]` directory
- Creates single bundled `index.js` and `index.css` files
- Public URL set to `./` for relative paths
- Consumable from Jelly files via:
  ```jelly
  <script type="module" src="${resURL}/plugin/$PLUGIN_NAME/js/index.js" />
  <link rel="stylesheet" href="${resURL}/plugin/$PLUGIN_NAME/js/index.css" />
  ```

### Barrel Exports Pattern

The codebase extensively uses barrel exports (index.ts files) for:
- Clean import paths
- Automatic component registration
- Hierarchical organization (components/ → views/ → main index.ts)

The `bin/add.js` automatically updates parent `index.ts` files when creating new components.

## Important Notes

- Never edit `.styles.ts` files - they are auto-generated and will be overwritten
- Always include a `.css` file (even if empty) for each component - the build system requires it
- Component names are automatically PascalCased and prefixed (e.g., 'test' → 'swc-test')
- The tool uses synchronous file operations throughout
- Tailwind config is loaded from the local project if available, otherwise uses minimal config

## Package Exports

The package exports `./tailwindcss` which provides access to `tailwindcss/plugin` for consumers to extend Tailwind configurations.
