/**
 * Service plugin that allows running unit tests with `ava`.
 * It injects the command `test:unit` which launches a `webpack` build on files , then
 * runs `ava` against the generated files. The generated files are saved in the `dist_tests` directory
 * in the project following the same directory structure of the original ones,
 * also a custom `webpack` plugin to rewrite source maps is added to adjust
 * the `sources` field to have the test file as the first element to allow `ava`
 * to properly compute the destination path to save snaphots.
 *
 * The plugin will look for files with extension:
 * * `*.spec.ts` if the project is using typescript
 * * `*.spec.js` otherwise
 * recursively in the `tests/unit` folder, if no files, directories or glob expressions are passed from the command line.
 * @module vue-cli-plugin-unit-ava
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-dev.html#service-plugin}
 */

const { basename, dirname, join, relative } = require('path')
const { promisify } = require('util')
const glob = require('glob')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const rimraf = promisify(require('rimraf'))
const {
  execa,
  logWithSpinner,
  stopSpinner
} = require('@vue/cli-shared-utils')
const RewriteSourceMap = require('./webpack')

/**
 * @external pluginApi
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-api.html}
 */

/**
 * vue-cli plugin setup function.
 * @param  {pluginApi} api
 */
module.exports = api => {
  /**
   * These are the devtools supported
   * @type {Array}
   * @see https://webpack.js.org/configuration/devtool/
   */
  const devtools = [
    'source-map',
    'inline-cheap-module-source-map'
  ]

  if (process.env.NODE_ENV === 'test') {
    api.chainWebpack(webpackConfig => {
      webpackConfig.merge({
        target: 'node',
        devtool: devtools[1],
        externals: [nodeExternals()]
      })
      // when target === 'node', vue-loader will attempt to generate
      // SSR-optimized code. We need to turn that off here.
      webpackConfig.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options.optimizeSSR = false
          return options
        })

      webpackConfig.plugin('js').use(RewriteSourceMap)
    })
  }

  api.registerCommand('test:unit', {
    description: 'run unit tests with ava',
    usage: 'vue-cli-service test:unit [options] [<file|directory|glob> ...]',
    options: {
      '--watch, -w': 'Re-run tests when tests and source files change',
      '--match, -m': 'Only run tests with matching title (Can be repeated)',
      '--update-snapshots, -u': 'Update snapshots',
      '--fail-fast': 'Stop after first test failure',
      '--timeout, -T': 'Set global timeout',
      '--serial, -s': 'Run tests serially',
      '--concurrency, -c': 'Max number of test files running at the same time (Default: CPU cores)',
      '--verbose, -v': 'Enable verbose output',
      '--tap, -t': 'Generate TAP output',
      '--color': 'Force color output',
      '--no-color': 'Disable color output'
    },
    details: `See
  * https://github.com/avajs/ava
  * https://github.com/avajs/ava/blob/master/docs/05-command-line.md`
  }, async (args, rawArgs) => {
    logWithSpinner(`Building tests...`)
    const webpackConfig = require('@vue/cli-service/webpack.config.js')

    delete webpackConfig.entry.app

    let patterns = []
    let entries = []
    let cliArgs = []
    if (args._ && args._.length) {
      patterns = args._.map(p => `./${relative(process.cwd(), p)}`)
      // remove glob and files from cli args
      cliArgs = rawArgs.filter(rawArg => args._.indexOf(rawArg) === -1)
    } else {
      patterns = api.hasPlugin('typescript') ? ['./tests/unit/**/*.spec.ts'] : ['./tests/unit/**/*.spec.js']
      cliArgs = rawArgs
    }

    // const entries = glob.sync(pattern)
    for (const pattern of patterns) {
      entries = entries.concat(glob.sync(pattern))
    }

    for (let i = 0; i < entries.length; i++) {
      const testFilePath = join(dirname(entries[i]), basename(entries[i], '.js'))
      // Every key of entry is a file path, this way webpack will
      // generate the full directory structure when saving the generated file
      webpackConfig.entry[testFilePath] = entries[i]
    }

    webpackConfig.output = {
      path: join(api.resolve(''), 'dist_tests'),
      filename: '[name].js',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]'
    }

    await rimraf(webpackConfig.output.path)

    // for @vue/babel-preset-app
    process.env.VUE_CLI_BABEL_TARGET_NODE = true

    const compiler = webpack(webpackConfig)

    const run = promisify(compiler.run).bind(compiler)

    if (args.watch) {
      // promisify does not work with `watch`
      await new Promise((resolve, reject) => {
        compiler.watch({}, (error, stats) => {
          return error ? reject(error) : resolve(stats)
        })
      })
    } else {
      await run()
    }

    stopSpinner()

    return new Promise((resolve, reject) => {
      const child = execa('ava', cliArgs, { stdio: 'inherit' })
      child.on('error', reject)
      child.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`ava exited with code ${code}`))
        } else {
          resolve()
        }
      })
    })
  })
}

/**
 * Plugin default modes
 * @type {Object}
 */
module.exports.defaultModes = {
  'test:unit': 'test'
}
