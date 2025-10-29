import './views';
import './common/ThemesVariables.css';

// Import Material Web Components
// This centralizes all Material WC imports following Sirocco best practices
import './material-components';

// Append the app component to the body
const app = document.createElement('swc-app');
document.body.appendChild(app);
