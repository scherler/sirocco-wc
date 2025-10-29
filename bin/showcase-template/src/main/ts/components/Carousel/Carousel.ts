import { LitElement, html } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import styles from './Carousel.styles';

@customElement('swc-carousel')
export class Carousel extends LitElement {
  static styles = [styles];

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

  private scroll(direction: 'left' | 'right') {
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
  }

  private get containerWidth() {
    return `calc(${this.visibleCards} * (350px + 2rem) - 2rem)`;
  }

  render() {
    return html`
      <div class="carousel-wrapper relative mx-auto" style="width: ${this.containerWidth};">
        <button
          @click=${() => this.scroll('left')}
          class="carousel-button absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all nav-button"
          style="left: -1.5rem;"
          aria-label="Previous"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <div class="overflow-hidden">
          <div
            class="scroll-container overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          >
            <div class="flex gap-8 px-4" style="width: fit-content;">
              <slot></slot>
            </div>
          </div>
        </div>

        <button
          @click=${() => this.scroll('right')}
          class="carousel-button absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all nav-button"
          style="right: -1.5rem;"
          aria-label="Next"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      ${this.totalCards > 0 ? html`
        <div class="scroll-indicators">
          ${Array.from({ length: this.totalCards }, (_, i) => html`
            <button
              class="scroll-indicator ${i === this.currentIndex ? 'active' : ''}"
              @click=${() => this.scrollToIndex(i)}
              aria-label="Go to slide ${i + 1}"
            ></button>
          `)}
        </div>
      ` : ''}
    `;
  }

  private scrollToIndex(index: number) {
    this.currentIndex = index;
    const slot = this.shadowRoot?.querySelector('slot');
    const cards = slot?.assignedElements() || [];
    const cardWidth = (cards[0] as HTMLElement)?.offsetWidth || 350;
    const gap = 32;
    const scrollAmount = (cardWidth + gap) * index;

    this.scrollContainer.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}