
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.
// 该文件并不是某个工具的默认配置，这个文件其实是被其他js配置文件直接应用来生效的
const path = require('path')

module.exports = {
  build: {
    // 引入生产环境env
    env: require('./prod.env'),
    // 目标的index
    index: path.resolve(__dirname, '../dist/index.html'),
    // 原生数据目录，目标的目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 处index外文件放置的目录
    assetsSubDirectory: 'static',
    // 用于生成的js和html中引用文件的url前缀
    assetsPublicPath: '/',
    // 是否是生产环境的sourceMap
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 生产环境是否gzip压缩
    productionGzip: false,
    // 生产环境gzip压缩的扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否显示bundle分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    // 开发环境
    env: require('./dev.env'),
    // 开发环境服务器
    port: process.env.PORT || 8080,
    // 是否自动打开浏览器
    autoOpenBrowser: true,
    // 同上
    assetsSubDirectory: 'static',
    // 同上
    assetsPublicPath: '/',
    // 应该是指代理，给proxyMiddleware使用的代理表，用于把一个http请求代理到另外一个地址
    // 例如dev-server开放请求localhost:8080，但是此时后端服务器是localhost:9090
    // 就可以使用这个table来把8080的请求代理到9090
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    // 是否生成cssSourceMap
    cssSourceMap: false
  }
}
