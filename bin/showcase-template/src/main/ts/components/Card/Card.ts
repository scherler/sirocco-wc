import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './Card.styles';

@customElement('swc-card')
export class Card extends LitElement {
  static styles = [styles];

  @property({ type: String })
  title = '';

  @property({ type: String })
  icon = '';

  @property({ type: String })
  description = '';

  @property({ type: String })
  href = '';

  @property({ type: String })
  tutorialId = '';

  @property({ type: Function })
  onNavigate?: (tutorialId: string) => void;

  private handleClick(e: Event) {
    if (this.tutorialId && this.onNavigate) {
      e.preventDefault();
      this.onNavigate(this.tutorialId);
    }
  }

  render() {
    const cardContent = html`
      <div class="p-6 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="card-icon-bg">
            <span class="text-2xl" role="img" aria-label="${this.title}">
              ${this.icon}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="card-title">
              ${this.title}
            </h3>
            ${this.href
              ? html`
                  <a
                    href="${this.href}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="card-link"
                    title="${this.href}"
                    @click="${(e: Event) => e.stopPropagation()}"
                  >
                    ${this.href}
                  </a>
                `
              : ''}
          </div>
        </div>
        <p class="card-description flex-1">
          ${this.description}
        </p>
        ${this.tutorialId
          ? html`
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="${this.handleClick}"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Learn More in Tutorial
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            `
          : ''}
      </div>
      <div class="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    `;

    return this.tutorialId
      ? html`
          <div class="group card-container">
            ${cardContent}
          </div>
        `
      : this.href
      ? html`
          <a
            href="${this.href}"
            target="_blank"
            rel="noopener noreferrer"
            class="group block card-container"
          >
            ${cardContent}
          </a>
        `
      : html`
          <div class="group card-container">
            ${cardContent}
          </div>
        `;
  }
}
