# Step 5: Testing & Accessibility

Ensure your components are well-tested, accessible, and performant with comprehensive testing strategies and WCAG compliance.

## Testing Strategy

### 1. Unit Tests (Jest + @open-wc/testing)

**Test component behavior in isolation:**

```typescript
// UserCard.test.ts
import { expect, fixture, html } from '@open-wc/testing';
import { UserCard } from './UserCard';
import type { User } from './UserCard';

describe('UserCard', () => {
  const mockUser: User = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'admin',
    status: 'online',
  };

  it('renders user information correctly', async () => {
    const el = await fixture<UserCard>(html`
      <user-card .user="${mockUser}"></user-card>
    `);

    const name = el.shadowRoot!.querySelector('h3');
    const email = el.shadowRoot!.querySelector('p');

    expect(name?.textContent).to.include('Jane Doe');
    expect(email?.textContent).to.include('jane@example.com');
  });

  it('displays correct role badge', async () => {
    const el = await fixture<UserCard>(html`
      <user-card .user="${mockUser}"></user-card>
    `);

    const badge = el.shadowRoot!.querySelector('.role-badge');
    expect(badge?.textContent).to.include('admin');
  });

  it('shows online status indicator', async () => {
    const el = await fixture<UserCard>(html`
      <user-card .user="${mockUser}"></user-card>
    `);

    const status = el.shadowRoot!.querySelector('.status-indicator');
    expect(status).to.exist;
    expect(status?.classList.contains('status-online')).to.be.true;
  });

  it('dispatches user-selected event when clicked', async () => {
    const el = await fixture<UserCard>(html`
      <user-card .user="${mockUser}" selectable></user-card>
    `);

    let selectedUser: User | undefined;
    el.addEventListener('user-selected', ((e: CustomEvent<User>) => {
      selectedUser = e.detail;
    }) as EventListener);

    const card = el.shadowRoot!.querySelector('.user-card') as HTMLElement;
    card.click();

    expect(selectedUser).to.deep.equal(mockUser);
  });

  it('does not dispatch event when not selectable', async () => {
    const el = await fixture<UserCard>(html`
      <user-card .user="${mockUser}"></user-card>
    `);

    let eventFired = false;
    el.addEventListener('user-selected', () => {
      eventFired = true;
    });

    const card = el.shadowRoot!.querySelector('.user-card') as HTMLElement;
    card.click();

    expect(eventFired).to.be.false;
  });

  it('renders in compact mode', async () => {
    const el = await fixture<UserCard>(html`
      <user-card .user="${mockUser}" compact></user-card>
    `);

    const card = el.shadowRoot!.querySelector('.user-card');
    expect(card?.classList.contains('compact')).to.be.true;
  });
});
```

### 2. Integration Tests (Playwright)

**Test component interactions and user flows:**

```typescript
// user-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/users');
  });

  test('displays list of users', async ({ page }) => {
    const cards = page.locator('user-card');
    await expect(cards).toHaveCount(3);
  });

  test('filters users by role', async ({ page }) => {
    await page.click('[data-filter="admin"]');

    const cards = page.locator('user-card');
    const count = await cards.count();

    expect(count).toBeLessThan(3);

    // Verify all visible cards have admin role
    for (let i = 0; i < count; i++) {
      const badge = cards.nth(i).locator('.role-badge');
      await expect(badge).toHaveText('admin');
    }
  });

  test('selects user on card click', async ({ page }) => {
    await page.click('user-card');

    const selectedCard = page.locator('user-card.selected');
    await expect(selectedCard).toHaveCount(1);
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab to first card
    await page.keyboard.press('Tab');

    // Press Enter to select
    await page.keyboard.press('Enter');

    const selectedCard = page.locator('user-card.selected');
    await expect(selectedCard).toHaveCount(1);
  });
});
```

### 3. Visual Regression Tests (Playwright Screenshots)

**Detect unintended visual changes:**

