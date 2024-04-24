const webpack = require('webpack')
const path = require('path')
const info = require('./package.json')
const banner = `${info.name} v${info.version}\n${info.homepage}`

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'named-web-colors.js',
    library: 'getColorName',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'. 
      // This loader needs to run before any other
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
}
