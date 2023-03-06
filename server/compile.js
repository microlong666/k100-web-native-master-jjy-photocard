const webpack = require('webpack')
const webpackConfig = require('../build/webpack.dev.conf')
const MemoryFS = require('memory-fs')
const compiler = webpack(webpackConfig)

compiler.outputFileSystem = new MemoryFS()

let indexSource = ''

// compiler.watch({
//   aggregateTimeout: 300,
//   poll: undefined
// }, function (err, stats) {
//   if (err) {
//     console.error('compiler error:::', err);
//     return
//   }
//   if (stats.hasErrors()) {
//     console.error('compiler error:::', stats.toJson().errors);
//   }
//   if (stats.hasWarnings()) {
//     console.error('compiler warning:::', stats.toJson().warnings);
//   }
// });
compiler.hooks.emit.tapAsync('webpack', function (compilation, done) {
  indexSource = compilation.assets['index.js']
  done()
})

module.exports = function () {
  return new Promise(function (resolve, reject) {
    compiler.watch({
      aggregateTimeout: 300
    }, function (err, stats) {
      console.log('compiler run...')
      if (err) {
        console.error('compiler error:::', err)
        reject(err)
        return
      }
      if (stats.hasErrors()) {
        reject(stats.toJson().errors)
        console.error('compiler error:::', stats.toJson().errors)
        return
      }
      if (stats.hasWarnings()) {
        console.error('compiler warning:::', stats.toJson().warnings)
      }
      // console.log('indexSource:::', indexSource)
      console.log('compiler success')
      resolve(indexSource)
    })
  })
}
