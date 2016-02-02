// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "un_blind_page"});
  });
});



// Called when extension wants to update its icon
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // read `newIconPath` from request and read `tab.id` from sender
    chrome.browserAction.setIcon({
      path: request.newIconPath,
      tabId: sender.tab.id
  });
});
