# Step 4: DRY Best Practices

Master the DRY (Don't Repeat Yourself) principle in frontend development through composition, utility functions, and reusable patterns.

## DRY Principle

**Core Idea**: Every piece of knowledge should have a single, unambiguous representation in the system.

**Benefits**:
- Reduced code duplication
- Easier maintenance
- Consistent behavior across components
- Faster development
- Fewer bugs

## DRY Patterns in Sirocco

### Pattern 1: Base Component Inheritance

**When to Use**: Shared visual styles and behavior across multiple components

**Example - Base Card Component**:

```typescript
// components/BaseCard/BaseCard.ts
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class BaseCard extends LitElement {
  @property({ type: Boolean }) elevated = false;
  @property({ type: Boolean }) interactive = false;
  @property({ type: Boolean}) loading = false;

  protected getCardClasses(): string {
    const classes = [
      'rounded-lg p-4',
      'bg-[var(--surface-primary)]',
      'border border-[var(--border-default)]',
      'transition-all duration-200',
    ];

    if (this.elevated) {
      classes.push('shadow-lg');
    } else {
      classes.push('shadow-sm');
    }

    if (this.interactive) {
      classes.push('cursor-pointer hover:shadow-xl hover:border-[var(--accent-primary)]');
    }

    if (this.loading) {
      classes.push('opacity-50 pointer-events-none');
    }

    return classes.join(' ');
  }

  protected renderLoading() {
    if (!this.loading) return null;

    return html`
      <div class="absolute inset-0 flex items-center justify-center
                  bg-[var(--surface-overlay)] rounded-lg">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>
    `;
  }

  protected renderError(message: string) {
    return html`
      <div class="p-4 rounded bg-[var(--accent-error)] text-[var(--text-inverse)]">
        <md-icon>error</md-icon>
        <span>${message}</span>
      </div>
    `;
  }
}
```

**Specialized Components**:

```typescript
// components/UserCard/UserCard.ts
@customElement('user-card')
export class UserCard extends BaseCard {
  @property({ type: Object }) user!: User;

  render() {
    return html`
      <div class="${this.getCardClasses()}">
        <img src="${this.user.avatar}" class="w-12 h-12 rounded-full">
        <h3>${this.user.name}</h3>
        <p>${this.user.email}</p>
        ${this.renderLoading()}
      </div>
    `;
  }
}

// components/ProductCard/ProductCard.ts
@customElement('product-card')
export class ProductCard extends BaseCard {
  @property({ type: Object }) product!: Product;

  render() {
    return html`
      <div class="${this.getCardClasses()}">
        <img src="${this.product.image}" class="w-full h-48 object-cover">
        <h3>${this.product.name}</h3>
        <p class="text-2xl font-bold">${this.product.price}</p>
        ${this.renderLoading()}
      </div>
    `;
  }
}
```

### Pattern 2: Utility Functions

**Extract repeated logic into pure functions:**

```typescript
// utils/formatting.ts
export class Formatter {
  /**
   * Format date to localized string
   */
  static formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      ...options,
    }).format(dateObj);
  }

  /**
   * Format number as currency
   */
  static formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Truncate text with ellipsis
   */
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  }

  /**
   * Get initials from name
   */
  static getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

// Usage in components
import { Formatter } from '../utils/formatting';

render() {
  return html`
    <p>${Formatter.formatDate(this.createdAt)}</p>
    <p>${Formatter.formatCurrency(this.price)}</p>
    <p>${Formatter.truncate(this.description, 100)}</p>
  `;
}
```

### Pattern 3: Validation Utilities

```typescript
// utils/validators.ts
export class Validators {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isStrongPassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  static isPhoneNumber(phone: string): boolean {
    // US phone number format
    const phoneRegex = /^\+?1?\d{10,14}$/;
    return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
  }
}
```

### Pattern 4: Mixins for Shared Behavior

**Create reusable mixins for cross-cutting concerns:**

```typescript
// mixins/WithLoading.ts
type Constructor<T = {}> = new (...args: any[]) => T;

export interface WithLoadingInterface {
  loading: boolean;
  renderLoadingState(): TemplateResult;
}

export const WithLoading = <T extends Constructor<LitElement>>(superClass: T) => {
  class WithLoadingMixin extends superClass implements WithLoadingInterface {
    @property({ type: Boolean }) loading = false;

    renderLoadingState() {
      if (!this.loading) return html``;

      return html`
        <div class="flex items-center justify-center p-8">
          <md-circular-progress indeterminate></md-circular-progress>
          <span class="ml-2 text-[var(--text-secondary)]">Loading...</span>
        </div>
      `;
    }
  }
  return WithLoadingMixin as Constructor<WithLoadingInterface> & T;
};

// Usage
@customElement('my-component')
export class MyComponent extends WithLoading(LitElement) {
  render() {
    if (this.loading) {
      return this.renderLoadingState();
    }

    return html`<div>Content</div>`;
  }
}
```

**Error Handling Mixin**:

```typescript
// mixins/WithErrorHandling.ts
export interface WithErrorHandlingInterface {
  error: string | null;
  renderError(): TemplateResult;
  clearError(): void;
}

export const WithErrorHandling = <T extends Constructor<LitElement>>(superClass: T) => {
  class WithErrorHandlingMixin extends superClass implements WithErrorHandlingInterface {
    @property({ type: String }) error: string | null = null;

    renderError() {
      if (!this.error) return html``;

      return html`
        <div class="p-4 rounded-lg bg-[var(--accent-error)] text-[var(--text-inverse)]
                    flex items-center gap-2">
          <md-icon>error</md-icon>
          <span>${this.error}</span>
          <md-icon-button @click="${this.clearError}" class="ml-auto">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>
      `;
    }

    clearError() {
      this.error = null;
    }
  }
  return WithErrorHandlingMixin as Constructor<WithErrorHandlingInterface> & T;
};
```

**Combine Multiple Mixins**:

```typescript
@customElement('data-component')
export class DataComponent extends WithLoading(WithErrorHandling(LitElement)) {
  async loadData() {
    this.loading = true;
    this.clearError();

    try {
      const data = await fetch('/api/data').then(r => r.json());
      this.data = data;
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      ${this.renderError()}
      ${this.renderLoadingState()}
      ${!this.loading && !this.error ? this._renderContent() : ''}
    `;
  }

  private _renderContent() {
    return html`<div>Data loaded successfully</div>`;
  }
}
```

### Pattern 5: CSS Utility Classes

**Create reusable CSS utility patterns:**

```css
/* styles/utilities.css */

