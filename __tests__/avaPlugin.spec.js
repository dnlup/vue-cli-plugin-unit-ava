const { join, resolve } = require('path')
const { promisify } = require('util')
const { homedir } = require('os')
const { mkdir, writeFile } = require('fs')
const mkd = promisify(mkdir)
const writeF = promisify(writeFile)
const rimraf = promisify(require('rimraf'))
const test = require('ava')
const id = require('nanoid/generate')
const create = require('@vue/cli-test-utils/createTestProject')
const { version: VERSION } = require('../package.json')
const isCI = require('is-ci')
const ROOT = resolve(__dirname, '../')
const DATA_DIR = join(__dirname, '.data')

async function plugin (t, input = {}, expected) {
  const { plugins = {}, invokeOpts = [] } = input
  const project = await create(t.context.project, {
    plugins
  }, DATA_DIR)
  const opts = invokeOpts.join(' ')
  await project.run(`npm pack ${ROOT}`)
  await project.run(`npm i -D ${join(t.context.path, t.context.packed)}`)
  await project.run(`vue invoke @dnlup/unit-ava ${opts}`)
  await project.run(`${t.context.cliService} test:unit`)
  t.pass()
}

test.before(async t => {
  try {
    await mkd(DATA_DIR)
    // If in a CI env manually set user preference to use npm
    // in order to avoid yarn errors when installing
    // see https://github.com/yarnpkg/yarn/issues/2629
    if (isCI) {
      const data = {
        useTaobaoRegistry: false,
        latestVersion: '3.7.0',
        lastChecked: 1556454509806,
        packageManager: 'npm',
        presets: {}
      }
      const file = join(homedir(), '.vuerc')
      await writeF(file, JSON.stringify(data), 'utf8')
    }
  } catch (error) {}
})

test.beforeEach(t => {
  t.context.project = `project_${id('1234567890abcdef', 10)}`
  t.context.path = join(DATA_DIR, t.context.project)
  t.context.cliService = join(t.context.path, 'node_modules',
    '@vue', 'cli-service', 'bin', 'vue-cli-service.js')
  t.context.packed = `dnlup-vue-cli-plugin-unit-ava-${VERSION}.tgz`
})

test.afterEach(async t => {
  await rimraf(t.context.path)
})

test('Base Plugin works (ava.config.js)', plugin, {
  invokeOpts: [
    '--avaConfigLocation ava.config.js',
    '--uiFramework No'
  ]
})

test('Base Plugin works (package.json)', plugin, {
  invokeOpts: [
    '--avaConfigLocation package.json',
    '--uiFramework No'
  ]
})

test('Plugin works with Vuetify (ava.config.js)', plugin, {
  plugins: {
    vuetify: {}
  },
  invokeOpts: [
    '--avaConfigLocation package.json',
    '--uiFramework Vuetify'
  ]
})

test('Plugin works with TS (ava.config.js)', plugin, {
  plugins: {
    '@vue/cli-plugin-typescript': {}
  },
  invokeOpts: [
    '--avaConfigLocation ava.config.js',
    '--uiFramework No'
  ]
})

test('Plugin works with TS (package.json)', plugin, {
  plugins: {
    '@vue/cli-plugin-typescript': {}
  },
  invokeOpts: [
    '--avaConfigLocation package.json',
    '--uiFramework No'
  ]
})

test('Plugin works with TS + Vuetify (ava.config.js)', plugin, {
  plugins: {
    '@vue/cli-plugin-typescript': {},
    vuetify: {}
  },
  invokeOpts: [
    '--avaConfigLocation ava.config.js',
    '--uiFramework Vuetify'
  ]
})
