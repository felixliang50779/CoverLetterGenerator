import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';


const root = document.createElement("div");
root.id = "floating-tooltip";
root.style.position = "fixed";
root.style.zIndex = "9999";  // making sure the tooltip isn't covered by any elements

document.body.parentNode.insertBefore(root, document.body);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);