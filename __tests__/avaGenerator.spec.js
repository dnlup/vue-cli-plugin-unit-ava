import test from 'ava'
import generateWithPlugin from '@vue/cli-test-utils/generateWithPlugin'
import { devDependencies } from '../package.json'

async function generator (t, input) {
  const { pkg, files } = await generateWithPlugin(input)
  // Remove all line breaks from file contents to avoid
  // snapshot errors on different platforms.
  for (const id in files) {
    files[id] = files[id].replace(/\r?\n|\r/g, '')
  }
  const packages = [
    '@vue/test-utils',
    'ava',
    'babel-plugin-module-resolver',
    'browser-env',
    'css-modules-require-hook',
    'require-extension-hooks-babel',
    'require-extension-hooks-vue',
    'stylus'
  ]
  for (let key of packages) {
    pkg.devDependencies[key] &&
    t.is(pkg.devDependencies[key], devDependencies[key])
  }
  t.snapshot(pkg.scripts)
  const {
    'package.json': pjson,
    ...assets
  } = files
  t.snapshot(assets)
}

test('Base config using `ava.config.js`', generator, {
  id: 'unit-ava',
  apply: require('../generator'),
  options: {
    avaConfigLocation: 'ava.config.js'
  }
})

test('Base config using `package.json`', generator, {
  id: 'unit-ava',
  apply: require('../generator'),
  options: {
    avaConfigLocation: 'package.json'
  }
})

test('Base config using `Vuetify`', generator, {
  id: 'unit-ava',
  apply: require('../generator'),
  options: {
    uiFramework: 'Vuetify'
  }
})

test('TS config using `ava.config.js`', generator, [
  {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: 'ava.config.js'
    }
  },
  // mock the presence of the ts plugin
  {
    id: 'typescript',
    apply: () => {},
    options: {}
  }
])

test('TS config using `package.json`', generator, [
  {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: 'package.json'
    }
  },
  // mock the presence of the ts plugin
  {
    id: 'typescript',
    apply: () => {},
    options: {}
  }
])

test('TS config using `Vuetify`', generator, [
  {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      uiFramework: 'Vuetify'
    }
  },
  // mock the presence of the ts plugin
  {
    id: 'typescript',
    apply: () => {},
    options: {}
  }
])
