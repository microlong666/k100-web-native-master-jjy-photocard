const webpack = require('webpack')
const webpackConfig = require('../build/webpack.dev.conf')
const MemoryFS = require('memory-fs')
const compiler = webpack(webpackConfig)

compiler.outputFileSystem = new MemoryFS()

// compiler.hooks.emit.tapAsync('webpack', function (compilation, done) {
//   indexSource = compilation.assets['index.js']
//   done();
// });

class Task {
  constructor () {
    this.indexSource = ''
    this.watchFn = null

    compiler.hooks.emit.tapAsync('webpack', (compilation, done) => {
      this.indexSource = compilation.assets['index.js'].source()
      done()
    })
  }

  watch () {
    compiler.watch({
      aggregateTimeout: 300
    }, (err, stats) => {
      if (err) {
        console.error('compiler error:::', err)
        return this.emit(err, null)
      }
      if (stats.hasErrors()) {
        return this.emit(stats.toJson().errors)
      }
      if (stats.hasWarnings()) {
        console.error('compiler warning:::', stats.toJson().warnings)
      }
      return this.emit(null, this.indexSource)
    })
  }

  compile (callback) {
    compiler.run((err, stats) => {
      if (err) {
        console.error('compiler error:::', err)
        callback && callback(null)
        return this.emit(err, null)
      }
      if (stats.hasErrors()) {
        callback && callback(null)
        return this.emit(stats.toJson().errors)
      }
      if (stats.hasWarnings()) {
        console.error('compiler warning:::', stats.toJson().warnings)
      }
      callback && callback(this.indexSource)
      return this.emit(null, this.indexSource)
    })
  }

  onWatch (watchFn) {
    this.watchFn = watchFn
  }

  emit (err, stats) {
    this.watchFn && this.watchFn(err, stats)
  }
}

module.exports = Task
