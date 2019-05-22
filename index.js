/**
 * Service plugin that allows running unit tests with `ava`.
 * @module vue-cli-plugin-unit-ava
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-dev.html#service-plugin}
 */
const {
  execa
} = require('@vue/cli-shared-utils')

/**
 * @external pluginApi
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-api.html}
 */

/**
 * vue-cli plugin setup function.
 * @param  {pluginApi} api
 */
module.exports = (api, options) => {
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
    return new Promise((resolve, reject) => {
      const child = execa('ava', rawArgs, { stdio: 'inherit' })
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
