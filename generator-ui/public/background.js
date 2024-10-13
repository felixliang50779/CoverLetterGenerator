chrome.commands.onCommand.addListener(async function (command) {
    if (command == "get-selected-text") {
        const currentTab = await getCurrentTab();
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: getSelectionText
        });
    }
});

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
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    window.console.log(text);
    return text;
}

export async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}