import test from 'ava'
import generateWithPlugin from '@vue/cli-test-utils/generateWithPlugin'

test('Base config using `ava.config.js`', async t => {
  const { pkg, files } = await generateWithPlugin({
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: 'ava.config.js'
    }
  })
  t.snapshot(pkg)
  t.snapshot(files)
})

test('Base config using `package.json`', async t => {
  const { pkg, files } = await generateWithPlugin({
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: 'package.json'
    }
  })
  t.snapshot(pkg)
  t.snapshot(files)
})

test('Base config using `Vuetify`', async t => {
  const { pkg, files } = await generateWithPlugin({
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      uiFramework: 'Vuetify'
    }
  })
  t.snapshot(pkg)
  t.snapshot(files)
})

test('TS config using `ava.config.js`', async t => {
  const { pkg, files } = await generateWithPlugin([
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
  t.snapshot(pkg)
  t.snapshot(files)
})

test('TS config using `package.json`', async t => {
  const { pkg, files } = await generateWithPlugin([
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
  t.snapshot(pkg)
  t.snapshot(files)
})

test('TS config using `Vuetify`', async t => {
  const { pkg, files } = await generateWithPlugin([
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
  t.snapshot(pkg)
  t.snapshot(files)
})
