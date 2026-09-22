import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Styles from './Greetingcard.styles';

@customElement('demo-greetingcard')
export class Greetingcard extends LitElement {
  static styles = [Styles];

  @property({ type: String }) name = 'World';

  @property({ type: Array }) items: string[] = [];

  render() {
    return html`
      <button type="button" @click=${this._onClick}>Hello, ${this.name}</button>
      <ul>
        ${(this.items ?? []).map((item) => html`<li>${item}</li>`)}
      </ul>
    `;
  }

  private _onClick() {
    this.dispatchEvent(
      new CustomEvent('greeting-clicked', {
        detail: { name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }
}