```typescript
// visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('user card in light theme', async ({ page }) => {
    await page.goto('http://localhost:3000/components/user-card');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await expect(page).toHaveScreenshot('user-card-light.png', {
      maxDiffPixels: 100,
    });
  });

  test('user card in dark theme', async ({ page }) => {
    await page.goto('http://localhost:3000/components/user-card');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await expect(page).toHaveScreenshot('user-card-dark.png', {
      maxDiffPixels: 100,
    });
  });

  test('user card hover state', async ({ page }) => {
    await page.goto('http://localhost:3000/components/user-card');

    const card = page.locator('user-card').first();
    await card.hover();

    await expect(card).toHaveScreenshot('user-card-hover.png');
  });
});
```

## Accessibility Testing

### WCAG 2.1 Level AA Requirements

#### 1. Keyboard Navigation

**Ensure all interactive elements are keyboard accessible:**

```typescript
// Component implementation
@customElement('accessible-card')
export class AccessibleCard extends LitElement {
  render() {
    return html`
      <div
        class="card"
        role="button"
        tabindex="0"
        @click="${this._handleClick}"
        @keydown="${this._handleKeyDown}"
        aria-label="User card for ${this.user.name}">

        <!-- Card content -->
      </div>
    `;
  }

  private _handleKeyDown(e: KeyboardEvent) {
    // Activate on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }
}
```

**Test keyboard navigation:**

```typescript
test('keyboard navigation', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Tab through interactive elements
  await page.keyboard.press('Tab');
  let focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBe('USER-CARD');

  // Activate with Enter
  await page.keyboard.press('Enter');
  await expect(page.locator('.selected')).toHaveCount(1);

  // Activate with Space
  await page.keyboard.press('Space');
  await expect(page.locator('.selected')).toHaveCount(1);
});
```

#### 2. ARIA Labels and Roles

**Provide semantic meaning to screen readers:**

```typescript
render() {
  return html`
    <!-- Form with proper labels -->
    <form aria-label="User registration">
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        aria-required="true"
        aria-describedby="username-help">
      <span id="username-help">Enter a unique username</span>

      <!-- Custom component with ARIA -->
      <user-card
        .user="${this.user}"
        role="article"
        aria-label="User profile for ${this.user.name}">
      </user-card>

      <!-- Button with clear label -->
      <button
        aria-label="Delete user ${this.user.name}"
        @click="${this._handleDelete}">
        <md-icon>delete</md-icon>
      </button>
    </form>
  `;
}
```

