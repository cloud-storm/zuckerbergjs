# zuckerberg.js
Utility to make the web and enterprise software accessible for color blind people

# Features
- Lightweight
- Bootstrap compatible
- Highlights colorful backgrounds and text as well

# Usage

# Dependencies 
- TinyColor (https://github.com/bgrins/TinyColor)

## Possible improvements
- Permanent setting for auto-unblinding websites
- Zoom pattern along with browser zoom
- Support background color in :after and ::before pseudo-elements
- Support faked backgrounds by wide borders
- Implement lightweight automatic watch for new elements/change of elements
- Handle gradients (based on sampling)
- Extend patterns to cover blue & secondary colors to aid fully color blind users
- Add pattern hints/legend
- Cache relevant colours and only match in the iteration to increase speed
- Adjustable CSS Opacity (may need to switch from gif to png for this)
- Experiment with svg patterns, like https://github.com/btmills/geopattern

### Useful links
- http://micheljansen.org/blog/entry/1238
- https://github.com/SachaG/Patternify
- http://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript
- http://www.motobit.com/util/base64-decoder-encoder.asp

### Currently unsupported sites (check their coloring implementation)
- http://koponyeg.hu
- http://444.hu
