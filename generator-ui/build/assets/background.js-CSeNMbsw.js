chrome.storage.session.setAccessLevel({accessLevel:"TRUSTED_AND_UNTRUSTED_CONTEXTS"});chrome.runtime.onInstalled.addListener(c);chrome.runtime.setUninstallURL("https://us-central1-cover-letter-generator-439117.cloudfunctions.net/tooltip-cleanup");chrome.commands.onCommand.addListener(async function(r){if(r==="get-selected-text"){const t=(await o())[0].result;chrome.storage.session.get(["templateTargets","currentlySelected"],s=>{if(s.templateTargets){const n=s.currentlySelected;s.templateTargets[n]=t,chrome.storage.session.set({templateTargets:s.templateTargets})}})}else(r==="toggle-previous-select"||r==="toggle-next-select")&&chrome.storage.session.get(["templateTargets","currentlySelected"],e=>{if(e.templateTargets){const t=Object.keys(e.templateTargets),s=t.indexOf(e.currentlySelected);let n;r==="toggle-previous-select"?n=s===0?t.at(-1):t.at(s-1):r==="toggle-next-select"&&(n=s===t.length-1?t.at(0):t.at(s+1)),chrome.storage.session.set({currentlySelected:n})}})});function c(r){chrome.tabs.query({},e=>{e.forEach(t=>{t.url.startsWith("chrome://")||(chrome.scripting.executeScript({target:{tabId:t.id},files:[chrome.runtime.getManifest().content_scripts[0].js[0]]}),chrome.scripting.insertCSS({target:{tabId:t.id},files:[chrome.runtime.getManifest().content_scripts[0].css[0]]}))})})}function a(){var r="",e=document.activeElement,t=e?e.tagName.toLowerCase():null;return t=="textarea"||t=="input"&&/^(?:text|search|password|tel|url)$/i.test(e.type)&&typeof e.selectionStart=="number"?r=e.value.slice(e.selectionStart,e.selectionEnd):window.getSelection&&(r=window.getSelection().toString().trim()),r}async function i(){let r={active:!0,lastFocusedWindow:!0},[e]=await chrome.tabs.query(r);return e}async function o(){return new Promise(async(r,e)=>{const t=await i();chrome.scripting.executeScript({target:{tabId:t.id},func:a},s=>{r(s)})})}
