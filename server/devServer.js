const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.dev.conf')
const MemoryFS = require('memory-fs')
const compiler = webpack(webpackConfig)
const path = require('path')

compiler.outputFileSystem = new MemoryFS()

const server = new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, '../bundle'),
  compress: true,
  stats: { colors: true },
  hot: true,
  inline: true
})

/* eslint-disable no-unused-vars */
let indexSource = ''

compiler.hooks.emit.tapAsync('webpack', function (compilation, done) {
  indexSource = compilation.assets['index.js']
  server.sockWrite(server.sockets, 'content')
  done()
})

server.listen(9090, function () {
  console.log(`WebpackDevServer is running at 9090`)
})
