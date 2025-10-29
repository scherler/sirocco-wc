import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './Header.styles';

@customElement('swc-header')
export class Header extends LitElement {
  static styles = [styles];

  @property({ type: Function })
  onNavigate?: (page: 'home' | 'tutorial', tutorialId?: string) => void;

  private handleNavigation(page: 'home' | 'tutorial', e: Event) {
    e.preventDefault();
    if (this.onNavigate) {
      this.onNavigate(page);
    }
  }

  render() {
    return html`
      <header class="header-container">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-baseline">
                <button
                  @click=${(e: Event) => this.handleNavigation('home', e)}
                  class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer border-none bg-transparent p-0"
                  style="font-family: inherit;"
                >
                  sirocco-wc
                </button>
                <span class="very-muted-text ml-2">
                  Version 1.1.25
                </span>
              </div>
              <div class="hidden md:block ml-10">
                <div class="flex space-x-4">
                  <button
                    @click=${(e: Event) => this.handleNavigation('home', e)}
                    class="nav-link"
                  >
                    Home
                  </button>
                  <button
                    @click=${(e: Event) => this.handleNavigation('tutorial', e)}
                    class="nav-link"
                  >
                    Tutorial
                  </button>
                  <a
                    href="https://github.com/scherler/sirocco-wc#readme"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="nav-link"
                  >
                    Documentation
                  </a>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <swc-theme-toggle></swc-theme-toggle>
              <button
                @click=${(e: Event) => this.handleNavigation('tutorial', e)}
                class="hidden md:inline-flex header-button"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>
    `;
  }
}
