# Step 2: Component Creation

Create new Lit web components following sirocco patterns with proper API design, TypeScript types, and Tailwind styling.

## Component Creation Workflow

### 1. Generate Component Scaffold

```bash
# Use sirocco-wc CLI
sirocco-wc add UserCard

# This creates (in default components directory):
UserCard/
├── UserCard.ts         # Component class
├── UserCard.css        # Tailwind styles
├── UserCard.styles.ts  # Auto-generated (don't edit)
└── index.ts            # Barrel export
```

### 2. Define Component API

**Component Interface** (`UserCard.ts`):

```typescript
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Styles from './UserCard.styles';

// Define types for component data
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'online' | 'offline' | 'away';
}

// Define custom events
export class UserSelectedEvent extends CustomEvent<User> {
  static readonly eventName = 'user-selected';

  constructor(user: User) {
    super(UserSelectedEvent.eventName, {
      detail: user,
      bubbles: true,
      composed: true,
    });
  }
}

@customElement('user-card')
export class UserCard extends LitElement {
  static styles = [Styles];

  // Public properties (component API)
  @property({ type: Object }) user!: User;
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean }) compact = false;

  // Private state (internal only)
  @state() private _hover = false;

  render() {
    return html`
      <div
        class="user-card ${this._getCardClasses()}"
        @mouseenter="${() => this._hover = true}"
        @mouseleave="${() => this._hover = false}"
        @click="${this._handleClick}"
        role="${this.selectable ? 'button' : 'article'}"
        tabindex="${this.selectable ? 0 : -1}"
        @keydown="${this._handleKeydown}">

        ${this._renderAvatar()}
        ${this._renderInfo()}
        ${this._renderStatus()}
      </div>
    `;
  }

  private _getCardClasses() {
    const classes = [
      'p-4 rounded-lg border border-[var(--border-default)]',
      'bg-[var(--surface-primary)]',
      'transition-all duration-200',
    ];

    if (this.selectable) {
      classes.push('cursor-pointer hover:shadow-md hover:border-[var(--accent-primary)]');
    }

    if (this.compact) {
      classes.push('p-2 flex-row items-center gap-2');
    } else {
      classes.push('flex-col items-start gap-3');
    }

    return classes.join(' ');
  }

  private _renderAvatar() {
    const avatarUrl = this.user.avatar || this._getDefaultAvatar();
    const size = this.compact ? 'w-10 h-10' : 'w-16 h-16';

    return html`
      <img
        src="${avatarUrl}"
        alt="${this.user.name}"
        class="${size} rounded-full object-cover"
        loading="lazy"
      />
    `;
  }

  private _renderInfo() {
    return html`
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-1">
          ${this.user.name}
        </h3>
        <p class="text-sm text-[var(--text-secondary)]">
          ${this.user.email}
        </p>
        <span class="inline-block px-2 py-1 mt-2 text-xs rounded
                     ${this._getRoleBadgeClass()}">
          ${this.user.role}
        </span>
      </div>
    `;
  }

  private _renderStatus() {
    return html`
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full ${this._getStatusColor()}"></span>
        <span class="text-xs text-[var(--text-secondary)] capitalize">
          ${this.user.status}
        </span>
      </div>
    `;
  }

  private _getDefaultAvatar() {
    // IMPORTANT: Replace with your own avatar generation service
    // This example uses a placeholder - implement your own solution for production
    return `/api/avatar/${encodeURIComponent(this.user.name)}`;
  }

  private _getRoleBadgeClass() {
    const roleColors = {
      admin: 'bg-[var(--accent-error)] text-white',
      user: 'bg-[var(--accent-primary)] text-white',
      guest: 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]',
    };
    return roleColors[this.user.role] || roleColors.guest;
  }

  private _getStatusColor() {
    const statusColors = {
      online: 'bg-[var(--accent-success)]',
      offline: 'bg-[var(--border-default)]',
      away: 'bg-[var(--accent-warning)]',
    };
    return statusColors[this.user.status] || statusColors.offline;
  }

  private _handleClick() {
    if (this.selectable) {
      this.dispatchEvent(new UserSelectedEvent(this.user));
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.selectable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      this._handleClick();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-card': UserCard;
  }
}
```

### 3. Style Component with Tailwind

**Component Styles** (`UserCard.css`):

```css
/* UserCard.css */
.user-card {
  /* Base styles using Tailwind utilities */
  @apply flex rounded-lg border;
  @apply bg-[var(--surface-primary)];
  @apply border-[var(--border-default)];
  @apply transition-all duration-200;

  /* Hover state for selectable cards */
  &:hover:not([disabled]) {
    @apply shadow-md;
    @apply border-[var(--accent-primary)];
  }

  /* Focus state for accessibility */
  &:focus-visible {
    @apply outline-none;
    @apply ring-2 ring-[var(--accent-primary)];
    @apply ring-offset-2;
  }
}

/* Compact variant */
.user-card.compact {
  @apply flex-row items-center gap-2 p-2;
}

/* Default variant */
.user-card:not(.compact) {
  @apply flex-col items-start gap-3 p-4;
}
```

