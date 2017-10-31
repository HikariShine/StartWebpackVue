'use strict'
// 该文件用于检查环境版本。npm依赖的排行https://www.npmjs.com/browse/depended
// chalk 定制控制台日志的输入样式，可以非常的个性化 https://github.com/chalk/chalk
const chalk = require('chalk')
// 语义化版本的实现，npm维护，npm也是使用此库解析版本。参考(http://semver.org/lang/zh-CN/)
// (https://zhuanlan.zhihu.com/p/20747196) (https://docs.npmjs.com/misc/semver)
const semver = require('semver')
// 取packageConfig。
const packageConfig = require('../package.json')
// node执行系统脚本可以通过 child_process 模块新建子进程，从而执行 Unix 系统命令。
// var exec = require('child_process').exec;
// var child = exec('echo hello ' + name, function(err, stdout, stderr) {
//  if (err) throw err;
//  console.log(stdout);
//});
// shelljs 模块重新包装了 child_process，调用系统命令更加方便。参考(http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)
const shell = require('shelljs')
// 同步执行命令并获取命令结果
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
]

// which使用path路径查找which的参数，即查找某个命令的实体路径
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    // 使用semver判断版本是否匹配
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    // 使用chalk定制console颜色
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
