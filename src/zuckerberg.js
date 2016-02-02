// zuckerberg.js

//===============================================

window.zBParams = { 
  blueTreshold: 0.30,
  stripeWidth: "4px"
} 

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

//===============================================

function unBlindItem(item) {
  // Get CSSStyleDeclaration of item
  var itemCss = window.getComputedStyle(item);
  // Get color objects from CSS
  var bgColor = tinycolor(itemCss.backgroundColor);
  var fontColor = tinycolor(itemCss.color);
  
  if (isColorful(fontColor)) {
    
    pattern = getPatternForColor(fontColor);
    item.style.background = pattern;
    item.style.backgroundSize = window.zBParams.stripeWidth + " " + window.zBParams.stripeWidth;
    item.style.color = "#FFF";

  } else if (isColorful(bgColor)) {
    
    pattern = getPatternForColor(bgColor);
    item.style.background = pattern;
    item.style.backgroundSize = window.zBParams.stripeWidth + " " + window.zBParams.stripeWidth;
  
  }
};

//===============================================

function getPatternForColor(original) {
  var color = original.clone();
  var darker = color.darken().toHexString().substr(1)
  var lighter = color.brighten(30).saturate(50).toHexString().substr(1)
  var pattern;
  
  if (isRed(original)) {
    // 1x2 image in black/white for horizontal stripes
    pattern = "47 49 46 38 37 61 01 00 02 00 80 00 00" + lighter + darker + "2c 00 00 00 00 01 00 02 00 00 02 02 44 0a 00 3b";
  } else {
    // 2x1 image in black/white for vertical stripes
    pattern = "47 49 46 38 37 61 02 00 01 00 80 00 00" + lighter + darker + "2c 00 00 00 00 02 00 01 00 00 02 02 44 0a 00 3b";
  }
  return "url(data:image/gif;base64," + hexToBase64(pattern) + ") repeat";
};

//=== COLOR UTILS =========================================

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
  var bt = window.zBParams.blueTreshold;
  return (rgb.r < rgb.b*0.8) && (rgb.g < rgb.b*0.8) && (rgb.b > bt*255)
}

function isColorful(color) {
  // Get cylindrical representation of color from RGB (en.wikipedia.org/wiki/HSL_and_HSV)
  var colorHSV = color.toHsv();
  var _isSaturated = colorHSV.s > 0.1;
  return _isSaturated && !isBlue(color) && ( isRed(color) || isGreen(color) );
}

//=== CONVERSION UTILS ====================================

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}
