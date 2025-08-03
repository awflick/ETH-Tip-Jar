//src/main.jsx

// ==========================
// Entry Point: main.jsx
// ==========================
// This is the root file where React mounts the <App /> component
// into the HTML div with id="root". Also enables React StrictMode
// for dev-only checks.

import { StrictMode } from 'react'; // Helps identify potential problems in development
import { createRoot } from 'react-dom/client'; // React 18+ root API
import './index.css'; // Global styles
import App from './App.jsx'; // Main app component

// Mount the App component to the DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