**Test with axe-core:**

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('form has proper labels', async ({ page }) => {
    await page.goto('http://localhost:3000/form');

    const results = await new AxeBuilder({ page })
      .include('form')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

#### 3. Color Contrast

**Ensure text is readable:**

```css
/* Verify contrast ratios meet WCAG AA */

/* ✅ Good: Contrast ratio ≥ 4.5:1 for normal text */
.text-primary {
  color: var(--text-primary);  /* #000 on #fff = 21:1 */
  background: var(--surface-primary);
}

/* ✅ Good: Contrast ratio ≥ 3:1 for large text */
.heading {
  color: var(--text-secondary);  /* #666 on #fff = 5.74:1 */
  background: var(--surface-primary);
  font-size: 1.5rem;
}

/* ❌ Bad: Insufficient contrast */
.subtle-text {
  color: #ccc;  /* 1.6:1 - fails WCAG */
  background: #fff;
}
```

**Automated contrast testing:**

```typescript
test('color contrast meets WCAG AA', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();

  const contrastViolations = results.violations.filter(
    v => v.id === 'color-contrast'
  );

  expect(contrastViolations).toHaveLength(0);
});
```

#### 4. Focus Indicators

**Visible focus states for keyboard users:**

```css
/* Global focus style */
*:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

/* Custom focus for buttons */
.btn:focus-visible {
  @apply outline-none ring-2 ring-[var(--accent-primary)] ring-offset-2;
}

/* Focus within containers */
.card:focus-within {
  @apply border-[var(--accent-primary)] shadow-lg;
}
```

**Test focus indicators:**

```typescript
test('focus indicators are visible', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Tab to button
  await page.keyboard.press('Tab');

  // Check if focus ring is visible
  const button = page.locator('button:focus');
  const box = await button.boundingBox();

  expect(box).not.toBeNull();

  // Take screenshot to verify visually
  await expect(button).toHaveScreenshot('button-focus.png');
});
```

### Screen Reader Testing

**Manual testing with screen readers:**

1. **NVDA** (Windows) - Free
2. **JAWS** (Windows) - Commercial
3. **VoiceOver** (macOS) - Built-in
4. **TalkBack** (Android) - Built-in

**Test checklist:**

- [ ] All interactive elements announced
- [ ] Form labels read correctly
- [ ] Error messages conveyed
- [ ] Dynamic content changes announced (`aria-live`)
- [ ] Navigation landmarks present
- [ ] Heading hierarchy logical

**Example with live regions:**

```typescript
render() {
  return html`
    <!-- Announce errors to screen readers -->
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      class="${this.error ? 'block' : 'hidden'}">
      ${this.error}
    </div>

    <!-- Announce loading state -->
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="${this.loading ? 'block' : 'hidden'}">
      Loading content...
    </div>
  `;
}
```

## Performance Testing

### 1. Lighthouse Audits

```bash
# Run Lighthouse from CLI
lighthouse http://localhost:3000 --view

# Or use Playwright
```

```typescript
// lighthouse.spec.ts
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('Lighthouse audit', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await playAudit({
    page,
    thresholds: {
      performance: 90,
      accessibility: 100,
      'best-practices': 90,
      seo: 90,
    },
    port: 9222,
  });
});
```

### 2. Bundle Size Analysis

```bash
# Analyze build bundle
yarn build --analyze

# Check for large dependencies
npx bundle-analyzer dist/index.*.js
```

### 3. Component Performance

```typescript
// Measure render performance
test('component renders within budget', async ({ page }) => {
  await page.goto('http://localhost:3000/users');

  const metrics = await page.evaluate(() => {
    performance.mark('render-start');

    // Trigger component render
    document.querySelector('user-list')?.requestUpdate();

    performance.mark('render-end');
    performance.measure('render', 'render-start', 'render-end');

    const measure = performance.getEntriesByName('render')[0];
    return measure.duration;
  });

  expect(metrics).toBeLessThan(100); // 100ms budget
});
```

## Testing Checklist

### Unit Tests

- [ ] Component renders with default props
- [ ] Component renders with all prop variants
- [ ] Events dispatched correctly
- [ ] Internal state updates properly
- [ ] Error states handled
- [ ] Loading states displayed

### Integration Tests

- [ ] User flows complete successfully
- [ ] Components communicate correctly
- [ ] Form submission works
- [ ] Navigation works
- [ ] Data loading and display works

### Visual Regression

- [ ] Light theme matches baseline
- [ ] Dark theme matches baseline
- [ ] Hover states match baseline
- [ ] Focus states match baseline
- [ ] Mobile layout matches baseline

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] ARIA labels present
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] No accessibility violations (axe-core)

### Performance

- [ ] Lighthouse score ≥ 90
- [ ] Bundle size acceptable
- [ ] Render time < 100ms
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s

## CI/CD Integration

**GitHub Actions workflow:**

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn install

      - name: Run unit tests
        run: yarn test

      - name: Run linter
        run: yarn lint

      - name: Build
        run: yarn build

      - name: Run E2E tests
        run: yarn test:e2e

      - name: Run accessibility tests
        run: yarn test:a11y

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Best Practices Summary

### ✅ Do's

- Write tests for all public component APIs
- Test keyboard navigation
- Verify ARIA labels and roles
- Check color contrast ratios
- Test with screen readers
- Run automated accessibility tests
- Monitor bundle size
- Test in both light and dark themes
- Use visual regression tests

### ❌ Don'ts

- Don't skip accessibility tests
- Don't test implementation details
- Don't forget mobile testing
- Don't ignore performance budgets
- Don't commit without running tests
- Don't mock everything (test real interactions)
- Don't skip manual screen reader testing

## Tools Reference

- **Testing**: Jest, @open-wc/testing, Playwright
- **Accessibility**: axe-core, @axe-core/playwright, WAVE
- **Performance**: Lighthouse, Bundle Analyzer
- **Screen Readers**: NVDA, JAWS, VoiceOver, TalkBack

## Next Steps

1. ✅ Testing and accessibility complete
2. → Deploy to production
3. Monitor performance
4. Iterate based on user feedback

## Reference

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Documentation](https://playwright.dev/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Web.dev Accessibility](https://web.dev/accessibility/)
