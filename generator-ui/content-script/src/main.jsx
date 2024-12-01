import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// if orphaned script is present we remove its associated tooltip element
const orphaned_element = document.getElementById("floating-tooltip");
if (orphaned_element) {
  orphaned_element.remove();
}

const tooltip = document.createElement("div");
tooltip.id = "floating-tooltip";
tooltip.style.position = "fixed";
tooltip.style.zIndex = "9999";  // making sure the tooltip isn't covered by any elements

const shadowRoot = tooltip.attachShadow({ mode: "open" });

document.body.parentNode.insertBefore(tooltip, document.body);

createRoot(shadowRoot).render(
  <StrictMode>
    <App />
  </StrictMode>
);