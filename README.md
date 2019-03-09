# Named Web colors

Heavily inspired by [Name that color JavaScript](http://chir.ag/projects/ntc/).

Utility to translate HEX color codes into more human friendly color names. It uses a simple Euclidean distance algorithm to find the closest color among approximately 1,567 references (CSS4 web colors included).

```javascript
import getColorName from 'named-web-colors'
getColorName('#663399') // rebeccapurple
getColorName('#3A2010') // Sambuca
```

## Refs
- [CSS4 named colors](https://drafts.csswg.org/css-color/#named-colors)
- [CSS variables syntax](https://www.w3.org/TR/css-variables/#syntax)
- [Color string](https://github.com/Qix-/color-string)
- [Color difference](https://en.wikipedia.org/wiki/Color_difference)
