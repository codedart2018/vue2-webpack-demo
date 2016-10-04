const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  devtool: '#eval-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true
  }
})