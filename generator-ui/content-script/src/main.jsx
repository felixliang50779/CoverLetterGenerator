import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// shadow host stylesheet
import "./FloatingTooltip.css";

// inline the shadow root stylesheet directly
// for it to be usable
import styles from "./TooltipInput.css?inline";

// if orphaned script is present we remove its associated tooltip element
const orphaned_element = document.getElementById("floating-tooltip");
if (orphaned_element) {
  orphaned_element.remove();
}

const tooltip = document.createElement("div");
tooltip.id = "floating-tooltip";

const shadowRoot = tooltip.attachShadow({ mode: "open" });

document.body.parentNode.insertBefore(tooltip, document.body);

createRoot(shadowRoot).render(
  <StrictMode>
    <style type="text/css">{styles}</style>
    <App />
  </StrictMode>
);