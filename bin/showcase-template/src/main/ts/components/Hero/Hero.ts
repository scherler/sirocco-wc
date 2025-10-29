import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './Hero.styles';

@customElement('swc-hero')
export class Hero extends LitElement {
  static styles = [styles];

  @property({ type: Function })
  onNavigate?: (page: 'home' | 'tutorial', tutorialId?: string) => void;

  private handleNavigation(page: 'home' | 'tutorial', e: Event) {
    e.preventDefault();
    if (this.onNavigate) {
      this.onNavigate(page);
    }
  }

  private handleTutorialNavigation(tutorialId: string) {
    if (this.onNavigate) {
      this.onNavigate('tutorial', tutorialId);
    }
  }

  render() {
    return html`
      <div class="hero-container">
        <!-- Decorative background elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="blob-1"></div>
          <div class="blob-2"></div>
          <div class="blob-3"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div class="text-center mb-16">
            <h1 class="hero-heading">
              <span class="block">Build Modern Web Components</span>
              <span class="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                with Lit & Tailwind CSS
              </span>
            </h1>
            <p class="hero-text">
              Zero-configuration scaffolding tool for modern web components. Create beautiful,
              performant components with Shadow DOM encapsulation and utility-first styling.
              Perfect for standalone projects or Jenkins plugin development.
            </p>
          </div>

          <div class="max-w-6xl mx-auto">
            <swc-carousel>
              <swc-card
                title="Quick Start"
                icon="🚀"
                href="https://github.com/scherler/sirocco-wc"
                description="Get started with Sirocco in minutes. Learn the essential commands to scaffold and develop your project."
                tutorialId="quick-start"
                .onNavigate=${this.handleTutorialNavigation.bind(this)}
              ></swc-card>

              <swc-card
                title="Accessibility"
                icon="♿"
                href="https://www.w3.org/WAI/WCAG21/quickref/"
                description="Build inclusive web components following WCAG guidelines. Learn ARIA labels, keyboard navigation with a practical carousel example."
                tutorialId="accessibility"
                .onNavigate=${this.handleTutorialNavigation.bind(this)}
              ></swc-card>

              <swc-card
                title="Theming & Dark Mode"
                icon="🎨"
                href="https://tailwindcss.com/docs/theme"
                description="Complete theming system with Tailwind, CSS variables, and dark mode. Learn the complete flow from config to components."
                tutorialId="theming"
                .onNavigate=${this.handleTutorialNavigation.bind(this)}
              ></swc-card>

              <swc-card
                title="Performance"
                icon="⚡"
                href="https://lit.dev/docs/components/lifecycle/"
                description="Optimize Lit components with efficient state management. Learn lifecycle methods, reactive properties, and CSS transforms."
                tutorialId="performance"
                .onNavigate=${this.handleTutorialNavigation.bind(this)}
              ></swc-card>

              <swc-card
                title="Material Components"
                icon="🧩"
                href="https://github.com/material-components/material-web"
                description="Google's Material Design web components built with Lit. Learn the Sirocco best practice for integration."
                tutorialId="material-components"
                .onNavigate=${this.handleTutorialNavigation.bind(this)}
              ></swc-card>
            </swc-carousel>
          </div>

          <div class="mt-12 flex justify-center gap-4 flex-wrap">
            <button
              @click=${(e: Event) => this.handleNavigation('tutorial', e)}
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
