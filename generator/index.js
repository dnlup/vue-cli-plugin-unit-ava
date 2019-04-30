/**
 * @module vue-cli-plugin-unit-ava/generator
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-dev.html#generator}
 */
const { promisify } = require('util')
const read = promisify(require('fs').readFile)
const write = promisify(require('fs').writeFile)

/**
 * @external generatorApi
 * @see {@link https://cli.vuejs.org/dev-guide/generator-api.html}
 */

/**
 * Generator function
 * @param  {generatorApi} api
 */
module.exports = (api) => {
  api.render('./template', {
    hasTS: api.hasPlugin('typescript')
  })

  api.extendPackage({
    devDependencies: {
      '@vue/test-utils': '1.0.0-beta.29',
      ava: '^1.4.1'
    },
    scripts: {
      'test:unit': 'vue-cli-service test:unit'
    }
  })

  api.onCreateComplete(async () => {
    const file = api.resolve('.gitignore')
    let content = await read(file, 'UTF8')
    if (!/[\n|\s]*\/dist_tests[\s]*\n/.test(content)) {
      content += '\n# Tests build directory\n/dist_tests\n'
      await write(file, content, 'UTF8')
    }
  })
}
