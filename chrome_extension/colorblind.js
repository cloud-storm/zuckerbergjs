// colorblind.js
// by CloudStorm
// v0.1

//===============================================

// Start execution on incoming message (sent by extension button)
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
  var color = tinycolor(window.getComputedStyle(item).backgroundColor);
  // Get cylindrical representation of color from RGB (en.wikipedia.org/wiki/HSL_and_HSV)
  var colorHSV = color.toHsv();
  // Reference value of transparent background returned by getComputedStyle
  var transparent = 'rgba(0, 0, 0, 0)';

  // Modify item, unless the background color is transparent or low-chroma
  if ((color.toString().localeCompare(transparent) !== 0) && (colorHSV.s > 0.1)) {
    pattern = getPatternForColor(color);
    item.style.background = pattern;
  }
};

//=====================================

function getPatternForColor(color) {
  var originalColor = color.darken().toHexString().substr(1)
  var accentedColor = color.brighten(40).saturate(50).toHexString().substr(1)
  
  // 2x1 image in black/white for vertical stripes
  var verticalStripes = "47 49 46 38 37 61 02 00 01 00 80 00 00" + accentedColor + originalColor + "2c 00 00 00 00 02 00 01 00 00 02 02 44 0a 00 3b";
  // 1x2 image in black/white for horizontal stripes
  var horizontalStripes = "47 49 46 38 37 61 01 00 02 00 80 00 00" + accentedColor + originalColor + "2c 00 00 00 00 01 00 02 00 00 02 02 44 0a 00 3b";

  if (true) {
    return "url(data:image/gif;base64," + hexToBase64(horizontalStripes) + ") repeat";
  } else {
    return "url(data:image/gif;base64," + hexToBase64(verticalStripes) + ") repeat";
  }
};

//=== CONVERSION UTILS ====================================

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}
