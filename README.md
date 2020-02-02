# Named Web colors

Javascript utility to translate Hex color codes into human-friendly color names. Given an input color, it uses a simple Euclidean distance algorithm to find the closest color among a curated colors list of 1,567 references. 

Heavily inspired by [Name that color JavaScript](http://chir.ag/projects/ntc/), Chirag Mehta, 2007 (CC BY 2.5). This project also includes a colors list from the beautiful and insipiring [Werner’s Nomenclature of Colours](https://www.c82.net/werner) by Nicholas Rougeux.

## Install & usage
With [npm](http://npmjs.org/):

```console
$ npm install named-web-colors
```

It's built using the UMD pattern, only one function is exported and it can be used as follows:

```javascript
// as ES2015 module
import getColorName from 'named-web-colors'

// as CommonJS module
const getColorName = require('../lib/named-web-colors.js')

// in the browser
<script src="../lib/named-web-colors.js"></script>
<script>console.log(getColorName('#fff'))</script>
```

### Examples

```javascript
import getColorName from 'named-web-colors'

getColorName('#0D1117').name, // 'Bunker'
getColorName('#0D1117').distance // 0, it's an exact match
getColorName('#0D1117').css // --color-bunker: '#0D1117'   

// small variation which also matches the "Bunker" color
getColorName('#0D1118').name // 'Bunker' 

// color with alpha channel
getColorName('#FFFFB440').name // 'Portafino'
getColorName('#FFFFB440').css // '--color-portafino-25: #FFFFB440'
getColorName('#FFFFB440').rgb, // 'rgba(255, 255, 180, 0.25)'

// alpha channel ignored option
const options = { ignoreAlphaChannel: true }
getColorName('#FFFFB440', options).name // 'Apricot White'
getColorName('#FFFFB440', options).css // '--color-apricot-white: #FFFEEC'

// "list" option
const options = { list: 'werner' }
getColorName('#004162FF', options).name // 'Prussian Blue'
getColorName('#004162FF', options).name // '--color-prussian-blue: #004162'
```

### Options

First param is always the Hex code of the color you want to resolve (it also supports RGB and HSL color definitions). Second param is an options object with the following properties: 

- `ignoreAlphaChannel` - If `true`, it will ignore the alpha channel, blending the input color with black and white to get the nearest "solid" color.
- `list` -  It narrows down the output, instead of looking for matches within all the curated colors, it limits the search to [CSS 4 spec named colors](https://www.w3.org/TR/css-color-4/#named-colors) (`options.list = 'web'`) or to a list containing the Werner's Nomenclature of Colours (`options.list = 'werner'`).

### Output object type definition

| key | value | type | 
|-----|-------|------|
| name | Color name | String |
| distance | Calculated distance between the input and the closest color matched.<br> A value of 0 is an **exact match**. | Number |
| hex | Hex color code | String |
| css | A CSS custom property alike definition, examples: <br>Solid color: `--color-prussian-blue: #004162` <br>Color with alpha channel: `--color-prussian-blue-50: #00416280` | String | 
| rgb | RGB definition (or RGBA if input contains alpha channel) | String | 

## Refs

- [CSS4 named colors](https://drafts.csswg.org/css-color/#named-colors)
- [CSS variables syntax](https://www.w3.org/TR/css-variables/#syntax)
- [Color string](https://github.com/Qix-/color-string)
- [Color difference](https://en.wikipedia.org/wiki/Color_difference)
- [Delta E](http://zschuessler.github.io/DeltaE/learn/)

Similar packages:

- [18264 color-names](https://github.com/meodai/color-names)
- [Color-namer](https://github.com/colorjs/color-namer)
- [nearest-color](https://github.com/dtao/nearest-color)