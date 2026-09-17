# Component Patterns

## Creating a New Component

```bash
# Use sirocco-wc CLI
sirocco-wc add MyComponent

# Or specify component type (default is 'components')
sirocco-wc add MyView -t views

# This creates:
# - MyComponent/MyComponent.ts
# - MyComponent/MyComponent.css
# - MyComponent/MyComponent.styles.ts (auto-generated)
# - MyComponent/index.ts
```

## Component Structure (DRY Pattern)

```typescript
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './MyComponent.styles';

@customElement('my-component')
export class MyComponent extends LitElement {
  static styles = [Styles];

  // Public API
  @property({ type: String }) title = '';
  @property({ type: Array }) items: Item[] = [];
  @property({ type: Boolean }) loading = false;

  // Internal state
  @state() private _selectedIndex = -1;

  // DRY - Extract repeated logic
  private _getItemClass(index: number) {
    return index === this._selectedIndex
      ? 'bg-[var(--surface-selected)]'
      : 'bg-[var(--surface-primary)]';
  }

  render() {
    if (this.loading) {
      return html`<md-circular-progress indeterminate></md-circular-progress>`;
    }

    return html`
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">${this.title}</h2>
        ${this.items.map((item, index) => html`
          <div
            class="${this._getItemClass(index)} p-2 rounded cursor-pointer"
            @click="${() => this._selectedIndex = index}">
            ${item.name}
          </div>
        `)}
      </div>
    `;
  }
}
```

## Global Theme Setup

Tailwind v4 has no `tailwind.config.js` — theme tokens live in a CSS-native
`theme.css` `@theme` block, loaded via `@import` from `bin/build.css.js`'s
per-component pipeline:

```css
/* theme.css */
@theme {
  --color-light-surface-primary: #ffffff;
  --color-light-surface-secondary: #f5f5f5;
  --color-light-surface-elevated: #ffffff;
  --color-light-text-primary: #000000;
  --color-light-text-secondary: #666666;
  --color-light-accent-primary: #1976d2;
  --color-light-accent-secondary: #dc004e;

  --color-dark-surface-primary: #121212;
  --color-dark-surface-secondary: #1e1e1e;
  --color-dark-surface-elevated: #2a2a2a;
  --color-dark-text-primary: #ffffff;
  --color-dark-text-secondary: #b0b0b0;
  --color-dark-accent-primary: #90caf9;
  --color-dark-accent-secondary: #f48fb1;
}
```

Reference these as `bg-light-surface-primary`, `text-dark-accent-primary`, etc.
(Tailwind v4 derives utility names from the `--color-*` custom property path),
or via `var(--color-light-surface-primary)` in hand-written CSS.
