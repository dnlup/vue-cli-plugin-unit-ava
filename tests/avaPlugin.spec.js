const { join, resolve } = require('path')
const { promisify } = require('util')
const { homedir, tmpdir } = require('os')
const { writeFile } = require('fs')
const writeF = promisify(writeFile)
const rimraf = promisify(require('rimraf'))
const isCI = require('is-ci')
const test = require('ava')
const id = require('nanoid/generate')
const create = require('@vue/cli-test-utils/createTestProject')
const ROOT = resolve(__dirname, '../')
const DATA_DIR = tmpdir()
const vuetifyPluginOptions = {
  preset: 'configure',
  replaceComponents: true,
  iconFont: 'mdi',
  installFonts: false,
  locale: 'en',
  useAlaCarte: true,
  useCustomProperties: false,
  usePolyfill: false,
  useTheme: false
}

test.before(async t => {
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
})

test.beforeEach(t => {
  t.context.project = `project_${id('1234567890abcdef', 10)}`
  t.context.path = join(DATA_DIR, t.context.project)
  t.context.cliService = join(
    t.context.path,
    'node_modules',
    '@vue',
    'cli-service',
    'bin',
    'vue-cli-service.js'
  )
})

test.afterEach(async t => {
  await rimraf(t.context.path)
})

async function plugin (t, input = {}) {
  const { plugins = {}, invokeOpts = [] } = input
  const project = await create(t.context.project, {
    plugins
  }, DATA_DIR)
  const opts = invokeOpts.join(' ')
  await project.run(`npm i -D ${ROOT}`)
  await project.run(`vue invoke @dnlup/unit-ava ${opts}`)
  await project.run(`${t.context.cliService} test:unit`)
  t.pass()
}

for (const avaConfigLocation of ['ava.config.js', 'package.json']) {
  // Plain JS setup - not tested since the default app created by @vue/cli is
  // uses export default {} in its HelloWorld.vue compoenent.

  // Babel setup
  test.skip(`Base Plugin + Babel (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No'
    ]
  })
  test.skip(`Base Plugin + Babel + css (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No',
      '--styles css'
    ]
  })
  test.skip(`Base Plugin + Babel + stylus (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No',
      '--styles stylus'
    ]
  })
  test(`Base Plugin + Babel + css + stylus (${avaConfigLocation})`, plugin, {
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
  test.skip(`Base Plugin + Babel + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify'
    ]
  })
  test.skip(`Base Plugin + Babel + css + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify',
      '--styles css'
    ]
  })
  test.skip(`Base Plugin + Babel + stylus + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify',
      '--styles stylus'
    ]
  })
  test(`Base Plugin + Babel + css + stylus + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify',
      '--styles css',
      '--styles stylus'
    ]
  })

  // TypeScript setup
  test.skip(`Base Plugin + TypeScript (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No'
    ]
  })
  test.skip(`Base Plugin + TypeScript + css (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No',
      '--styles css'
    ]
  })
  test.skip(`Base Plugin + TypeScript + stylus (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {}
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework No',
      '--styles stylus'
    ]
  })
  test(`Base Plugin + TypeScript + css + stylus (${avaConfigLocation})`, plugin, {
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
  test.skip(`Base Plugin + TypeScript + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {
        useTsWithBabel: false
      },
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify'
    ]
  })
  test.skip(`Base Plugin + TypeScript + css + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify',
      '--styles css'
    ]
  })
  test.skip(`Base Plugin + TypeScript + stylus + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify',
      '--styles stylus'
    ]
  })
  test(`Base Plugin + TypeScript + css + stylus + Vuetify (${avaConfigLocation})`, plugin, {
    plugins: {
      '@vue/cli-plugin-typescript': {
        useTsWithBabel: false
      },
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify',
      '--styles css',
      '--styles stylus'
    ]
  })
}
