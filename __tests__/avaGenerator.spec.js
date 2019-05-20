import test from 'ava'
import generateWithPlugin from '@vue/cli-test-utils/generateWithPlugin'

async function generator (t, input) {
  const { pkg, files } = await generateWithPlugin(input)
  // Remove all line breaks from file contents to avoid
  // snapshot errors on different platforms.
  for (const id in files) {
    files[id] = files[id].replace(/\r?\n|\r/g, '')
  }
  t.snapshot(pkg)
  t.snapshot(files)
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
