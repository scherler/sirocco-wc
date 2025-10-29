import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import Styles from './ThemeToggle.styles';

export type Theme = 'light' | 'dark' | 'auto';

@customElement('swc-theme-toggle')
export class ThemeToggle extends LitElement {
  static styles = [Styles];

  @state()
  private currentTheme: Theme = 'auto';

  connectedCallback() {
    super.connectedCallback();
    // Load theme from localStorage or check DOM
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      // Check if data-theme is set on root
      const rootTheme = document.documentElement.getAttribute('data-theme') as Theme;
      this.currentTheme = rootTheme || 'auto';
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
      // Remove data-theme to let CSS media query handle it
      root.removeAttribute('data-theme');
    } else {
      // Set explicit theme
      root.setAttribute('data-theme', theme);
    }
  }

  render() {
    return html`
      <div class="theme-toggle">
        <button
          class="theme-button ${this.currentTheme === 'light' ? 'active' : ''}"
          @click=${() => this.handleThemeChange('light')}
          aria-label="Light theme"
          title="Light theme"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>

        <button
          class="theme-button ${this.currentTheme === 'auto' ? 'active' : ''}"
          @click=${() => this.handleThemeChange('auto')}
          aria-label="Auto theme"
          title="Auto theme (follow system)"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>

        <button
          class="theme-button ${this.currentTheme === 'dark' ? 'active' : ''}"
          @click=${() => this.handleThemeChange('dark')}
          aria-label="Dark theme"
          title="Dark theme"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    `;
  }
}
