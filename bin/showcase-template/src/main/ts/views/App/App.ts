import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './App.styles';
import '../../components';
import '../../views';

type Page = 'home' | 'tutorial';

@customElement('swc-app')
export class App extends LitElement {
  static styles = [styles];

  @state()
  private currentPage: Page = 'home';

  @state()
  private tutorialSection?: string;

  private navigateTo(page: Page, tutorialId?: string) {
    this.currentPage = page;
    this.tutorialSection = tutorialId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private renderHome() {
    return html`
      <div class="app-container">
        <swc-header .onNavigate=${this.navigateTo.bind(this)}></swc-header>
        <swc-hero .onNavigate=${this.navigateTo.bind(this)}></swc-hero>
        <swc-footer></swc-footer>
      </div>
    `;
  }

  private renderTutorial() {
    return html`
      <div class="app-container">
        <swc-header .onNavigate=${this.navigateTo.bind(this)}></swc-header>
        <swc-tutorial .initialSection=${this.tutorialSection}></swc-tutorial>
        <swc-footer></swc-footer>
      </div>
    `;
  }

  render() {
    return this.currentPage === 'home' ? this.renderHome() : this.renderTutorial();
  }
}
