/**
 * Material Web Components Registry
 *
 * This file centralizes all Material Web Component imports.
 * Following Sirocco best practices, we keep all external component
 * imports in a dedicated file for better maintainability and
 * code organization.
 *
 * @see https://github.com/material-components/material-web
 *
 * To use these components in your project:
 * 1. Install: yarn add @material/web
 * 2. Import this file in your main entry point
 * 3. Use components in your templates: <md-filled-button>Click</md-filled-button>
 */

// Buttons
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/filled-tonal-button.js';

// Text Fields
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';

// Form Elements
import '@material/web/checkbox/checkbox.js';
import '@material/web/radio/radio.js';
import '@material/web/switch/switch.js';

// Icons
import '@material/web/icon/icon.js';

// Dialogs & Menus
import '@material/web/dialog/dialog.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

// Lists
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

// Progress
import '@material/web/progress/circular-progress.js';
import '@material/web/progress/linear-progress.js';

// Chips
import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/chips/input-chip.js';

/**
 * Material Design Theming
 *
 * To theme Material Web Components, define CSS custom properties in your global styles:
 *
 * :root {
 *   --md-sys-color-primary: #6750a4;
 *   --md-sys-color-on-primary: #ffffff;
 *   --md-sys-color-primary-container: #eaddff;
 *   --md-sys-color-surface: #fffbfe;
 *   --md-sys-color-on-surface: #1c1b1f;
 * }
 *
 * @media (prefers-color-scheme: dark) {
 *   :root {
 *     --md-sys-color-primary: #d0bcff;
 *     --md-sys-color-on-primary: #381e72;
 *     --md-sys-color-surface: #1c1b1f;
 *     --md-sys-color-on-surface: #e6e1e5;
 *   }
 * }
 */
