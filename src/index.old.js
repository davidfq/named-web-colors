import colorString from 'color-string'

import colorsCurated from '../data/curated.json'
import colorsWeb from '../data/web.json'
import colorsWerner from '../data/werner.json'

const WHITE = colorString.get('#fff')
const BLACK = colorString.get('#000')

/**
 * Describes a matched color.
 *
 * @typedef {Object} ColorOutput
 * @property {string} name - The name of the matched color, e.g., 'red'
 * @property {string} hex - Hex color code e.g., '#FF0'
 * @property {string} rgb - RGB definition (or RGBA for colors with alpha channel).
 * @property {string} css - CSS custom property alike definition, e.g.
 *  `--color-prussian-blue: #004162`
 * @property {number} distance - Calculated distance between input and matched color.
 */

/**
 * Square root of sum of the squares of the differences in values
 * [red, green, blue, opacity]
 *
 * @param {Array} color1
 * @param {Array} color2
 * @return {Number}
 */
const euclideanDistance = (color1, color2) => {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  )
}

const MAX_DISTANCE = euclideanDistance(WHITE.value, BLACK.value)

/**
 * Combines foreground and background colors.
 * ref: https://en.wikipedia.org/wiki/Transparency_%28graphic%29
 *
 * @param {Array} foreground - [red, green, blue, alpha]
 * @param {Array} background - [red, green, blue, alpha]
 * @return {Array} - [red, green, blue, alpha=1]
 */
const blend = (foreground, background) => {
  const opacity = foreground[3]
  return [
    ((1 - opacity) * background[0]) + (opacity * foreground[0]),
    ((1 - opacity) * background[1]) + (opacity * foreground[1]),
    ((1 - opacity) * background[2]) + (opacity * foreground[2]),
    1
  ]
}

/**
 * Calculates color distance based on whether first param color input has
 * alpha channel or not.
 *
 * @param {Array} color1
 * @param {Array} color2
 * @return {number}
 */
const comparativeDistance = (color1, color2) => {
  if (color1[3] === 1 && color2[3] === 1) {
    // solid colors: use basic Euclidean distance algorithm
    return euclideanDistance(color1, color2)
  } else {
    // alpha channel: combine input color with white and black backgrounds
    // and comparte distances
    const withWhite = euclideanDistance(blend(color1, WHITE.value), color2)
    const withBlack = euclideanDistance(blend(color1, BLACK.value), color2)
    return withWhite <= withBlack ? withWhite : withBlack
  }
}

/**
 * Transform color name to web-safe slug.
 *
 * @param {string} string
 * @return {string}
 */
const slugify = (string = '', separator = '-') => {
  return string.trim().split('').reduce((memo, char) => {
    return memo + char.replace(/'/, '').replace(/\s/, separator)
  }, '').toLocaleLowerCase()
}

/**
 * Simple RGB comparation method.
 *
 * @param {Array} color1
 * @param {Array} color2
 * @param {boolean} ignoreAlphaChannel
 */
const compareRGB = (color1, color2, ignoreAlphaChannel = false) => {
  let result = false
  if (color1.length === 4 && color2.length === 4) {
    result = color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2]

    result = ignoreAlphaChannel ? result : color1[3] === color2[3]
  }
  return result
}

/**
 * Build output color object spec.
 *
 * @param {string} name - resolved color name
 * @param {string} hex - Hex color code
 * @param {Object} colorInput
 * @param {number} distance
 * @param {boolean} ignoreAlphaChannel
 * @return {ColorOutput}
 */
const buildColorOutput = (name, hex, colorInput, distance, ignoreAlphaChannel) => {
  const alpha = Number(colorInput.value[3]).toFixed(2)
  const slug = slugify(name)
  let result = {
    name: name,
    distance: distance
  }

  if (ignoreAlphaChannel) {
    result.hex = `#${hex}`
    result.css = `--color-${slug}: ${result.hex}`
  } else {
    // use HEX code from input directly as none of the curated colors have
    // alpha channel defined; test
    result.hex = colorString.to.hex(colorInput.value)
    // normalize alpha suffix
    let alphaSuffix = ''
    if (alpha > 0 && alpha < 1) {
      alphaSuffix = `-${Math.round(alpha * 100)}`
    }
    result.css = `--color-${slug}${alphaSuffix}: ${result.hex}`
  }

  // double check final result; `color-string` don't support HSL input
  // transforms to HEX (when input contains decimals, @see tests),
  // so `result.hex` may not be valid at this point
  if (colorString.get(result.hex) !== null) {
    const rgb = colorString.get(result.hex).value
    // round alpha value
    const rgbAlpha = Number.parseFloat(Number(rgb[3]).toFixed(2))
    result.rgb = colorString.to.rgb([rgb[0], rgb[1], rgb[2], rgbAlpha])
  } else {
    result = undefined
  }

  return result
}

/**
 * Main function to find the closest color among "colors" list.
 *
 * @param {string} code - color code: Hex, RGB or HSL
 * @param {Object} colors - color list: keys are Hex codes and values are color names
 * @param {boolean} ignoreAlphaChannel - whether to ignore alpha channel on input
 */
const getColor = (code, colors, ignoreAlphaChannel = false) => {
  const colorInput = colorString.get(code)
  const colorKeys = Object.keys(colors)
  let colorKeyMatch
  let distance = MAX_DISTANCE
  let result

  if (colorInput !== null) {
    // check if there's an exact match (it only happens with solid colors)
    if (!ignoreAlphaChannel) {
      colorKeyMatch = colorKeys.find((key) => {
        const color = colorString.get(`#${key}`)
        return compareRGB(color.value, colorInput.value, true)
      })
    }

    if (colorKeyMatch !== undefined) {
      distance = 0
    }

    if (distance > 0) {
      // let's find the closest one
      const calculateDistance = ignoreAlphaChannel ? comparativeDistance : euclideanDistance
      colorKeys.forEach((key) => {
        const colorCandidate = colorString.get(`#${key}`)
        const tmpDistance = calculateDistance(colorInput.value, colorCandidate.value)
        if (tmpDistance < distance) {
          colorKeyMatch = key
          distance = tmpDistance
        }
      })
    }
  }

  if (colorKeyMatch !== undefined) {
    result = buildColorOutput(colors[colorKeyMatch], colorKeyMatch, colorInput, distance,
      ignoreAlphaChannel)
  }

  return result
}

export default function getColorName (code, options = {}) {
  let colors = Object.assign({}, colorsWeb, colorsCurated)
  if (options.list && options.list === 'web') {
    colors = colorsWeb
  } else if (options.list && options.list === 'werner') {
    colors = colorsWerner
  }
  return getColor(code, colors, options.ignoreAlphaChannel)
}
