var KP_dwelltime;
var KP_gaptime;

var getSettings = function() {
    // Grab KP settings
    chrome.storage.sync.get(function(settings){
        if(!settings.KP_dwelltime){settings.KP_dwelltime = 200;}
        if(!settings.KP_gaptime){settings.KP_gaptime = 200;}
        KP_dwelltime = settings.KP_dwelltime;
        KP_gaptime = settings.KP_gaptime;
        chrome.storage.sync.set(settings, function() {
            console.log("Settings updated");
        });
    });
}

// Handle tab switching
chrome.tabs.onActivated.addListener(function (event) {
    chrome.tabs.get(event.tabId, function(tab) {
            getSettings();
            // the tab has loaded - check to see if the URL is whitelisted.
            chrome.storage.sync.get("KP__" + tab.url.split("/")[2], function(items){
                if(items["KP__" + tab.url.split("/")[2]]) {
                    // This site is whitelisted - run KP
                    chrome.action.setIcon({path: 'icons/icon.png'});
                }
                else {                    
                    // This site is not whitelisted - do nothing.
                    chrome.action.setIcon({path: 'icons/icon.png'});
                }
            });
    });
});

// Handle URL changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            getSettings();
            // the tab has loaded - check to see if the URL is whitelisted.
            
            chrome.storage.sync.get("KP__" + tab.url.split("/")[2], function(items){
                if(items["KP__" + tab.url.split("/")[2]]) {
                    // This site is whitelisted - run KP
                    chrome.action.setIcon({path: 'icons/icon.png'});
                }
                else {                    
                    // This site is not whitelisted - do nothing.
                chrome.action.setIcon({path: 'icons/icon.png'});
                    chrome.tabs.sendMessage(tabId, {name: "enablePrivacyMode","KP_dwelltime":KP_dwelltime, "KP_gaptime":KP_gaptime}, function(response) {
                        // We don't need a callback here just yet, but the next version will.
                    });
                }
            });
        }
});

// Heartbeat Monitoring 
// Ensure the background script handles heartbeat messages properly:
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "heartbeat") {
    console.log(`Heartbeat received from tab ${sender.tab ? sender.tab.id : "unknown"}`);
    sendResponse({ status: "ok" });
  }
});