/* Flexbox utilities */
.flex-center {
  @apply flex items-center justify-center;
}

.flex-between {
  @apply flex items-center justify-between;
}

.flex-col-center {
  @apply flex flex-col items-center justify-center;
}

/* Text utilities */
.text-ellipsis {
  @apply truncate overflow-hidden whitespace-nowrap;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Card utilities */
.card-base {
  @apply rounded-lg p-4 bg-[var(--surface-primary)]
         border border-[var(--border-default)] shadow-sm;
}

.card-interactive {
  @apply card-base cursor-pointer transition-all
         hover:shadow-lg hover:border-[var(--accent-primary)];
}

/* Focus utilities */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]
         focus:ring-offset-2;
}

/* Button utilities */
.btn-base {
  @apply px-4 py-2 rounded-lg font-medium transition-all
         focus-ring disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply btn-base bg-[var(--accent-primary)] text-[var(--text-inverse)]
         hover:bg-[var(--accent-primary-hover)];
}
```

### Pattern 6: Shared State Management

**Create a simple store for shared state:**

```typescript
// stores/user-store.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

class UserStore {
  private _user: User | null = null;
  private _listeners = new Set<() => void>();

  get user() {
    return this._user;
  }

  set user(value: User | null) {
    this._user = value;
    this._notify();
  }

  subscribe(callback: () => void) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  private _notify() {
    this._listeners.forEach(callback => callback());
  }

  async loadUser() {
    const response = await fetch('/api/user');
    this.user = await response.json();
  }

  logout() {
    this.user = null;
  }
}

export const userStore = new UserStore();

// Reactive Controller for Lit components
export class UserStoreController implements ReactiveController {
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  private _unsubscribe?: () => void;

  hostConnected() {
    this._unsubscribe = userStore.subscribe(() => {
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this._unsubscribe?.();
  }

  get user() {
    return userStore.user;
  }
}

// Usage in components
@customElement('user-profile')
export class UserProfile extends LitElement {
  private _userStore = new UserStoreController(this);

  render() {
    const user = this._userStore.user;

    if (!user) {
      return html`<p>Not logged in</p>`;
    }

    return html`
      <div>
        <h2>${user.name}</h2>
        <p>${user.email}</p>
      </div>
    `;
  }
}
```

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Copy-Paste Code

**Bad**:
```typescript
// Component1.ts
render() {
  return html`
    <div class="p-4 rounded-lg shadow-sm bg-white border">Content 1</div>
  `;
}

// Component2.ts
render() {
  return html`
    <div class="p-4 rounded-lg shadow-sm bg-white border">Content 2</div>
  `;
}
```

**Good - Extract Base Component**:
```typescript
// BaseCard.ts
@customElement('base-card')
export class BaseCard extends LitElement {
  render() {
    return html`
      <div class="card-base">
        <slot></slot>
      </div>
    `;
  }
}

// Usage
html`<base-card>Content 1</base-card>`
html`<base-card>Content 2</base-card>`
```

### ❌ Anti-Pattern 2: Hardcoded Values

**Bad**:
```typescript
render() {
  const dateStr = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  return html`<p>${dateStr}</p>`;
}
```

**Good - Use Utility**:
```typescript
render() {
  return html`<p>${Formatter.formatDate(date)}</p>`;
}
```

### ❌ Anti-Pattern 3: Inline Validation

**Bad**:
```typescript
_validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

_validatePassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}
```

**Good - Centralized Validators**:
```typescript
import { Validators } from '../utils/validators';

_validateForm() {
  return Validators.isEmail(this.email) &&
         Validators.isStrongPassword(this.password);
}
```

## Refactoring Checklist

When you find yourself repeating code, ask:

- [ ] **Can this be extracted into a utility function?**
- [ ] **Should this be a base component?**
- [ ] **Is this a good candidate for a mixin?**
- [ ] **Could this be a CSS utility class?**
- [ ] **Should this logic be in a shared store?**

## Best Practices Summary

### ✅ Do's

- Extract repeated code into utilities
- Use base components for shared visual patterns
- Create mixins for cross-cutting concerns
- Centralize validation logic
- Use CSS utility classes
- Keep functions pure and testable
- Document reusable patterns

### ❌ Don'ts

- Don't copy-paste code
- Don't hardcode values
- Don't inline complex logic
- Don't create one-off utilities
- Don't over-engineer (extract only when repeated 3+ times)
- Don't create god classes with too many responsibilities

## Next Steps

1. ✅ DRY patterns learned
2. → Continue to [Step 5: Testing & Accessibility](step5-testing.md)
3. Write comprehensive tests
4. Ensure accessibility compliance
5. Optimize performance

## Reference

- [DRY Principle - Wikipedia](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [Lit Mixins](https://lit.dev/docs/composition/mixins/)
- [Reactive Controllers](https://lit.dev/docs/composition/controllers/)
