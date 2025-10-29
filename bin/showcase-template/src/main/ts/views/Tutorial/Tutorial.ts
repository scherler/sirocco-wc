import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import Styles from './Tutorial.styles';

interface TutorialSection {
  id: string;
  title: string;
  icon: string;
  content: any;
}

@customElement('swc-tutorial')
export class Tutorial extends LitElement {
  static styles = [Styles];

  @property({ type: String })
  initialSection?: string;

  @state()
  private selectedSection: string = 'quick-start';

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('initialSection') && this.initialSection) {
      this.selectedSection = this.initialSection;
    }
  }

  private sections: TutorialSection[] = [
    {
      id: 'quick-start',
      title: 'Quick Start',
      icon: '🚀',
      content: html`
        <h2 class="section-heading">Quick Start</h2>
        <p class="section-description">Get started with sirocco-wc in minutes. These commands will scaffold your project and start the development server.</p>

        <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            📚 <strong>Base Technology:</strong>
            <a href="https://github.com/scherler/sirocco-wc" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              Sirocco Web Components Framework
            </a>
          </p>
        </div>

        <pre><code># Add a new component
yarn :add my-component

# Start development server
yarn start

# Build for production
yarn build

# Run tests
yarn test</code></pre>
      `
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: '♿',
      content: html`
        <h2 class="section-heading">Building Accessible Components</h2>
        <p class="section-description">Accessibility ensures everyone can use your application. Learn core principles with a practical carousel example that demonstrates ARIA labels, keyboard navigation, and semantic HTML.</p>

        <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            📚 <strong>Further Information:</strong>
            <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              WCAG Quick Reference
            </a>
            |
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              W3C Carousel Pattern
            </a>
          </p>
        </div>

        <h3 class="subsection-heading">Core Accessibility Principles</h3>
        <pre><code>✅ Semantic HTML - Use proper HTML elements for their intended purpose
✅ ARIA Labels - Provide descriptive labels for interactive elements
✅ Keyboard Navigation - Ensure all functionality is keyboard accessible
✅ Focus Management - Visible focus indicators and logical tab order
✅ Color Contrast - Maintain WCAG AA/AAA contrast ratios
✅ Screen Reader Support - Test with assistive technologies</code></pre>

        <h3 class="subsection-heading">Example: Accessible Carousel Component</h3>
        <p class="section-description">The carousel above demonstrates these principles. Here's how to build it:</p>

        <h3 class="subsection-heading">1. Create the Component Structure</h3>
        <pre><code>import { LitElement, html } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';

@customElement('swc-carousel')
export class Carousel extends LitElement {
  @property({ type: Number })
  visibleCards = 3;

  @state()
  private currentIndex = 0;

  @state()
  private totalCards = 0;

  @query('.scroll-container')
  private scrollContainer!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
      const slot = this.shadowRoot?.querySelector('slot');
      const cards = slot?.assignedElements() || [];
      this.totalCards = cards.length;
    });
  }
}</code></pre>

        <h3 class="subsection-heading">2. Add Accessible Navigation</h3>
        <pre><code>private scroll(direction: 'left' | 'right') {
  const slot = this.shadowRoot?.querySelector('slot');
  const cards = slot?.assignedElements() || [];
  const totalCards = cards.length;

  if (direction === 'right') {
    this.currentIndex = (this.currentIndex + 1) % totalCards;
  } else {
    this.currentIndex = (this.currentIndex - 1 + totalCards) % totalCards;
  }

  const cardWidth = (cards[0] as HTMLElement)?.offsetWidth || 350;
  const gap = 32;
  const scrollAmount = (cardWidth + gap) * this.currentIndex;

  this.scrollContainer.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
}</code></pre>

        <h3 class="subsection-heading">3. ARIA Labels & Keyboard Support</h3>
        <pre><code>render() {
  return html\`
    &lt;div class="carousel-wrapper"&gt;
      &lt;!-- Always include descriptive ARIA labels --&gt;
      &lt;button
        @click=\${() => this.scroll('left')}
        aria-label="Previous slide"
        class="nav-button"
      &gt;
        &lt;svg&gt;...&lt;/svg&gt;
      &lt;/button&gt;

      &lt;div class="scroll-container"&gt;
        &lt;slot&gt;&lt;/slot&gt;
      &lt;/div&gt;

      &lt;button
        @click=\${() => this.scroll('right')}
        aria-label="Next slide"
      &gt;
        &lt;svg&gt;...&lt;/svg&gt;
      &lt;/button&gt;
    &lt;/div&gt;

    &lt;!-- Accessible scroll indicators --&gt;
    \${this.totalCards > 0 ? html\`
      &lt;div class="scroll-indicators"&gt;
        \${Array.from({ length: this.totalCards }, (_, i) => html\`
          &lt;button
            class="scroll-indicator \${i === this.currentIndex ? 'active' : ''}"
            @click=\${() => this.scrollToIndex(i)}
            aria-label="Go to slide \${i + 1}"
            @keydown=\${this.handleKeyDown}
            tabindex="0"
          &gt;&lt;/button&gt;
        \`)}
      &lt;/div&gt;
    \` : ''}
  \`;
}</code></pre>

        <h3 class="subsection-heading">4. Keyboard Navigation Handler</h3>
        <pre><code>private handleKeyDown(e: KeyboardEvent) {
  // Support Enter and Space for activation
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    (e.target as HTMLElement).click();
  }

  // Arrow keys for navigation
  if (e.key === 'ArrowLeft') {
    this.scroll('left');
  } else if (e.key === 'ArrowRight') {
    this.scroll('right');
  }
}</code></pre>

        <h3 class="subsection-heading">5. Accessible Styling</h3>
        <pre><code>.scroll-indicators {
  @apply flex items-center justify-center gap-2 mt-4;
}

.scroll-indicator {
  @apply rounded-full transition-all duration-300 cursor-pointer;
  width: 10px;
  height: 10px;
  background-color: var(--carousel-marker-bg);
}

/* Clear visual feedback for active state */
.scroll-indicator.active {
  @apply scale-125;
  background-color: var(--carousel-marker-active-bg);
}

/* Visible focus indicator */
.scroll-indicator:focus {
  outline: 2px solid var(--action-primary);
  outline-offset: 2px;
}</code></pre>

        <h3 class="subsection-heading">Accessibility Checklist</h3>
        <pre><code>✅ All interactive elements have aria-label or aria-labelledby
✅ Buttons are keyboard accessible (Tab to focus, Enter/Space to activate)
✅ Visual focus indicators are clear and visible
✅ Color contrast meets WCAG AA standards (4.5:1 for text)
✅ Semantic HTML elements used appropriately
✅ Screen readers can announce all content and controls
✅ No keyboard traps - users can navigate in and out
✅ Motion respects prefers-reduced-motion preference</code></pre>
      `
    },
    {
      id: 'theming',
      title: 'Theming & Dark Mode',
      icon: '🎨',
      content: html`
        <h2 class="section-heading">Complete Theming & Dark Mode System</h2>
        <p class="section-description">This showcase demonstrates a complete theming system: colors defined in tailwind.config.js → referenced in ThemesVariables.css using theme() → used by all components via CSS variables. Toggle between light/dark/auto using the theme switcher in the header!</p>

        <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            📚 <strong>Further Information:</strong>
            <a href="https://tailwindcss.com/docs/theme" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              Tailwind CSS Theme Configuration
            </a>
            |
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              MDN: CSS Custom Properties
            </a>
          </p>
        </div>

        <h3 class="subsection-heading">Step 1: Define Colors in tailwind.config.js</h3>
        <pre><code>// tailwind.config.js - Single source of truth
module.exports = {
  theme: {
    extend: {
      colors: {
        light: {
          'surface-primary': '#ffffff',
          'surface-secondary': '#f8fafc',
          'text-primary': '#0f172a',
          'text-secondary': '#475569',
          'action-primary': '#2563eb',
          'border-subtle': '#e2e8f0',
          // ... all light colors
        },
        dark: {
          'surface-primary': '#0f172a',
          'surface-secondary': '#1e293b',
          'text-primary': '#f1f5f9',
          'text-secondary': '#cbd5e1',
          'action-primary': '#3b82f6',
          'border-subtle': '#334155',
          // ... all dark colors
        },
      },
    },
  },
};</code></pre>

        <h3 class="subsection-heading">Step 2: Reference in ThemesVariables.css</h3>
        <pre><code>/* ThemesVariables.css - Use theme() to dogfood Tailwind */
:root,
[data-theme='light'] {
  --surface-primary: theme('colors.light.surface-primary');
  --surface-secondary: theme('colors.light.surface-secondary');
  --text-primary: theme('colors.light.text-primary');
  --text-secondary: theme('colors.light.text-secondary');
  --action-primary: theme('colors.light.action-primary');
  --border-subtle: theme('colors.light.border-subtle');
  /* ... shadows, gradients, etc. */
}

[data-theme='dark'] {
  --surface-primary: theme('colors.dark.surface-primary');
  --surface-secondary: theme('colors.dark.surface-secondary');
  --text-primary: theme('colors.dark.text-primary');
  --text-secondary: theme('colors.dark.text-secondary');
  --action-primary: theme('colors.dark.action-primary');
  --border-subtle: theme('colors.dark.border-subtle');
  /* ... shadows, gradients, etc. */
}

/* Auto mode fallback */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --surface-primary: theme('colors.dark.surface-primary');
    --text-primary: theme('colors.dark.text-primary');
    /* ... uses dark colors when system is dark */
  }
}</code></pre>

        <h3 class="subsection-heading">Step 3: Components Use Variables</h3>
        <pre><code>/* Card.css - Clean and simple! */
.card {
  background-color: var(--surface-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
}

.card:hover {
  border-color: var(--border-emphasis);
  box-shadow: var(--shadow-xl);
}</code></pre>

        <h3 class="subsection-heading">Step 4: Create Self-Contained Theme Toggle</h3>
        <pre><code>// ThemeToggle.ts - Manages its own state!
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

export type Theme = 'light' | 'dark' | 'auto';

@customElement('swc-theme-toggle')
export class ThemeToggle extends LitElement {
  @state()
  private currentTheme: Theme = 'auto';

  connectedCallback() {
    super.connectedCallback();
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
  }

  private handleThemeChange(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  render() {
    return html\`
      &lt;div class="theme-toggle"&gt;
        &lt;button @click=\${() => this.handleThemeChange('light')}&gt;☀️&lt;/button&gt;
        &lt;button @click=\${() => this.handleThemeChange('auto')}&gt;🖥️&lt;/button&gt;
        &lt;button @click=\${() => this.handleThemeChange('dark')}&gt;🌙&lt;/button&gt;
      &lt;/div&gt;
    \`;
  }
}</code></pre>

        <h3 class="subsection-heading">Available Global Variables</h3>
        <pre><code>/* Surface colors (backgrounds) */
--surface-primary, --surface-secondary, --surface-tertiary, --surface-accent

/* Text colors */
--text-primary, --text-secondary, --text-tertiary, --text-accent, --text-inverse

/* Border colors */
--border-subtle, --border-default, --border-emphasis

/* Action colors */
--action-primary, --action-primary-hover, --action-secondary, --action-secondary-hover

/* Status colors */
--status-success, --status-warning, --status-error, --status-info

/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl

/* Gradients */
--gradient-hero, --gradient-accent</code></pre>

        <h3 class="subsection-heading">Maintain Contrast Ratios for Accessibility</h3>
        <pre><code>/* Light Mode - High Contrast */
Background: white (#ffffff)
Primary Text: slate-950 (#0f172a) - 21:1 contrast ratio
Secondary Text: slate-600 (#475569) - 7:1 contrast ratio

/* Dark Mode - High Contrast */
Background: slate-950 (#0f172a)
Primary Text: slate-50 (#f1f5f9) - 16:1 contrast ratio
Secondary Text: slate-300 (#cbd5e1) - 8:1 contrast ratio

/* Interactive Elements */
Light Mode: blue-600 (#2563eb)
Dark Mode: blue-400 (#3b82f6) - Better contrast on dark</code></pre>

        <h3 class="subsection-heading">Benefits of This System</h3>
        <pre><code>✅ Single Source of Truth - All colors in tailwind.config.js
✅ Dogfooding - Use Tailwind's theme() function yourself
✅ No Duplication - Never repeat hex values
✅ Separation of Concerns - ThemeToggle owns theme logic
✅ Automatic Theming - All components update when theme changes
✅ Persistent - Saves to localStorage
✅ Auto Fallback - Respects system preference
✅ Clean Components - Component CSS stays focused on layout</code></pre>
      `
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: '⚡',
      content: html`
        <h2 class="section-heading">Performance Optimization</h2>
        <p class="section-description">Best practices for building fast, efficient components.</p>

        <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            📚 <strong>Further Information:</strong>
            <a href="https://lit.dev/docs/components/lifecycle/" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              Lit Component Lifecycle
            </a>
          </p>
        </div>

        <h3 class="subsection-heading">State Management</h3>
        <pre><code>// Use @state only for internal reactive properties
@state()
private currentIndex = 0;

// Use @property for public API
@property({ type: Number })
visibleCards = 1;

// Leverage Shadow DOM for style encapsulation
static styles = [styles];</code></pre>

        <h3 class="subsection-heading">CSS Transforms</h3>
        <pre><code>// Use CSS transforms for smooth animations
.scroll-indicator {
  @apply transition-all duration-300;
  transform: scale(1);
}

.scroll-indicator.active {
  transform: scale(1.25);
}

// Prefer transforms over changing dimensions
.card {
  @apply transform transition-transform;
}

.card:hover {
  transform: translateY(-0.25rem);
}</code></pre>

        <h3 class="subsection-heading">Build Process</h3>
        <pre><code># After editing .css files, always rebuild
yarn css:build

# Or use watch mode during development
yarn css:watch</code></pre>
      `
    },
    {
      id: 'material-components',
      title: 'Material Components',
      icon: '🧩',
      content: html`
        <h2 class="section-heading">Integrating Material Web Components</h2>
        <p class="section-description">Material Web Components (MWC) provide Google's Material Design components built with Lit.</p>

        <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            📚 <strong>Official Documentation:</strong>
            <a href="https://github.com/material-components/material-web" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-600">
              Material Web Components on GitHub
            </a>
          </p>
        </div>

        <h3 class="subsection-heading">Installation</h3>
        <pre><code># Install Material Web Components
yarn add @material/web

# Or specific components
yarn add @material/web@latest</code></pre>

        <h3 class="subsection-heading">Sirocco Best Practice: Centralized Imports</h3>
        <p class="section-description">Following Sirocco best practices, all Material Web Component imports are centralized in a dedicated file for better maintainability.</p>

        <pre><code>// src/main/ts/material-components.ts
// Centralize all Material WC imports in one file
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';

// src/main/ts/index.ts
// Import once in your main entry point
import './material-components';

// Now use components anywhere in your app without additional imports!
render() {
  return html\`
    &lt;md-filled-button&gt;Click Me&lt;/md-filled-button&gt;
    &lt;md-outlined-button&gt;Secondary&lt;/md-outlined-button&gt;
    &lt;md-filled-text-field label="Name"&gt;&lt;/md-filled-text-field&gt;
  \`;
}</code></pre>

        <h3 class="subsection-heading">Theming Material Components</h3>
        <pre><code>/* Material Design uses CSS custom properties for theming */
:root {
  /* Primary color palette */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;

  /* Surface colors */
  --md-sys-color-surface: #fffbfe;
  --md-sys-color-on-surface: #1c1b1f;

  /* Background */
  --md-sys-color-background: #fffbfe;
}

@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-on-primary: #381e72;
    --md-sys-color-surface: #1c1b1f;
    --md-sys-color-on-surface: #e6e1e5;
  }
}</code></pre>

        <h3 class="subsection-heading">Using in Custom Components</h3>
        <pre><code>// No need to import Material components here!
// They're already available via material-components.ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-card')
export class MyCard extends LitElement {
  render() {
    return html\`
      &lt;div class="card"&gt;
        &lt;h3&gt;Card Title&lt;/h3&gt;
        &lt;p&gt;Card content goes here&lt;/p&gt;
        &lt;md-filled-button&gt;
          &lt;md-icon slot="icon"&gt;arrow_forward&lt;/md-icon&gt;
          Learn More
        &lt;/md-filled-button&gt;
      &lt;/div&gt;
    \`;
  }
}

// Benefits of centralized imports:
// ✓ No repetitive imports across files
// ✓ Easy to manage which components are available
// ✓ Single source of truth for external dependencies</code></pre>

        <h3 class="subsection-heading">Live Examples</h3>
        <p class="section-description">Here are some Material Web Components in action:</p>

        <div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
          <div class="flex items-center gap-4 flex-wrap">
            <md-filled-button>Filled Button</md-filled-button>
            <md-outlined-button>Outlined Button</md-outlined-button>
            <md-text-button>Text Button</md-text-button>
            <md-elevated-button>Elevated Button</md-elevated-button>
          </div>

          <div class="flex items-center gap-4">
            <md-filled-button>
              <md-icon slot="icon">favorite</md-icon>
              With Icon
            </md-filled-button>
            <md-filled-button>
              <md-icon slot="icon">delete</md-icon>
            </md-filled-button>
          </div>

          <div class="flex items-center gap-4 flex-wrap">
            <md-filled-text-field label="Name" type="text"></md-filled-text-field>
            <md-outlined-text-field label="Email" type="email"></md-outlined-text-field>
          </div>

          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <md-checkbox></md-checkbox>
              <span class="text-sm">Agree to terms</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <md-switch></md-switch>
              <span class="text-sm">Enable notifications</span>
            </label>
          </div>
        </div>
      `
    }
  ];

  private selectSection(id: string) {
    this.selectedSection = id;
  }

  render() {
    const selected = this.sections.find(s => s.id === this.selectedSection);

    return html`
      <div class="tutorial-container">
        <div class="tutorial-layout">
          <!-- Navigation Grid -->
          <aside class="tutorial-nav">
            <h2 class="nav-heading">Tutorials</h2>
            <div class="nav-grid">
              ${this.sections.map(section => html`
                <button
                  class="nav-card ${section.id === this.selectedSection ? 'active' : ''}"
                  @click=${() => this.selectSection(section.id)}
                >
                  <span class="nav-icon">${section.icon}</span>
                  <span class="nav-title">${section.title}</span>
                </button>
              `)}
            </div>
          </aside>

          <!-- Content Display Area -->
          <main class="tutorial-content">
            ${selected?.content}
          </main>
        </div>
      </div>
    `;
  }
}
