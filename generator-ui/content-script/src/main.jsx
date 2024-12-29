import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// shadow host stylesheet
import hostStyles from "./FloatingTooltip.css?inline";

// inline the shadow root stylesheet directly
// for it to be usable
import tooltipStyles from "./TooltipInput.css?inline";

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