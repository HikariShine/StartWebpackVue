'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
// 加载vue loader的config
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// 占位符标志[]，支持的占位符有https://doc.webpack-china.org/configuration/output#output-filename
module.exports = {
  // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  // 默认使用当前目录，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(current working directory - 当前执行路径)。
  context: __dirname,
  // https://doc.webpack-china.org/concepts/entry-points
  // 如果传入一个字符串或字符串数组，chunk 会被命名为 main。如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。
  entry: {
    // 为什么指定为./src/main.js？可能是因为这个路径是以package.json为base路径获取的
    // 下面的其他的都是以这个目录为路径获取的，使用上面那个resolve方法。
    // 根据官方文档，看起来好像是从这个文件入口开始查找所有文件，查找的依据是require()/import 语句导入的文件
    // 即通过入口文件，分析require()/import(https://doc.webpack-china.org/api/module-methods)，生成应用程序所有依赖的关系图(dependency graph)。
    app: './src/main.js'
    // 还有常见的另外一种应用，单页应用时分离自身业务代码和其他提供者代码
    // 如加一个'vendor':['vue','vue-router','axios','vue-moment']
    // 就是把vue,vue-router,axios,vue-moment单独提取出来作为一个bundle，如果app中有依赖vendor的，则插入vendor的js
    // 既即使这里配置的有多个bundle，只要他们之间有依赖关系，还是会被解析出来的
  },
  // https://doc.webpack-china.org/concepts/output
  // 特别注意一个概念:bundle。webpack打包后是以bundle为块分割的
  // 比如说entry配置多入口，那么每个入口的依赖最终打包后都是一个bundle，同时插件或者代码拆分也会生成新bundle
  // 比如那些分离css和html的插件，会为css和html都生成一个bundle
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  // module用于加载loader，loader仅仅基于文件进行转换，而插件就没有这个限制。
  // 这个配置文件里没有，插件使用plugins:定义，常用于（但不限于）在打包模块的
  // “compilation” 和 “chunk” 生命周期执行操作和自定义功能（查看更多）。
  module: {
    // rules数组支持配置不同的loader，每个loader都是一个文件处理器
    // loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。
    // 因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。
    // loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。
    // loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！
    rules: [
      {
        // 判断是否满足loader条件，使用文件名匹配。当匹配时，如果要使用多个loader
        // 可以配置use数组，每个数组都有下面几个属性，如果只有一个，则可以直接展开写，忽略数组
        test: /\.(js|vue)$/,
        // loader配置使用的loader，可以在 import 语句或任何等效于 "import" 的方式中指定 loader。
        // 使用 ! 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。通过前置所有规则及使用 !，可以对应覆盖到配置中的任意 loader。
        // 选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?{"key":"value","foo":"bar"}。
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
