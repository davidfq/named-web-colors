import _ from 'lodash'
import colorString from 'color-string'
import colors from './colors'

const colorList = _.map(colors, (value, key) => {
  const color = colorString.get(`#${key}`)
  return {
    hex: key,
    name: value,
    rgb: color.value
  }
})

const euclideanDistance = (color1, color2) => {
  // square root of sum of the squares of the differences in values
  // [red, green, blue]
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  )
}

const white = colorString.get('#fff')
const black = colorString.get('#000')
const MAX_DISTANCE = euclideanDistance(white.value, black.value)

export default function getColorName(colorCode) {
  const inputColor = colorString.get(colorCode)
  let distance = MAX_DISTANCE
  let colorMatch = {}

  // is it a web color?
  if (!_.isNull(inputColor)) {
    const webColor = colorString.to.keyword(inputColor.value)
    if (!_.isUndefined(webColor)) {
      colorMatch = {
        name: webColor
      }
    }
  }

  // is it an exact match?
  if (_.isEmpty(colorMatch) && !_.isNull(inputColor)) {
    colorMatch = _.find(colorList, _.matchesProperty('rgb', inputColor.value))
  }

  // let's find the closest one
  if (_.isEmpty(colorMatch) && !_.isNull(inputColor)) {
    _.each(colorList, (color) => {
      const tmpDistance = euclideanDistance(inputColor.value, color.rgb)
      if (tmpDistance < distance) {
        distance = tmpDistance
        colorMatch = color
      }
    })
  }

  return colorMatch.name || ''
}