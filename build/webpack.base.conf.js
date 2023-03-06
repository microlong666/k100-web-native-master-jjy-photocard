const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ComponentConfig = require('../src/component/package.json')
//
console.log('---------------------path', path.resolve(__dirname, '../src/component', ComponentConfig.main))

module.exports = {
  // entry: './src/component/index.js',
  entry: path.resolve(__dirname, '../src/component', ComponentConfig.main),
  output: {
    path: path.resolve(__dirname, '../bundle'),
    filename: 'index.js'
    // libraryTarget: 'umd'
  },
  devtool: 'false',
  resolve: {
  },
  externals: {
    'xtion-web': 'XtWeb'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /bundle/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@vue/cli-plugin-babel/preset']
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }, {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
          // ,
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     sourceMap: false,
          //   }
          // }
        ]
      }, {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader',
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     sourceMap: false
          //   }
          // },
          'less-loader']
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 300000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 300000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 300000,
          name: '[name].[ext]?[hash]'
        }
      }]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
