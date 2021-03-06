import { promisify } from 'util'
import test from 'ava'
import rimraf from 'rimraf'
import pluginMacro from '../helpers/plugin'
import context from '../helpers/context'

const rm = promisify(rimraf)
test.beforeEach(t => { t.context = context() })
test.afterEach(async t => { await rm(t.context.path) })

for (const avaConfigLocation of ['ava.config.js', 'package.json']) {
  test(`babel + css + stylus (${avaConfigLocation})`, pluginMacro, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No',
      '--styles css',
      '--styles stylus'
    ]
  })
  test(`typeScript + css + stylus (${avaConfigLocation})`, pluginMacro, {
    plugins: {
      '@vue/cli-plugin-typescript': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No',
      '--styles css',
      '--styles stylus'
    ]
  })
}
