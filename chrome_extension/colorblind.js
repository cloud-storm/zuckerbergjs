// colorblind.js
// by CloudStorm
// v0.1

//===============================================
window.colorPrefs = { blueTreshold:0.30 };

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
  
  // Quickly iterate over all elements
  // http://stackoverflow.com/questions/8747086
  // TODO: compare performance of document.all selector;
  var items = document.getElementsByTagName("*");

  var itemsLength = items.length
  for (var i = itemsLength; i--;) {
    unBlindItem(items[i]);
  }
};


function unBlindItem(item) {
  // Get color from CSSStyleDeclaration of item
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

//===============================================

function getPatternForColor(original) {
  var color = original.clone();
  var _isred = false;
  var _isgreen = false;

  if ( ((_isred = isRed(original)) || (_isgreen = isGreen(original))) && !isBlue(original)) {
    var darker = color.darken().toHexString().substr(1)
    var lighter = color.brighten(30).saturate(50).toHexString().substr(1)
    var pattern;
    
    if (_isred) {
      // 1x2 image in black/white for horizontal stripes
      pattern = "47 49 46 38 37 61 01 00 02 00 80 00 00" + lighter + darker + "2c 00 00 00 00 01 00 02 00 00 02 02 44 0a 00 3b";
    } else {
      // 2x1 image in black/white for vertical stripes
      pattern = "47 49 46 38 37 61 02 00 01 00 80 00 00" + lighter + darker + "2c 00 00 00 00 02 00 01 00 00 02 02 44 0a 00 3b";
    }
    return "url(data:image/gif;base64," + hexToBase64(pattern) + ") repeat";
  } else {
    return original.toString();
  }
};

function isRed(color) {
  var rgb = color.toRgb();
  return (rgb.r > rgb.g);
}

function isGreen(color) {
  var rgb = color.toRgb();
  return (rgb.r < rgb.g);
}

function isBlue(color) {
  var rgb = color.toRgb();
  var bt = window.colorPrefs.blueTreshold;
  return (rgb.r < rgb.b*0.8) && (rgb.g < rgb.b*0.8) && (rgb.b > bt*255)
}

//=== CONVERSION UTILS ====================================

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}
