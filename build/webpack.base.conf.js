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
  // 设置模块如何被解析。webpack 提供合理的默认值，但是还是可能会修改一些解析的细节。
  // 关于 resolver 具体如何工作的更多解释说明，请查看模块解析方式。
  resolve: {
    // 自动解析确定的扩展。默认值为：.js,.json。能够使用户在引入模块时不带扩展。
    extensions: ['.js', '.vue', '.json'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 在给定对象的键后的末尾添加 $，以表示精准匹配。下面这个代表/项目根目录/node_modules/vue/dist/vue.esm.js
      'vue$': 'vue/dist/vue.esm.js',
      // 文档里没见，大概是指本项目js的解析目录为src？
      '@': resolve('src'),
    }
    // import等导入时默认使用resolve.modules中指定的目录。
    // 你可以替换初始模块路径，此替换路径通过使用 resolve.alias 配置选项来创建一个别名。
  },
  // module用于加载loader，loader仅仅基于文件进行转换，而插件就没有这个限制。
  // 这个配置文件里没有，插件使用plugins:定义，常用于（但不限于）在打包模块的
  // “compilation” 和 “chunk” 生命周期执行操作和自定义功能（查看更多）。

  // loader支持以下模块方式
  // 对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：
  // ES2015 import 语句
  // CommonJS require() 语句
  // AMD define 和 require 语句
  // css/sass/less 文件中的 @import 语句。
  // 样式(url(...))或 HTML 文件(<img src=...>)中的图片链接(image url)
  module: {
    // rules数组支持配置不同的loader，每个loader都是一个文件处理器
    // loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。
    // 因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。
    // loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。
    // loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！
    // 插件(plugin)可以为 loader 带来更多特性。
    // loader 能够产生额外的任意文件。
    // loader 通过（loader）预处理函数，为 JavaScript 生态系统提供了更多能力。用户现在可以更加灵活地引入细粒度逻辑，例如压缩、打包、语言翻译和其他更多。
    rules: [
      {
        // 判断是否满足loader条件，使用文件名匹配。当匹配时，如果要使用多个loader
        // 可以配置use数组，每个数组都有下面几个属性，如果只有一个，则可以直接展开写，忽略数组
        test: /\.(js|vue)$/,
        // loader配置使用的loader，可以在 import 语句或任何等效于 "import" 的方式中指定 loader。
        // 使用 ! 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。通过前置所有规则及使用 !，可以对应覆盖到配置中的任意 loader。
        // 选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?{"key":"value","foo":"bar"}。
        // loader是Rule.use: [ { loader } ]的简写。多个的时候需要使用use。
        loader: 'eslint-loader',
        // 可能的值有："pre" | "post"，所有 loader 通过 前置, 行内, 普通, 后置 排序，并按此顺序使用。
        enforce: 'pre',
        // =resource.include:包含此文件夹下的文件，参考(https://doc.webpack-china.org/configuration/module/#-)
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
        // 这个的options可以行内化：url-loader?limit=1000&name=img/[name].[hash:7].[ext]
        // 多个loader也可以内联，用!隔开多个loader，加载顺序从右到左
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
