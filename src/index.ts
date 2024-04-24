
import {
  Options,
  ColorsListKey,
  AvailableColorsList,
  ColorsList,
  ColorOutput
} from './types'
import curated from '../data/curated.json'
import web from '../data/web.json'
import werner from '../data/werner.json'

const availableColors: AvailableColorsList = {
  [ColorsListKey.Curated]: curated,
  [ColorsListKey.Web]: web,
  [ColorsListKey.Werner]: werner
}

export default function getColorName(code: string, options: Options): ColorOutput {
  let colors: ColorsList
  if (Object.keys(availableColors).includes(options.list as ColorsListKey)) {
    colors = availableColors[options.list as ColorsListKey]
  } else {
    colors = Object.values(availableColors).reduce((prev, cur) => {
      return {...prev, ...cur}
    }, {})
  }

  console.log(colors)
  return null
}