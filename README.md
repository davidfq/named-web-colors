# Named Web colors

Heavily inspired by [Name that color JavaScript](http://chir.ag/projects/ntc/).

Javascript utility to translate HEX color codes into more human friendly color names. It uses a simple Euclidean distance algorithm to find the closest color among approximately 1,567 references (CSS4 web colors included).

## Install & usage
With [npm](http://npmjs.org/):

```console
$ npm install color-string
```

It's built using the UMD pattern, only one function is exported and it can be used as follows:

```javascript
// as ES2015 module
import namedWebColors from 'named-web-colors'

// as CommonJS module
const namedWebColors = require('../lib/named-web-colors.js')

// in the browser
<script src="../lib/named-web-colors.js"></script>
```

```javascript
import getColorName from 'named-web-colors'

getColorName('#663399') // rebeccapurple
getColorName('#FFB97B') // Macaroni and Cheese

// web safe option
getColorName('#FFB97B', true) // 'macaroni-and-cheese'

// for colors with alpha channel, it always tries to get the closest
// solid color mixing the input one with white as background
getColorName('#0041621A', true) // 'mystic'

// white color as background option can be disabled (alpha channel ignored)
getColorName('#0041621A', true, false) // 'astronaut-blue'
```

## Refs
- [CSS4 named colors](https://drafts.csswg.org/css-color/#named-colors)
- [CSS variables syntax](https://www.w3.org/TR/css-variables/#syntax)
- [Color string](https://github.com/Qix-/color-string)
- [Color difference](https://en.wikipedia.org/wiki/Color_difference)
