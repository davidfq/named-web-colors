const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'named-web-colors.js',
    library: 'namedWebColors',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  }
}
