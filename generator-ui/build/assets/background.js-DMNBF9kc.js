chrome.storage.session.setAccessLevel({accessLevel:"TRUSTED_AND_UNTRUSTED_CONTEXTS"});chrome.commands.onCommand.addListener(async function(s){if(s==="get-selected-text"){const t=(await g())[0].result;chrome.storage.session.get(["templateTargets","currentlySelected"],a=>{if(a.templateTargets){const c=a.currentlySelected;a.templateTargets[c]=t,chrome.storage.session.set({templateTargets:a.templateTargets},()=>{chrome.storage.session.get(["templateTargets"],r=>{Object.values(r.templateTargets).every(o=>o!=="")?n("Ready to Generate!",`Set value "${t}" for target ${c}`,"success-icon.png"):n("Success!",`Set value "${t}" for target ${c}`,"success-icon.png")})})}})}else(s==="toggle-previous-select"||s==="toggle-next-select")&&chrome.storage.session.get(["templateTargets","currentlySelected"],e=>{if(e.templateTargets){const t=Object.keys(e.templateTargets),a=t.indexOf(e.currentlySelected);let c;s==="toggle-previous-select"?c=a===0?t.at(-1):t.at(a-1):s==="toggle-next-select"&&(c=a===t.length-1?t.at(0):t.at(a+1)),chrome.storage.session.set({currentlySelected:c},()=>{n("Attention",`Now selecting for ${c}: ${e.templateTargets[c]}`,"alert-icon.png")})}})});async function n(s,e,t){const a=await chrome.notifications.create({type:"basic",iconUrl:t,title:s,message:e,silent:!0});setTimeout(()=>chrome.notifications.clear(a),1250)}function i(){var s="",e=document.activeElement,t=e?e.tagName.toLowerCase():null;return t=="textarea"||t=="input"&&/^(?:text|search|password|tel|url)$/i.test(e.type)&&typeof e.selectionStart=="number"?s=e.value.slice(e.selectionStart,e.selectionEnd):window.getSelection&&(s=window.getSelection().toString().trim()),window.console.log(s),s}async function l(){let s={active:!0,lastFocusedWindow:!0},[e]=await chrome.tabs.query(s);return e}async function g(){return new Promise(async(s,e)=>{const t=await l();chrome.scripting.executeScript({target:{tabId:t.id},func:i},a=>{s(a)})})}
