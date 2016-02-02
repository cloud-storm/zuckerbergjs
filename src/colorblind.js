// colorblind.js
// by CloudStorm
// v0.1


//===============================================
window.cBExtParams = { 
  onIcon: "icon_on.png",
  offIcon: "icon_off.png",
  isUnblinding: false
};

//===============================================

// Start execution on incoming message (sent by extension button)
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "un_blind_page" ) {
      handleExtensionClick()
    }
  }
);

//===============================================

function handleExtensionClick() {
  updateIcon();
  unBlindPage();
}

//===============================================

function updateIcon() {
  window.isUnblinding = !window.isUnblinding;
  var iconPath = cBExtParams.offIcon;
  if (window.isUnblinding) { iconPath = cBExtParams.onIcon; }
  // send message to background script
  chrome.runtime.sendMessage({ "newIconPath" : iconPath });

  // Reload page but don't force download assets
  if (!window.isUnblinding) {  window.location.reload(false); }
}
