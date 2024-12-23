///////////////////  CONFIGURATION  ///////////////////

// Enable session storage access for content script
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });

// Direct user to restart browser for cleanup of any injected elements 
chrome.runtime.setUninstallURL("https://us-central1-cover-letter-generator-439117.cloudfunctions.net/tooltip-cleanup");

// set of urls where content script injection is forbidden
const forbiddenUrls = [
    "https://chromewebstore.google.com/",
    "chrome://",
    "https://chrome.google.com"
];

/////////////////// LISTENERS ///////////////////

// Inject content script into all tabs on extension update
chrome.runtime.onInstalled.addListener(onInstallHandler);

// Listen for requests from popup to inject content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    message === "injectContentScript" && injectContentScript();
});

// Extension shortcuts listener
chrome.commands.onCommand.addListener(async function (command) {
    if (command === "get-selected-text") {
        const selection = await awaitableGetSelectedText();

        if (!selection) {
            return;
        }

        const text = selection[0].result;

        chrome.storage.session.get(["templateTargets", "currentlySelected"], result => {
            if (result.templateTargets) {
                const currentlySelected = result.currentlySelected;
                result.templateTargets[currentlySelected] = text;
                chrome.storage.session.set({ templateTargets: result.templateTargets });
            }
        });
    }
    else if (command === "toggle-previous-select" || command === "toggle-next-select") {
        const currentTab = await getCurrentTab();

        if (forbiddenUrls.some(url => currentTab.url.startsWith(url))) {
            return;
        }

        chrome.storage.session.get(["templateTargets", "currentlySelected"], result => {
            if (result.templateTargets) {
                const targetArray = Object.keys(result.templateTargets);
                const targetIndex = targetArray.indexOf(result.currentlySelected);
        
                let newTarget;
                if (command === "toggle-previous-select") {
                    newTarget = targetIndex === 0 ? targetArray.at(-1) : targetArray.at(targetIndex - 1);
                }
                else if (command === "toggle-next-select") {
                    newTarget = targetIndex === targetArray.length - 1 ? targetArray.at(0) : 
                        targetArray.at(targetIndex + 1);
                }
        
                chrome.storage.session.set({ currentlySelected: newTarget });
            }
        });
    }
    else if (command === "toggle-tooltip-visible") {
        chrome.storage.session.get(["currentlySelected"], result => {
            if (result.currentlySelected) {
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                    tabs.forEach(async (tab) => {
                        if (!forbiddenUrls.some(url => tab.url.startsWith(url))) {
                            chrome.tabs.sendMessage(tab.id, "toggleTooltip");
                        }
                    });
                });
            }
        });
    }
});

/////////////////// HELPER FUNCTIONS ///////////////////

// auto-inject content script on extension update
function onInstallHandler(details) {
    executeTooltipCleanup();
};

function executeTooltipCleanup() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(async (tab) => {
          if (!forbiddenUrls.some(url => tab.url.startsWith(url))) {
            // remove injected shadow host stylesheet
            await chrome.scripting.removeCSS({
                target: { tabId: tab.id },
                files: [chrome.runtime.getManifest().content_scripts[1].css[1]]
            });

            // remove injected html element
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [chrome.runtime.getManifest().content_scripts[0].js[0]]
            });
          }
        });
    });
}

function injectContentScript() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(async (tab) => {
          if (!forbiddenUrls.some(url => tab.url.startsWith(url))) {
            chrome.tabs.sendMessage(tab.id, "heartbeat", response => {
                if (chrome.runtime.lastError) {
                    console.log(`content script not detected on tab with id ${tab.id} - injecting...`);
                }

                if (response !== "true") {
                    chrome.scripting.insertCSS({
                        target: { tabId: tab.id },
                        files: [chrome.runtime.getManifest().content_scripts[1].css[1]]
                    });
        
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: [chrome.runtime.getManifest().content_scripts[1].js[0]]
                    });
                }
            });
          }
        });
    });
}

//The following code to get the selection is from an answer to "Get the
//  Highlighted/Selected text" on Stack Overflow, available at:
//  https://stackoverflow.com/a/5379408
//  The answer is copyright 2011-2017 by Tim Down and Makyen. It is
//  licensed under CC BY-SA 3.0, available at
//  https://creativecommons.org/licenses/by-sa/3.0/
function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    )
    {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    }
    else if (window.getSelection) {
        text = window.getSelection().toString().trim();
    }

    return text;
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function awaitableGetSelectedText() {
    return new Promise(async (resolve, reject) => {
        const currentTab = await getCurrentTab();

        if (!forbiddenUrls.some(url => currentTab.url.startsWith(url))) {
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                func: getSelectionText
            }, text => {
                resolve(text);
            });
        }
    });
}