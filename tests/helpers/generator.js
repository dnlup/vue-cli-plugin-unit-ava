import generateWithPlugin from '@vue/cli-test-utils/generateWithPlugin'
import { devDependencies } from '../../package.json'

export default async function (t, input = {}) {
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
  for (const key of packages) {
    pkg.devDependencies[key] &&
    t.is(pkg.devDependencies[key], devDependencies[key])
  }
  t.snapshot(Object.keys(pkg.devDependencies))
  t.snapshot(pkg.scripts)
  const {
    'package.json': pjson,
    ...assets
  } = files
  t.snapshot(assets)
}
