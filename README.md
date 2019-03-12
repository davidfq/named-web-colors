# Named Web colors

Heavily inspired by [Name that color JavaScript](http://chir.ag/projects/ntc/).

Utility to translate HEX color codes into more human friendly color names. It uses a simple Euclidean distance algorithm to find the closest color among approximately 1,567 references (CSS4 web colors included).

```javascript
import getColorName from 'named-web-colors'

getColorName('#663399') // rebeccapurple
getColorName('#FFB97B') // Macaroni and Cheese

// web safe option
getColorName('#FFB97B', true), // 'macaroni-and-cheese'

// for colors with alpha channel, it always tries to get the closest
// solid color mixing the input one with white as background
getColorName('#0041621A', true), 'mystic') // 10% - 1A alpha
// mixing default option can be disabled (i.e. alpha channel ignored)
getColorName('#0041621A', true, false), 'astronaut-blue')
```

## Refs
- [CSS4 named colors](https://drafts.csswg.org/css-color/#named-colors)
- [CSS variables syntax](https://www.w3.org/TR/css-variables/#syntax)
- [Color string](https://github.com/Qix-/color-string)
- [Color difference](https://en.wikipedia.org/wiki/Color_difference)