After editing CSS, rebuild:

```bash
sirocco-wc buildCss
```

### 4. Use Component

```typescript
// In parent component or page
import './components/UserCard';

render() {
  return html`
    <user-card
      .user="${{
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'online'
      }}"
      selectable
      @user-selected="${this._handleUserSelected}">
    </user-card>
  `;
}

private _handleUserSelected(e: UserSelectedEvent) {
  console.log('User selected:', e.detail);
}
```

## DRY Principles in Components

### Pattern 1: Base Component Inheritance

**Create reusable base classes:**

```typescript
// BaseCard.ts
export abstract class BaseCard extends LitElement {
  @property({ type: Boolean }) elevated = false;
  @property({ type: Boolean }) interactive = false;

  protected getBaseClasses() {
    return [
      'rounded-lg p-4',
      'bg-[var(--surface-primary)]',
      'border border-[var(--border-default)]',
      this.elevated ? 'shadow-lg' : 'shadow-sm',
      this.interactive ? 'cursor-pointer hover:shadow-xl transition-shadow' : '',
    ].filter(Boolean).join(' ');
  }
}

// UserCard extends BaseCard
export class UserCard extends BaseCard {
  render() {
    return html`
      <div class="${this.getBaseClasses()}">
        <!-- User card content -->
      </div>
    `;
  }
}
```

### Pattern 2: Shared Utilities

**Extract common logic:**

```typescript
// utils/formatting.ts
export class Formatter {
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium'
    }).format(date);
  }

  static formatName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
  }

  static truncate(text: string, maxLength: number): string {
    return text.length > maxLength
      ? `${text.slice(0, maxLength)}...`
      : text;
  }
}

// Use in components
import { Formatter } from '../utils/formatting';

render() {
  return html`
    <p>${Formatter.truncate(this.description, 100)}</p>
  `;
}
```

### Pattern 3: Mixins for Shared Behavior

```typescript
// mixins/Themeable.ts
type Constructor<T = {}> = new (...args: any[]) => T;

export const Themeable = <T extends Constructor<LitElement>>(superClass: T) => {
  class ThemeableMixin extends superClass {
    @property({ type: String }) theme: 'light' | 'dark' = 'light';

    protected getThemeClass() {
      return this.theme === 'dark' ? 'dark-theme' : 'light-theme';
    }
  }
  return ThemeableMixin;
};

// Use in component
export class MyComponent extends Themeable(LitElement) {
  render() {
    return html`
      <div class="${this.getThemeClass()}">
        Content
      </div>
    `;
  }
}
```

## Component Testing

### Unit Test Example

```typescript
// UserCard.test.ts
import { expect, fixture, html } from '@open-wc/testing';
import './UserCard';
import type { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user information', async () => {
    const el = await fixture<UserCard>(html`
      <user-card
        .user="${{
          id: '1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'user',
          status: 'online',
        }}">
      </user-card>
    `);

    const name = el.shadowRoot!.querySelector('h3');
    expect(name?.textContent).to.equal('Jane Doe');
  });

  it('dispatches user-selected event when clicked', async () => {
    const el = await fixture<UserCard>(html`
      <user-card
        .user="${{ id: '1', name: 'Jane', email: 'jane@test.com', role: 'user', status: 'online' }}"
        selectable>
      </user-card>
    `);

    let selectedUser;
    el.addEventListener('user-selected', (e: any) => {
      selectedUser = e.detail;
    });

    const card = el.shadowRoot!.querySelector('.user-card') as HTMLElement;
    card.click();

    expect(selectedUser).to.deep.equal(el.user);
  });
});
```

## Best Practices Summary

### ✅ Do's

- Define clear TypeScript interfaces for component data
- Use `@property` for public API, `@state` for internal state
- Implement proper keyboard navigation (`tabindex`, `@keydown`)
- Extract repeated logic into private methods
- Use semantic HTML and ARIA roles
- Dispatch custom events for parent communication
- Keep render methods clean and readable
- Use CSS variables for all colors
- Test components in isolation

### ❌ Don'ts

- Don't use `@state` for public API properties
- Don't hardcode colors or spacing values
- Don't manipulate DOM directly (use Lit's declarative rendering)
- Don't forget to rebuild CSS after editing `.css` files
- Don't skip accessibility attributes
- Don't create components larger than 300 lines
- Don't forget to export types and events

## Next Steps

1. ✅ Component created with proper API
2. → Continue to [Step 3: Global Theming](step3-global-theme.md)
3. Learn advanced theming patterns
4. Implement theme switching
5. Test theme consistency

## Reference

- [Lit Component Documentation](https://lit.dev/docs/components/overview/)
- [Lit Decorators](https://lit.dev/docs/components/decorators/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
