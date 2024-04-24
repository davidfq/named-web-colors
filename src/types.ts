export type Options = {
  ignoreAlphaChannel: boolean
  list: string,
}

export declare enum ColorsListKey {
  Curated = "curated",
  Web = "web",
  Werner = "werner"
}

export type AvailableColorsList = {
  [key in ColorsListKey]: ColorsList
}

export type ColorsList = {
  [key: string]: string
}

export type ColorOutput = {
  css: string, // CSS custom var definition
  distance: number, // distance to input
  hex: string,
  name: string, // resolved color name
  rgb: string
}