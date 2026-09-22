# Step 3: Global Theming

Implement a robust global theming system using CSS variables, supporting light/dark modes and custom themes.

## Why Global Theming?

**Benefits:**
- Single source of truth for design tokens
- Easy theme switching (light/dark/custom)
- Consistent colors across all components
- No component-specific theme code
- Easy maintenance and updates

**Anti-pattern** (Don't do this):
```typescript
// ❌ Bad: Per-component theming
class MyComponent extends LitElement {
  @property() theme = 'light';

  render() {
    const bgColor = this.theme === 'light' ? '#fff' : '#000';
    return html`<div style="background: ${bgColor}"></div>`;
  }
}
```

## Global Theming Architecture

### 1. Define Theme Tokens in `theme.css`

Tailwind v4 has no `tailwind.config.js` — theme tokens are CSS custom
properties in an `@theme` block, in `theme.css` at the project root:

```css
@theme {
  /* Light theme tokens */
  --color-light-surface-primary: #ffffff;
  --color-light-surface-secondary: #f5f5f5;
  --color-light-surface-tertiary: #e0e0e0;
  --color-light-surface-elevated: #ffffff;
  --color-light-surface-overlay: rgba(0, 0, 0, 0.5);
  --color-light-surface-inverse: #000000;
  --color-light-text-primary: #000000;
  --color-light-text-secondary: #666666;
  --color-light-text-tertiary: #999999;
  --color-light-text-disabled: #cccccc;
  --color-light-text-inverse: #ffffff;
  --color-light-border-default: #e0e0e0;
  --color-light-border-subtle: #f0f0f0;
  --color-light-border-strong: #cccccc;
  --color-light-border-focus: #1976d2;
  --color-light-accent-primary: #1976d2;
  --color-light-accent-primary-hover: #1565c0;
  --color-light-accent-secondary: #dc004e;
  --color-light-accent-secondary-hover: #c51162;
  --color-light-accent-success: #4caf50;
  --color-light-accent-warning: #ff9800;
  --color-light-accent-error: #f44336;
  --color-light-accent-info: #2196f3;

  /* Dark theme tokens */
  --color-dark-surface-primary: #121212;
  --color-dark-surface-secondary: #1e1e1e;
  --color-dark-surface-tertiary: #2a2a2a;
  --color-dark-surface-elevated: #2a2a2a;
  --color-dark-surface-overlay: rgba(0, 0, 0, 0.8);
  --color-dark-surface-inverse: #ffffff;
  --color-dark-text-primary: #ffffff;
  --color-dark-text-secondary: #b0b0b0;
  --color-dark-text-tertiary: #808080;
  --color-dark-text-disabled: #4a4a4a;
  --color-dark-text-inverse: #000000;
  --color-dark-border-default: #3a3a3a;
  --color-dark-border-subtle: #2a2a2a;
  --color-dark-border-strong: #4a4a4a;
  --color-dark-border-focus: #90caf9;
  --color-dark-accent-primary: #90caf9;
  --color-dark-accent-primary-hover: #64b5f6;
  --color-dark-accent-secondary: #f48fb1;
  --color-dark-accent-secondary-hover: #f06292;
  --color-dark-accent-success: #81c784;
  --color-dark-accent-warning: #ffb74d;
  --color-dark-accent-error: #ef5350;
  --color-dark-accent-info: #64b5f6;

  --spacing-128: 32rem;
  --spacing-144: 36rem;
  --text-xxs: 0.625rem;
  --shadow-elevated: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### 2. Theme Variables (From Showcase Template)

**Note**: The `ThemesVariables.css` file is provided by the showcase template (`sirocco-wc init -t showcase`). It's located at `src/main/ts/common/ThemesVariables.css` and uses Tailwind's theme function for centralized color management.

**`ThemesVariables.css` structure:**

```css
/* Theme CSS Variables - Provided by showcase template */
/* Location: src/main/ts/common/ThemesVariables.css */

:root,
[data-theme='light'] {
  /* Surface colors */
  --surface-primary: #ffffff;
  --surface-secondary: #f5f5f5;
  --surface-tertiary: #e0e0e0;
  --surface-elevated: #ffffff;
  --surface-overlay: rgba(0, 0, 0, 0.5);
  --surface-inverse: #000000;

  /* Text colors */
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-disabled: #cccccc;
  --text-inverse: #ffffff;

  /* Border colors */
  --border-default: #e0e0e0;
  --border-subtle: #f0f0f0;
  --border-strong: #cccccc;
  --border-focus: #1976d2;

  /* Accent colors */
  --accent-primary: #1976d2;
  --accent-primary-hover: #1565c0;
  --accent-secondary: #dc004e;
  --accent-secondary-hover: #c51162;
  --accent-success: #4caf50;
  --accent-warning: #ff9800;
  --accent-error: #f44336;
  --accent-info: #2196f3;
}

[data-theme='dark'] {
  /* Dark theme overrides */
  --surface-primary: #121212;
  --surface-secondary: #1e1e1e;
  --surface-tertiary: #2a2a2a;
  --surface-elevated: #2a2a2a;
  --surface-overlay: rgba(0, 0, 0, 0.8);
  --surface-inverse: #ffffff;

  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-tertiary: #808080;
  --text-disabled: #4a4a4a;
  --text-inverse: #000000;

  --border-default: #3a3a3a;
  --border-subtle: #2a2a2a;
  --border-strong: #4a4a4a;
  --border-focus: #90caf9;

  --accent-primary: #90caf9;
  --accent-primary-hover: #64b5f6;
  --accent-secondary: #f48fb1;
  --accent-secondary-hover: #f06292;
  --accent-success: #81c784;
  --accent-warning: #ffb74d;
  --accent-error: #ef5350;
  --accent-info: #64b5f6;
}
```

### 3. Implement Theme Provider Component

**`ThemeProvider.ts`:**

```typescript
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { themeContext, type Theme } from './theme-context';

@customElement('theme-provider')
export class ThemeProvider extends LitElement {
  @provide({ context: themeContext })
  @property({ type: String })
  theme: Theme = 'light';

  @state()
  private _systemPreference: Theme = 'light';

  connectedCallback() {
    super.connectedCallback();
    this._detectSystemPreference();
    this._watchSystemPreference();
  }

  render() {
    return html`
      <div data-theme="${this.theme}">
        <slot></slot>
      </div>
    `;
  }

  private _detectSystemPreference() {
    if (window.matchMedia) {
      this._systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  }

  private _watchSystemPreference() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this._systemPreference = e.matches ? 'dark' : 'light';
        this.dispatchEvent(new CustomEvent('system-theme-changed', {
          detail: this._systemPreference,
        }));
      });
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this._savePreference();
  }

  private _savePreference() {
    localStorage.setItem('theme-preference', this.theme);
  }

  private _loadPreference() {
    const saved = localStorage.getItem('theme-preference') as Theme;
    return saved || this._systemPreference;
  }
}
```

### 4. Create Theme Context (Optional)

**`theme-context.ts`:**

```typescript
import { createContext } from '@lit/context';

