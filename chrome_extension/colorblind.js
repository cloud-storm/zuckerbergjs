// colorblind.js
// 
// Uses TinyColor library https://github.com/bgrins/TinyColor
// 
//===============================================
// 
// TODO: Integrate original color into pattern
//       Useful reading:
//        https://forum.jquery.com/topic/how-to-change-the-color-of-a-base64-encoded-png-image-in-jquery
//        http://micheljansen.org/blog/entry/1238
//        https://github.com/SachaG/Patternify
//        http://www.motobit.com/util/base64-decoder-encoder.asp
//        http://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript
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
//===============================================

// Start execution on incoming message from Extension button
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "un_blind_page" ) {
      unBlindPage();
    }
  }
);

//===============================================

function unBlindPage(message) {
  
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

//=====================================

function unBlindItem(item) {
  // Get CSSStyleDeclaration object of item
  var color = window.getComputedStyle(item).backgroundColor;
  // Get cylindrical representation of color from RGB (en.wikipedia.org/wiki/HSL_and_HSV)
  var colorHSV = tinycolor(color).toHsv();
  // Get components of color
  var colorComponents = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/)
  // Reference value of transparent background returned by getComputedStyle
  var transparent = 'rgba(0, 0, 0, 0)';

  // Modify item, unless the background color is transparent or low-chroma
  if ((color.localeCompare(transparent) !== 0) && (colorHSV.s > 0.1)) {
    pattern = getPatternForComponents(colorComponents);
    item.style.background = pattern;
  }
};

//=====================================

function getPatternForComponents(components) {
  
  var originalColor = rgbToHex(components[0], components[1], components[2]);
  // 2x1 image in black/white for vertical stripes
  var verticalStripes = "47 49 46 38 37 61 02 00 01 00 80 00 00 00 00 00 " + originalColor + " 2c 00 00 00 00 02 00 01 00 00 02 02 44 0a 00 3b";
  // 1x2 image in black/white for horizontal stripes
  var horizontalStripes = "47 49 46 38 37 61 01 00 02 00 80 00 00 00 00 00 " + originalColor + " 2c 00 00 00 00 01 00 02 00 00 02 02 44 0a 00 3b";

  if (true) {
    return "url(data:image/gif;base64," + hexToBase64(horizontalStripes) + ") repeat";
  } else {
    return "url(data:image/gif;base64," + hexToBase64(verticalStripes) + ") repeat";
  }
};

//=== CONVERSION UTILS ====================================

function rgbToHex(r, g, b) {
  return ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).substr(1);
}

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join(" ");
}