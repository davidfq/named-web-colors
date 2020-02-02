const fs = require('fs')
const _ = require('lodash')
const csv = require('csvtojson')
const colorsWeb = require('./colors-web.js')
const colorsCurated = require('./colors-curated.js')

// Web colors
// https://drafts.csswg.org/css-color/#named-colors
fs.writeFileSync('data/web.json', JSON.stringify(colorsWeb.default))

// Curated colors list
fs.writeFileSync('data/curated.json', JSON.stringify(colorsCurated.default))

// Werner's nomenclature of colors, exported from:
// https://docs.google.com/spreadsheets/d/10w7UebIDqN6ChEpBwLDQmAgVZZhLtKvnrLeNnBjJmsc/edit#gid=0
csv().fromFile('./tools/werners-nomenclature.csv').then((colors) => {
  const processedColorsWerner = _.reduce(colors, (result, color) => {
    result[color.Hex.replace('#', '').toUpperCase()] = color.Name
    return result
  }, {})
  fs.writeFileSync('data/werner.json', JSON.stringify(processedColorsWerner))
})
