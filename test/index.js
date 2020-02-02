import test from 'ava'
import getColorName from '../lib/named-web-colors'

test('it doesn\'t break because of parsing errors', t => {
  t.is(getColorName('#'), undefined)
  t.is(getColorName('test'), undefined)
})

test('web color matches', t => {
  const color = getColorName('#663399')
  t.is(color.css, '--color-rebecca-purple: #663399')
  t.is(color.distance, 0)
})

test('Exact matches vs. variations', t => {
  t.is(getColorName('#0D1117').name, 'Bunker') // exact match
  t.is(getColorName('#0D1117').distance, 0) // exact match
  t.is(getColorName('#0D1118').name, 'Bunker')
  t.not(getColorName('#0D1118').distance, 0)
})

test('not only HEX supported', t => {
  t.is(getColorName('#0D1117').name, 'Bunker')
  t.is(getColorName('rgba(13, 17, 23, 1)').name, 'Bunker')
  t.is(getColorName('rgb(13, 17, 23)').name, 'Bunker')
  t.is(getColorName('hsl(216, 27%, 7%)').name, 'Thunderbird')
  t.is(getColorName('hsl(216, 27.8%, 7.1%)'), undefined)
})

test('HEX opacity', t => {
  // fully opaque
  t.is(getColorName('#004162FF').css, '--color-astronaut-blue: #004162')
  // 50% - 80 alpha
  t.is(getColorName('#00416280').css, '--color-astronaut-blue-50: #00416280')
  // 10% - 1A alpha
  t.is(getColorName('#0041621A').css, '--color-astronaut-blue-10: #0041621A')
})

test('Werner\'s nomenclature', t => {
  t.is(getColorName('#004162FF', { list: 'werner' }).css,
    '--color-prussian-blue: #004162')
  t.is(getColorName('#00416280', { list: 'werner' }).css,
    '--color-prussian-blue-50: #00416280')
})

test('ignore alpha channel', t => {
  t.is(getColorName('#FFFFB440').css, '--color-portafino-25: #FFFFB440')
  t.is(getColorName('#FFFFB440').rgb, 'rgba(255, 255, 180, 0.25)')
  t.is(getColorName('#FFFFB440', { ignoreAlphaChannel: true }).css,
    '--color-apricot-white: #FFFEEC')
  t.is(getColorName('#FFFFB440', { ignoreAlphaChannel: true }).rgb,
    'rgb(255, 254, 236)')
})
