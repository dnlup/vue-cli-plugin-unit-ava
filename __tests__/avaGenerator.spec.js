import test from 'ava'
import generateWithPlugin from '@vue/cli-test-utils/generateWithPlugin'

test('base', async t => {
  const { pkg, files } = await generateWithPlugin({
    id: 'unit-ava',
    apply: require('../generator'),
    options: {}
  })
  t.snapshot(pkg)
  t.snapshot(files)
})

test('with TS', async t => {
  const { pkg, files } = await generateWithPlugin([
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {}
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
