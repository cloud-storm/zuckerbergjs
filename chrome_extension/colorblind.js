// colorblind.js
// 
// Background patterns generated with https://github.com/SachaG/Patternify

//=========================================================
// 
// TODO: extract unBlindPage into zuckerbergjs
// TODO: npm package
// TODO: bower package
// TODO: Chrome Extension package
// TODO: CSS Opacity
// TODO: Optimize DOM manipulation for speed (CSS rule setting; str concat of css rule, etc.)
// 
//=========================================================

// Start execution on incoming message from Extension button
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "un_blind_page" ) {
      unBlindPage();
    }
  }
);

//=========================================================

var unBlindPage = function(message) {
  
  // Iterate over all elements in page - 
  // fastest is to reverse iterate with plain JS
  // http://stackoverflow.com/questions/8747086
  
  // Option 1
  var items = document.getElementsByTagName("*");
  
  // Option 2 
  // TODO: test performance
  // var items = document.all;

  var itemsLength = items.length
  for (var i = itemsLength; i--;) {
    unBlindItem(items[i]);
  }
};

//===============================================

var unBlindItem = function(item) {
  var color = window.getComputedStyle(item).backgroundColor;
  var transparent_ref = 'rgba(0, 0, 0, 0)';
  
  // Unless the background color is transparent, unblind item
  if (color.localeCompare(transparent_ref) !== 0) {
    pattern = getPatternForColor(item,color);
    item.style.background = pattern;
  }
};

//===============================================

var getPatternForColor = function(item, color) {
  return "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2NkQAX/GZH4/xkYGBhhAmAOSBJEwDkgAQCCrgQEqRgDDwAAAABJRU5ErkJggg== ) repeat";
};