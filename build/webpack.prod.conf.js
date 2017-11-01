'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// 合并配置文件用
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')


// 此模式是环境分离到不同文件的模式，通过merge合并配置。还可以单文件配置环境，如下：
//-module.exports = {
//+module.exports = function(env, argv) {
//+  return {
//+    devtool: env.production ? 'source-maps' : 'eval',
//     plugins: [
//       new webpack.optimize.UglifyJsPlugin({
//+        compress: argv['optimize-minimize'] // 只有传入 -p 或 --optimize-minimize
//       })
//     ]
//+  };
//};

// 这个process.env.NODE_ENV可以通过启动时配置，针对多平台，一般使用cross-env NODE_ENV=xxx 其他正常命令形式配置。
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

// 合并base config和生产环境config
// 详细配置参考(https://doc.webpack-china.org/configuration/)
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      // 是否生成sourceMap，sourceMap参考(http://www.cnblogs.com/fsjohnhuang/p/4208566.html)
      // (http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
      // 当浏览器调试时，会尝试加载与原js或者css同目录下的[name].[ext].map文件。其实是通过原文件最后一行注释指定的
      // //# sourceMappingURL=app.664d19f170bfff555efb.js.map
      // Source Maps不仅仅是一个.map后缀的文件，而是由浏览器、.map文件生成器和.map文件组成的一套技术方案
      sourceMap: config.build.productionSourceMap,
      // 代表把style提取到单独的文件中，使用ExtractTextPlugin插件执行此操作。
      extract: true
    })
  },
  // 使用何种devtool开发工具，默认为被浏览器广泛支持的#source-map方式
  // (https://doc.webpack-china.org/configuration/devtool/)
  // 如果使用uglifyjs-webpack-plugin插件必须为这个插件提供sourceMap: true来提供source-map
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  // 插件是 wepback 的支柱功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上。
  // 插件目的在于解决 loader 无法实现的其他事。
  // webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用
  // 并且 compiler 对象可在整个编译生命周期访问。
  // function ConsoleLogOnBuildWebpackPlugin() {};
  // ConsoleLogOnBuildWebpackPlugin.prototype.apply = function(compiler) {
    // compiler.plugin('run', function(compiler, callback) {
      // console.log("webpack 构建过程开始！！！");
      // callback();
    // });
  // };
  // https://doc.webpack-china.org/plugins
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入 new 实例。
    // DefinePlugin插件http://blog.csdn.net/sinat_17775997/article/details/70140322
    // 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
    // 比如,你可能会用一个全局的常量来决定 log 在开发模式触发而不是发布模式。
    // 这仅仅是 DefinePlugin 提供的便利的一个场景。(http://www.css88.com/doc/webpack2/plugins/define-plugin/)
    // 这个插件用来定义全局变量，在webpack打包的时候会对这些变量做替换。
    // 这个其实是个文本替换模块，会把'process.env'替换成env的内容。
    // 其中可以定义字符串，对象等。此插件是直接把目标的内容替换成自己的value值，所以String类型需要多加一个引号。
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    // 丑化js插件，即minimal js。(http://www.css88.com/doc/webpack2/plugins/uglifyjs-webpack-plugin/)
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    // 从bundle和中提取文本（CSS）到单独的文件，这个是提取整个文本中特定字符的，将js中引入的css分离的插件。还有个对应的loader，是整个文件提取的。
    // 与loader：ExtractTextPlugin.extract结合使用时，这里是输出的文件路径
    // (https://github.com/webpack-contrib/extract-text-webpack-plugin)
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 默认情况下，webpack打包出来的其实是个js文件，HtmlWebpackPlugin插件的作用是根据插件配置
    // 自动生成一个html文件，这个文件中引用了webpack打包出来的js文件
    // 详细参考如下：(https://segmentfault.com/a/1190000007294861)
    new HtmlWebpackPlugin({
      // 最后生成的文件路径
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      // 模板文件
      template: 'index.html',
      // 生成的js插入到模板的哪一部分，true为body的末尾。body同true、head放head、false不插入js，只生成html。
      inject: true,
      // 最小化配置
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 生成多个js时引用他们的顺序。这里配置的是使用依赖顺序。
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
    // (https://doc.webpack-china.org/plugins/hashed-module-ids-plugin/)
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    // CommonsChunkPlugin 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，
    // 这个文件包括多个入口 chunk 的公共模块。通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，
    // 便存起来到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，
    // 而不是每次访问一个新页面时，再去加载一个更大的文件。
    // 这里只是为了分离vendor到单独的文件。类似于entry配置中的多个output
    // (https://doc.webpack-china.org/plugins/commons-chunk-plugin)
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        // 声明公共的模块来自node_modules文件夹。所有该文件夹下的js都被作为vendor抽离。
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 上面虽然已经分离了第三方库,但是每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。
    // 原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。
    // 当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。
    // vendor变化会导致其hash值变化。
    // 下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
    // 经过编译尝试，修改业务代码后，manifest文件hash改变，vendor没有改变。
    // 打开mainfest文件发现其中包含了文件名，动态加载js时引入了其他生成的js，所以才会导致文件改变
    // 下面这个配置就是把那一部分抽离到manifest文件中的。
    // 至于是如何生效的，全靠name，manifest是内置的name，只要name叫这个，且webpack config的entry中没有这个名字
    // 就会单独抽离webpack bootstrap逻辑到单独的文件中。
    // To extract the webpack bootstrap logic into a separate file, use the CommonsChunkPlugin on a name which is not defined as entry
    // Commonly the name manifest is used. See the caching guide for details.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    // 将static文件夹里面的静态资源复制到dist/static
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  // gzip压缩插件，没啥说的，一般不适用，因为服务器层已经做了，没必要多次压缩
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  // bundle分析器，打包过程分析
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
