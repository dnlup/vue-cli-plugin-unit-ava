/**
 * @module vue-cli-plugin-unit-ava/generator
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-dev.html#generator}
 */
const { join } = require('path')
// const webpackConfig = require.resolve('@vue/cli-service/webpack.config.js')
const { stringify } = require('javascript-stringify')

/**
 * @external GeneratorApi
 * @see {@link https://cli.vuejs.org/dev-guide/generator-api.html}
 */

/**
 * @param  {*} value
 * @return {String}
 */
function stringifyJS (value) {
  return stringify(value, (val, indent, stringify) => {
    if (val && val.__expression) {
      return val.__expression
    }
    return stringify(val)
  }, 2)
}

/**
 * Add a babel plugin avoiding duplicates
 * @param {Array[]} plugins
 * @param {Array} plugin
 * @retun {Array[]}
 */
function addBabelPlugin (plugins, plugin) {
  const index = plugins.findIndex(p => p[0] === plugin[0])
  if (index === -1) {
    plugins.push(plugin)
  }
  return plugins
}

/**
 * @param  {*} entity
 * @return {Array}
 */
function toArray (entity) {
  let array = entity || []
  if (!Array.isArray(array)) {
    array = [array]
  }
  return array
}

/**
 * Merge ava config objects, modifying the first (left) one.
 * @param  {Object} [left={}]
 * @param  {Object} [right={}]
 * @return {Object} the modified config object
 */
function mergeAvaConfig (left = {}, right = {}) {
  for (const key of ['files', 'require', 'extensions']) {
    left[key] = toArray(left[key])
    right[key] = toArray(right[key])
    left[key] = [
      ...new Set([
        ...left[key],
        ...right[key]
      ])
    ]
  }
  left.babel = {
    ...left.babel,
    ...right.babel
  }
  return left
}

/**
 * Generator function
 * @param  {GeneratorApi} api
 * @param  {Object} options - user options from config prompts
 */
module.exports = (api, options) => {
  const root = api.resolve('')
  const {
    avaConfigLocation,
    uiFramework
  } = options
  const hasTS = api.hasPlugin('typescript')
  // const webpackConfigRelative = `./${relative(root, webpackConfig)}`
  const babelPluginAlias = [
    'babel-plugin-webpack-alias-7',
    {
      config: './node_modules/@vue/cli-service/webpack.config.js'
    }
  ]
  const injectedAvaConfig = {
    require: [
      './tests/helpers/setup.js'
    ]
  }

  if (hasTS) {
    injectedAvaConfig.compileEnhancements = false
    injectedAvaConfig.files = [
      'tests/unit/**/*.spec.ts'
    ]
    injectedAvaConfig.extensions = [
      'ts'
    ]
  } else {
    injectedAvaConfig.files = [
      'tests/unit/**/*.spec.js'
    ]
  }

  api.render(files => {
    if (avaConfigLocation === 'ava.config.js') {
      const pack = JSON.parse(files['package.json'] || '{}')
      if (pack.ava) {
        api.exitLog('AVA is already configured in package.json', 'error')
        return
      }
      // TODO: find a way to do not override the configuration.
      // Now it is a problem because the `ava.config.js` file
      // uses ES6 modules syntax.
      files['ava.config.js'] = `export default ${stringifyJS(
        injectedAvaConfig)}`
    } else {
      const avaConfigJs = files['ava.config.js']
      if (avaConfigJs) {
        api.exitLog('AVA is already configured in ava.config.js', 'error')
        return
      }
      const pack = JSON.parse(files['package.json'] || '{}')
      const { ava: config } = pack
      const generated = mergeAvaConfig(config, injectedAvaConfig)
      api.extendPackage({
        ava: generated
      }, { merge: false })
    }
  })

  // Configure Babel
  // The babel-webpack-alias-plugin should work
  // if adding it to the ava babel testOptions and
  // it would be the cleanest solution, but somehow it's not
  // working. It works only if it's added in babel.config.js
  // TODO: investigate why the plugin does not work when added
  //       ava babel config options
  if (!hasTS) {
    api.render(files => {
      let config = {}
      try {
        config = require(join(root, 'babel.config.js'))
      } catch (error) {
        api.exitLog('No `babel.config.js` file found, created a new one.', 'info')
      }
      config.env = config.env || {}
      config.env.test = config.env.test || {}
      config.env.test.plugins = config.env.test.plugins || []
      config.env.test.plugins = addBabelPlugin(
        config.env.test.plugins,
        babelPluginAlias
      )
      files['babel.config.js'] = api.genJSConfig(config)
    })
    api.extendPackage({
      devDependencies: {
        'require-extension-hooks-babel': '^1.0.0-beta.1',
        'babel-plugin-webpack-alias-7': '^0.1.1'
      }
    })
  }

  // Add Typescript dependencies
  if (hasTS) {
    api.extendPackage({
      devDependencies: {
        'ts-node': '^8.1.0',
        'tsconfig-paths': '^3.8.0'
      }
    })
  }

  // Add UI Frameowrk specific dependencies
  switch (uiFramework) {
    case 'Vuetify':
      api.extendPackage({
        devDependencies: {
          stylus: '^0.54.5'
        }
      })
  }

  api.render('./template', {
    hasTS,
    uiFramework
  })

  api.extendPackage({
    devDependencies: {
      '@vue/test-utils': '1.0.0-beta.29',
      ava: '^1.4.1',
      'browser-env': '^3.2.6',
      'require-extension-hooks': '^0.3.3',
      'require-extension-hooks-vue': '^3.0.0',
      'css-modules-require-hook': '^4.2.3'
    },
    scripts: {
      'test:unit': 'vue-cli-service test:unit'
    }
  })
}
