// colorblind.js
// 
// Uses TinyColor library https://github.com/bgrins/TinyColor

//=========================================================
// 
// TODO: Integrate original color into pattern
//       Useful reading:
//        https://forum.jquery.com/topic/how-to-change-the-color-of-a-base64-encoded-png-image-in-jquery
//        http://micheljansen.org/blog/entry/1238
//        https://github.com/SachaG/Patternify
//        http://www.motobit.com/util/base64-decoder-encoder.asp
// TODO: Collect all relevant colours up front and only match in the iteration to increase speed(?)
// TODO: Adjustable CSS Opacity? -> not gonna work with GIF
// TODO: Support background color in :after and ::before pseudo-elements
// TODO: Support font color
// TODO: Optimize DOM manipulation for speed (CSS rule setting; str concat of css rule, etc.)
// TODO: extract unBlindPage into zuckerbergjs
// TODO: npm package
// TODO: bower package
// TODO: Chrome Extension package
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
  // TODO: compare performance
  // var items = document.all;

  var itemsLength = items.length
  for (var i = itemsLength; i--;) {
    unBlindItem(items[i]);
  }
};

//===============================================

var unBlindItem = function(item) {
  // Get CSSStyleDeclaration object of item
  var color = window.getComputedStyle(item).backgroundColor;
  // Get cylindrical representation of color from RGB (en.wikipedia.org/wiki/HSL_and_HSV)
  var colorHSV = tinycolor(color).toHsv();
  // Reference value of transparent background returned by getComputedStyle
  var transparent = 'rgba(0, 0, 0, 0)';

  // Modify item, unless the background color is transparent or low-chroma
  if ((color.localeCompare(transparent) !== 0) && (colorHSV.s > 0.1)) {
    pattern = getPatternForColor(item,color);
    item.style.background = pattern;
  }
};

//===============================================

var getPatternForColor = function(item, color) {
  
  // 2x1 image in black/white for vertical stripes
  var verticalStripes = 'R0lGODdhAgABAIAAAAAAAP///ywAAAAAAgABAAACAkQKADs='
  
  // 1x2 image in black/white for horizontal stripes
  var horizontalStripes = 'R0lGODdhAQACAIAAAAAAAP///ywAAAAAAQACAAACAkQKADs='
  
  var base64Pattern = "url(data:image/gif;base64," + verticalStripes + ") repeat";

  return base64Pattern;
};