export type Theme = 'light' | 'dark';

export const themeContext = createContext<Theme>('theme');
```

### 5. Use Theme Variables in Components

**Always use CSS variables, never hardcode colors:**

```typescript
// Component.css
.card {
  /* ✅ Good: Use CSS variables */
  @apply bg-[var(--surface-primary)];
  @apply text-[var(--text-primary)];
  @apply border border-[var(--border-default)];
}

.card:hover {
  @apply bg-[var(--surface-secondary)];
  @apply border-[var(--border-strong)];
}

.button-primary {
  @apply bg-[var(--accent-primary)];
  @apply text-[var(--text-inverse)];
  @apply hover:bg-[var(--accent-primary-hover)];
}

/* ❌ Bad: Hardcoded colors */
.card {
  background: #ffffff;  /* Don't do this! */
  color: #000000;       /* Don't do this! */
}
```

### 6. Implement Theme Toggle Component

**`ThemeToggle.ts`:**

```typescript
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/iconbutton/icon-button.js';
import Styles from './ThemeToggle.styles';

@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  static styles = [Styles];

  @property({ type: String }) theme: 'light' | 'dark' = 'light';

  render() {
    const icon = this.theme === 'light' ? 'dark_mode' : 'light_mode';
    const label = this.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';

    return html`
      <md-icon-button
        @click="${this._handleToggle}"
        aria-label="${label}"
        class="theme-toggle">
        <md-icon>${icon}</md-icon>
      </md-icon-button>
    `;
  }

  private _handleToggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.dispatchEvent(new CustomEvent('theme-change', {
      detail: newTheme,
      bubbles: true,
      composed: true,
    }));
  }
}
```

### 7. Connect Theme in App Root

**`App.ts`:**

```typescript
@customElement('my-app')
export class App extends LitElement {
  @property({ type: String }) theme: 'light' | 'dark' = 'light';

