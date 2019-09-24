import { promisify } from 'util'
import test from 'ava'
import rimraf from 'rimraf'
import pluginMacro from '../helpers/plugin'
import context from '../helpers/context'

const rm = promisify(rimraf)
test.beforeEach(t => { t.context = context() })
test.afterEach(async t => { await rm(t.context.path) })

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

for (const avaConfigLocation of ['ava.config.js', 'package.json']) {
  // Babel setup
  test.skip(`babel (${avaConfigLocation})`, pluginMacro, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      'vue-cli-plugin-vuetify': vuetifyPluginOptions
    },
    invokeOpts: [
      `--avaConfigLocation ${avaConfigLocation}`,
      '--uiFramework Vuetify'
    ]
  })
  test.skip(`babel + css (${avaConfigLocation})`, pluginMacro, {
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
  test.skip(`babel + stylus (${avaConfigLocation})`, pluginMacro, {
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
  test(`babel + css + stylus (${avaConfigLocation})`, pluginMacro, {
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

  // Typescript setup
  test.skip(`typescript (${avaConfigLocation})`, pluginMacro, {
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
  test.skip(`typeScript + css (${avaConfigLocation})`, pluginMacro, {
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
  test.skip(`typeScript + stylus (${avaConfigLocation})`, pluginMacro, {
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
  test(`typeScript + css + stylus (${avaConfigLocation})`, pluginMacro, {
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
