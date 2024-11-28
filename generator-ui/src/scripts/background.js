// Enable session storage access for content script
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });

// Inject content script into all tabs on extension install or update
chrome.runtime.onInstalled.addListener(onInstallHandler);

chrome.runtime.setUninstallURL("https://us-central1-cover-letter-generator-439117.cloudfunctions.net/tooltip-cleanup");

// Extension shortcuts listener
chrome.commands.onCommand.addListener(async function (command) {
    if (command === "get-selected-text") {
        const selection = await awaitableGetSelectedText();

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
        chrome.storage.session.get(["templateTargets", "currentlySelected"], result => {
            if (result.templateTargets) {
                const targetArray = Object.keys(result.templateTargets);
                const targetIndex = targetArray.indexOf(result.currentlySelected);
        
                let newTarget;
                if (command === "toggle-previous-select") {
                    newTarget = targetIndex === 0 ? targetArray.at(-1) : targetArray.at(targetIndex - 1);
                }
                else if (command === "toggle-next-select") {
                    newTarget = targetIndex === targetArray.length - 1 ? targetArray.at(0) : targetArray.at(targetIndex + 1);
                }
        
                chrome.storage.session.set({ currentlySelected: newTarget });
            }
        });
    }
});

/////////////////// HELPER FUNCTIONS ///////////////////

function onInstallHandler(details) {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          if (!tab.url.startsWith("chrome://")) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [chrome.runtime.getManifest().content_scripts[0].js[0]]
            });
            chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: [chrome.runtime.getManifest().content_scripts[0].css[0]]
            });
          }
        });
    });
}

function reloadTabs() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          if (!tab.url.startsWith("chrome://")) {
            chrome.tabs.reload(tab.id);
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
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: getSelectionText
        }, text => {
            resolve(text);
        });
    });
}