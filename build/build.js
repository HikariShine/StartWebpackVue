'use strict'
// 该文件是build即生产环境编译的入口
// 整个文件的中文注释已经有了：(https://segmentfault.com/a/1190000008779053)
// (http://blog.csdn.net/hongchh/article/details/55113751)
// 引入版本检查并执行
require('./check-versions')()

// 配置环境为production
process.env.NODE_ENV = 'production'

// ora用于实现console的loading效果。https://www.npmjs.com/package/ora
const ora = require('ora')
// 跨平台的rm -rf命令
const rm = require('rimraf')
// path模块，相当于PathUtils(http://www.runoob.com/nodejs/nodejs-path-module.html)
const path = require('path')
// chalk 定制控制台日志的输入样式，可以非常的个性化 https://github.com/chalk/chalk
const chalk = require('chalk')
// 没啥说的，webpack核心
const webpack = require('webpack')
// 引入整个build环境的配置
const config = require('../config')
// 因为生产环境配置，用于build
const webpackConfig = require('./webpack.prod.conf')

// spinner旋转器。参数为旋转器的文本
const spinner = ora('building for production...')
// 启动旋转器，如果旋转的过程中需要修改属性，可以使用spinner.color = 'yellow'、spinner.text = 'Loading rainbows'
spinner.start()

// 移除文件夹
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // 移除成功后执行webpack打包
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    // 执行后展示结果，内容包括Hash、Version、Time、Chunks的table信息等。
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
