import colorString from 'color-string'
import colors from './colors'

const colorList = Object.keys(colors).map((key) => {
  const color = colorString.get(`#${key}`)
  return {
    hex: key,
    name: colors[key],
    rgb: color.value
  }
})

/**
 * @param {Array} color1
 * @param {Array} color2
 * @return {number}
 */
const euclideanDistance = (color1, color2) => {
  // square root of sum of the squares of the differences in values
  // [red, green, blue, opacity]
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  )
}

const white = colorString.get('#fff')
const black = colorString.get('#000')
const MAX_DISTANCE = euclideanDistance(white.value, black.value)

/**
 * Super basic impl, it's only expected to work with strings coming from `colorList`
 * @param {string} string
 * @return {string}
 */
const slugify = (string = '', separator = '-') => {
  const chars = string.trim().split('')
  return chars.reduce((memo, char) => {
    return memo + char.replace(/'/, '').replace(/\s/, separator)
  }, '').toLocaleLowerCase()
}

/**
 * Combines "color" with solid white, it tries to get a new solid color when
 * "color" has some transparency value `color[3] < 1`
 * ref: https://en.wikipedia.org/wiki/Transparency_%28graphic%29
 * @param {Array} color - [red, green, blue, alpha]
 * @return {Array} - [red, green, blue, alpha=1]
 */
const combineWithWhite = (color) => {
  const opacity = color[3]
  return [
    ((1 - opacity) * white.value[0]) + (opacity * color[0]),
    ((1 - opacity) * white.value[1]) + (opacity * color[1]),
    ((1 - opacity) * white.value[2]) + (opacity * color[2]),
    1
  ]
}

/**
 * Main function exported
 * @param {string} colorCode Code representing the color to translate to
 * @param {boolean} slug Whether to "slugify" the result or not
 * @param {boolean} opaque Whether to combine input color with white background
 * @return {string}
 */
export default function getColorName (colorCode, slug = false, opaque = true) {
  const inputColor = colorString.get(colorCode)
  let distance = MAX_DISTANCE
  let colorMatch = {}

  // is it a web color?
  if (inputColor !== null) {
    const webColor = colorString.to.keyword(inputColor.value)
    if (webColor !== undefined) {
      colorMatch = {
        name: webColor
      }
    }
  }

  // is it an exact match?
  if (colorMatch.name === undefined && inputColor !== null) {
    colorMatch = colorList.find((color) => {
      return color.rgb === inputColor.value
    }) || {}
  }

  // let's find the closest one
  if (colorMatch.name === undefined && inputColor !== null) {
    // is it transparent? [r, g, b, a]
    const alpha = inputColor.value[3]
    if (alpha < 1 && opaque) {
      inputColor.value = combineWithWhite(inputColor.value)
    }

    colorList.forEach((color) => {
      const tmpDistance = euclideanDistance(inputColor.value, color.rgb)
      if (tmpDistance < distance) {
        distance = tmpDistance
        colorMatch = color
      }
    })
  }

  const colorName = colorMatch.name || ''
  return slug ? slugify(colorName) : colorName
}
