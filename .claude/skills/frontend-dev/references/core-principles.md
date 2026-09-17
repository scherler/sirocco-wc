# Core Principles

## 1. Global CSS Variables (Never Hardcode Colors)

**Why**: Single source of truth, easy theming, consistent design system

**Pattern**:
```css
/* ThemesVariables.css - From showcase template */
:root,
[data-theme='light'] {
  --surface-primary: #ffffff;
  --text-primary: #000000;
  --accent-primary: #1976d2;
}

[data-theme='dark'] {
  --surface-primary: #121212;
  --text-primary: #ffffff;
  --accent-primary: #90caf9;
}
```

**Usage in Components**:
```typescript
// Component.css
.card {
  @apply bg-[var(--surface-primary)] text-[var(--text-primary)];
}
```

## 2. DRY Component Composition

**Why**: Reduce duplication, improve maintainability, enable code reuse

**Pattern - Base Component**:
```typescript
// BaseCard.ts
export class BaseCard extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: Boolean }) elevated = false;

  render() {
    return html`
      <div class="${this.elevated ? 'shadow-lg' : 'shadow-sm'}
                  rounded-lg p-4 bg-[var(--surface-primary)]">
        <h3 class="text-lg font-semibold mb-2">${this.title}</h3>
        <slot></slot>
      </div>
    `;
  }
}
```

**Pattern - Specialized Component**:
```typescript
// UserCard.ts
export class UserCard extends BaseCard {
  @property({ type: Object }) user: User;

  render() {
    return html`
      <base-card title="${this.user.name}" elevated>
        <img src="${this.user.avatar}" class="w-12 h-12 rounded-full">
        <p>${this.user.email}</p>
      </base-card>
    `;
  }
}
```

## 3. Material Web Components Integration

**Why**: Accessible, tested, consistent with Material Design guidelines

**Pattern**:
```typescript
import '@material/web/button/filled-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/dialog/dialog.js';

// Usage in component
render() {
  return html`
    <md-filled-text-field
      label="Username"
      .value="${this.username}"
      @input="${this._handleInput}">
    </md-filled-text-field>

    <md-filled-button @click="${this._handleSubmit}">
      Submit
    </md-filled-button>
  `;
}
```

## 4. Tailwind Utility-First CSS

**Why**: Rapid development, no CSS bloat, responsive by default

**Best Practices**:
```css
/* ✅ Good - Utility classes with CSS variables */
.card {
  @apply p-4 rounded-lg shadow-sm;
  @apply bg-[var(--surface-primary)];
  @apply border border-[var(--border-subtle)];
}

/* ✅ Good - Responsive utilities */
.grid-layout {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

/* ❌ Bad - Hardcoded colors */
.card {
  background: #ffffff;
}

/* ❌ Bad - Custom CSS when utility exists */
.card {
  padding-left: 16px;
  padding-right: 16px;
}
```
