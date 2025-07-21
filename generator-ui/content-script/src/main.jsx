import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// shadow host stylesheet
import hostStyles from "./ShadowHost.css?inline";

// inline tooltip stylesheet directly
// to avoid it bleeding into the browser DOM
import tooltipStyles from "./FloatTooltip.css?inline";

const tooltip = document.createElement("div");
tooltip.id = "floating-tooltip";

const shadowHostStyleTag = document.createElement('style');
shadowHostStyleTag.textContent = hostStyles;

tooltip.appendChild(shadowHostStyleTag);

const shadowRoot = tooltip.attachShadow({ mode: "open" });

document.body.parentNode.insertBefore(tooltip, document.body);

createRoot(shadowRoot).render(
  <StrictMode>
    <style type="text/css">{tooltipStyles}</style>
    <App />
  </StrictMode>
);