  connectedCallback() {
    super.connectedCallback();
    this._loadTheme();
  }

  render() {
    return html`
      <theme-provider theme="${this.theme}" @theme-change="${this._handleThemeChange}">
        <div class="app">
          <header>
            <h1>My App</h1>
            <theme-toggle
              theme="${this.theme}"
              @theme-change="${this._handleThemeChange}">
            </theme-toggle>
          </header>

          <main>
            <slot></slot>
          </main>
        </div>
      </theme-provider>
    `;
  }

  private _loadTheme() {
    const saved = localStorage.getItem('theme-preference') as 'light' | 'dark';
    const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    this.theme = saved || systemPrefers;
  }

  private _handleThemeChange(e: CustomEvent<'light' | 'dark'>) {
    this.theme = e.detail;
    localStorage.setItem('theme-preference', this.theme);
  }
}
```

## Testing Theme System

### Manual Testing Checklist

```bash
# Start dev server
yarn dev
```

Test the following:

- [ ] **Light theme loads by default**
- [ ] **Theme toggle switches colors correctly**
- [ ] **All components respect theme**
- [ ] **No hardcoded colors visible**
- [ ] **System preference detection works**
- [ ] **Theme persists on page reload**
- [ ] **Focus indicators visible in both themes**
- [ ] **Color contrast meets WCAG AA** (4.5:1 minimum)

### Automated Theme Tests

```typescript
// theme.test.ts
import { expect, fixture, html } from '@open-wc/testing';
import './ThemeProvider';

describe('ThemeProvider', () => {
  it('applies light theme by default', async () => {
    const el = await fixture(html`
      <theme-provider>
        <div id="content">Test</div>
      </theme-provider>
    `);

    const container = el.shadowRoot!.querySelector('[data-theme]');
    expect(container?.getAttribute('data-theme')).to.equal('light');
  });

  it('switches to dark theme', async () => {
    const el = await fixture(html`
      <theme-provider theme="dark">
        <div id="content">Test</div>
      </theme-provider>
    `);

    const container = el.shadowRoot!.querySelector('[data-theme]');
    expect(container?.getAttribute('data-theme')).to.equal('dark');
  });
});
```

## Common Theming Patterns

### Pattern 1: Context-Aware Colors

```typescript
// Use semantic color names
.alert-success {
  @apply bg-[var(--accent-success)] text-[var(--text-inverse)];
}

.alert-error {
  @apply bg-[var(--accent-error)] text-[var(--text-inverse)];
}
```

### Pattern 2: State-Based Colors

```typescript
.button {
  @apply bg-[var(--accent-primary)] text-[var(--text-inverse)];

  &:hover {
    @apply bg-[var(--accent-primary-hover)];
  }

  &:disabled {
    @apply bg-[var(--surface-tertiary)] text-[var(--text-disabled)];
  }
}
```

### Pattern 3: Elevation Levels

```typescript
.card-flat {
  @apply bg-[var(--surface-primary)];
}

.card-elevated {
  @apply bg-[var(--surface-elevated)] shadow-elevated;
}
```

## Best Practices

### ✅ Do's

- Always use CSS variables for colors
- Define semantic color names (primary, secondary, success, error)
- Test both light and dark themes
- Respect system preferences
- Persist user's theme choice
- Ensure WCAG AA contrast ratios
- Use Material Design color guidelines

### ❌ Don'ts

- Don't hardcode color values
- Don't create per-component theme systems
- Don't forget to test focus indicators
- Don't skip contrast ratio checks
- Don't use `!important` to override theme colors
- Don't forget to rebuild (`sirocco-wc buildCss`) after changing theme.css

## Next Steps

1. ✅ Global theming implemented
2. → Continue to [Step 4: DRY Best Practices](step4-best-practices.md)
3. Learn component composition patterns
4. Extract reusable utilities
5. Create base component library

## Reference

- [Material Design Color System](https://m3.material.io/styles/color/overview)
- [WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
