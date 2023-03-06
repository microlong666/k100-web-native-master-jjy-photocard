const baseConfig = require('./webpack.base.conf')
const { smart } = require('webpack-merge')

module.exports = smart(baseConfig, {
  mode: 'development',
  plugins: [
  ]
})
