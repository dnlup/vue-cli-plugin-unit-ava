const { join, resolve } = require('path')
const { promisify } = require('util')
const mkdir = promisify(require('fs').mkdir)
const rimraf = promisify(require('rimraf'))
const test = require('ava')
const id = require('nanoid/generate')
const create = require('@vue/cli-test-utils/createTestProject')
const { version: VERSION } = require('../package.json')

const ROOT = resolve(__dirname, '../')
const DATA_DIR = join(__dirname, '.data')

async function plugin (t, input = {}, expected = 0) {
  const { plugins = {}, invokeOpts = [] } = input
  const project = await create(t.context.project, {
    plugins
  }, DATA_DIR)
  const opts = invokeOpts.join(' ')
  await project.run(`npm pack ${ROOT}`)
  await project.run(`npm i -D ${join(t.context.path, t.context.packed)}`)
  await project.run(`vue invoke @dnlup/unit-ava ${opts}`)
  await project.run(`${t.context.cliService} test:unit`)
  const audit = await project.run(`npm audit`)
  t.is(expected, audit.code)
}

test.before(async t => {
  try {
    await mkdir(DATA_DIR)
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
