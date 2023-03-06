const baseConfig = require('./webpack.base.conf')
const { smart } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const FileMangerPlugin = require('filemanager-webpack-plugin')
module.exports = smart(baseConfig, {
  mode: 'production',
  // mode: 'development',
  output: {
    path: path.resolve(__dirname, '../bundle', 'dist'),
    filename: 'index.js',
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FileMangerPlugin({
      onEnd: {
        copy: [{
          source: './src/component',
          destination: './bundle/component'
        }],
        archive: [{
          source: './bundle',
          destination: './bundle/dist.zip'
        }]
      }
    })
  ]
})
