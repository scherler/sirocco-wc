import './views';
import './common/ThemesVariables.css';

// Material Symbols Outlined icon font -- required for <md-icon> to render
// glyphs (e.g. arrow_forward) instead of raw ligature text.
import '@fontsource/material-symbols-outlined';

// Import Material Web Components
// This centralizes all Material WC imports following Sirocco best practices
import './material-components';

// Append the app component to the body
const app = document.createElement('swc-app');
document.body.appendChild(app);
