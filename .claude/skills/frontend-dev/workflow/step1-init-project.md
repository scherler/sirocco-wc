# Step 1: Project Initialization

Initialize a new sirocco-wc project with proper structure, global theming, and build tools.

**Note**: The global theming system described in this guide is included in the `showcase` template. Use `sirocco-wc init -t showcase` to get the full theming infrastructure with CSS variables.

## Prerequisites

- Node.js 18+ and yarn/npm
- sirocco-wc CLI installed globally
- Basic understanding of Lit and Tailwind CSS

## Initialization Steps

### 1. Create Project Directory

```bash
mkdir my-app && cd my-app
yarn init -y
```

### 2. Install sirocco-wc Globally

**Note**: We use npm for global CLI installation (works regardless of your project's package manager):

```bash
npm i -g sirocco-wc
```

### 3. Initialize Sirocco Project

```bash
# Run sirocco init (default template - minimal)
sirocco-wc init

# Or use showcase template (includes global theming system with CSS variables)
sirocco-wc init -t showcase

# The showcase template includes:
# - src/main/ts/components/       # Component directory
# - src/main/ts/common/ThemesVariables.css  # Theme CSS variables
# - src/main/css/                 # Global CSS
# - theme.css                     # Tailwind v4 theme tokens (@theme block)
# - package.json (updated)        # Scripts added
# - Complete theming system (light/dark/auto modes)
```

### 4. Configure Global Theming

Tailwind v4 has no `tailwind.config.js` — edit `theme.css` at the project root
(imported by `bin/build.css.js`'s per-component pipeline via `bin/config.js`'s
`themeCssPath` lookup):

```css
/* theme.css */
@theme {
  --color-light-surface-primary: #ffffff;
  --color-light-surface-secondary: #f5f5f5;
  --color-light-surface-tertiary: #e0e0e0;
  --color-light-surface-elevated: #ffffff;
  --color-light-surface-overlay: rgba(0, 0, 0, 0.5);
  --color-light-text-primary: #000000;
  --color-light-text-secondary: #666666;
  --color-light-text-tertiary: #999999;
  --color-light-text-inverse: #ffffff;
  --color-light-border-default: #e0e0e0;
  --color-light-border-subtle: #f0f0f0;
  --color-light-border-strong: #cccccc;
  --color-light-accent-primary: #1976d2;
  --color-light-accent-secondary: #dc004e;
  --color-light-accent-success: #4caf50;
  --color-light-accent-warning: #ff9800;
  --color-light-accent-error: #f44336;

  --color-dark-surface-primary: #121212;
  --color-dark-surface-secondary: #1e1e1e;
  --color-dark-surface-tertiary: #2a2a2a;
  --color-dark-surface-elevated: #2a2a2a;
  --color-dark-surface-overlay: rgba(0, 0, 0, 0.8);
  --color-dark-text-primary: #ffffff;
  --color-dark-text-secondary: #b0b0b0;
  --color-dark-text-tertiary: #808080;
  --color-dark-text-inverse: #000000;
  --color-dark-border-default: #3a3a3a;
  --color-dark-border-subtle: #2a2a2a;
  --color-dark-border-strong: #4a4a4a;
  --color-dark-accent-primary: #90caf9;
  --color-dark-accent-secondary: #f48fb1;
  --color-dark-accent-success: #81c784;
  --color-dark-accent-warning: #ffb74d;
  --color-dark-accent-error: #ef5350;

  --spacing-128: 32rem;
  --spacing-144: 36rem;
  --radius-4xl: 2rem;
}
```

`@source` scanning (per-component, injected automatically by `bin/build.css.js`)
replaces the old `content: [...]` glob — no config needed for it.

### 5. Theme Variables (Showcase Template)

**If you used the showcase template**, you already have `ThemesVariables.css` at `src/main/ts/common/ThemesVariables.css`.

**Example structure** (from showcase template):

```css
/* From showcase template: src/main/ts/common/ThemesVariables.css */
:root,
[data-theme='light'] {
  --surface-primary: #ffffff;
  --surface-secondary: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #666666;
  --accent-primary: #1976d2;
  /* ...all theme variables */
}

:host([data-theme="dark"]) {
  --surface-primary: #121212;
  --surface-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --accent-primary: #90caf9;
  /* ...all theme variables */
}
```

### 6. Create Root Application Component

```typescript
// src/main/ts/components/App/App.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './App.styles';

@customElement('my-app')
export class App extends LitElement {
  static styles = [Styles];

  @property({ type: String }) theme: 'light' | 'dark' = 'light';

  render() {
    return html`
      <div data-theme="${this.theme}" class="min-h-screen bg-[var(--surface-primary)]">
        <header class="p-4 border-b border-[var(--border-default)]">
          <h1 class="text-2xl font-bold text-[var(--text-primary)]">
            My Application
          </h1>
          <button
            @click="${this._toggleTheme}"
            class="px-4 py-2 rounded bg-[var(--accent-primary)] text-[var(--text-inverse)]">
            Toggle Theme
          </button>
        </header>

        <main class="p-4">
          <slot></slot>
        </main>
      </div>
    `;
  }

  private _toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.dispatchEvent(new CustomEvent('theme-changed', { detail: this.theme }));
  }
}
```

### 7. Set Up package.json Scripts

```json
{
  "scripts": {
    "dev": "parcel src/index.html --port 3000",
    "build": "parcel build src/index.html",
    "sirocco:watch": "sirocco-wc watchCss",
    "css:build": "sirocco-wc buildCss",
    "test": "playwright test",
    "test:e2e": "playwright test --ui",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### 8. Create Entry HTML

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Application</title>
  <link rel="stylesheet" href="./main/ts/common/ThemesVariables.css">
</head>
<body>
  <my-app></my-app>
  <script type="module" src="./main/ts/components/App/index.ts"></script>
</body>
</html>
```

## Verification

### Test Development Server

```bash
# Terminal 1: Watch CSS
yarn sirocco:watch

# Terminal 2: Dev server
yarn dev
```

Navigate to `http://localhost:3000` and verify:
- ✅ Application loads
- ✅ Theme toggle button works
- ✅ Light/dark theme switches correctly
- ✅ CSS variables update on theme change

### Test Build

```bash
yarn build
```

Verify `dist/` directory contains:
- ✅ Minified JavaScript bundle
- ✅ CSS files
- ✅ index.html

## Project Structure

After initialization:

```
my-app/
├── src/
│   ├── main/
│   │   ├── ts/
│   │   │   └── components/
│   │   │       └── App/
│   │   │           ├── App.ts
│   │   │           ├── App.css
│   │   │           ├── App.styles.ts  # Auto-generated
│   │   │           └── index.ts
│   │   ├── common/
│   │   │   └── ThemesVariables.css    # From showcase template
│   │   └── css/
│   └── index.html
├── dist/                               # Build output
├── node_modules/
├── package.json
├── theme.css
├── tsconfig.json
└── .gitignore
```

## Next Steps

1. ✅ Project initialized with global theming
2. → Continue to [Step 2: Component Creation](step2-create-component.md)
3. Learn component patterns and DRY principles
4. Add Material Web Components
5. Implement accessibility features

## Common Issues

### Issue: Theme variables not updating

**Solution**: If using showcase template, modify `ThemesVariables.css` directly. For component styles, run `sirocco-wc buildCss` after editing component `.css` files

### Issue: Components not finding styles

**Solution**: Check that `.styles.ts` file exists (auto-generated) and is imported

### Issue: Hot reload not working

**Solution**: Restart `yarn sirocco:watch` and `yarn dev`

## Reference

- [Sirocco-WC Documentation](https://github.com/scherler/sirocco-wc)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lit Documentation](https://lit.dev/)
