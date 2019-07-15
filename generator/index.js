/**
 * @module vue-cli-plugin-unit-ava/generator
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-dev.html#generator}
 */
const { join } = require('path')
const { stringify } = require('javascript-stringify')
const { devDependencies: injectedPackageDevDeps } = require('../package.json')

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
 * Add a babel list entry avoiding duplicates
 * @param {Array} list - the option list
 * @param {Array} entry - the entry
 * @retun {Array[]}
 */
function addBabeListEntry (list, entry) {
  const index = list.findIndex(i => {
    return Array.isArray(i) ? i[0] === entry[0] : i === entry[0]
  })
  if (index === -1) {
    list.push(entry)
  }
  return list
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
    uiFramework,
    styles
  } = options
  const hasTS = api.hasPlugin('typescript')
  const hasBabel = api.hasPlugin('babel')
  const babelPluginModuleResolver = [
    'module-resolver',
    {
      root: './',
      alias: {
        '@': './src'
      }
    }
  ]
  const injectedAvaConfig = {
    require: [
      './tests/helpers/setup.js'
    ]
  }

  if (hasTS) {
    // Add Typescript configuration to ava
    injectedAvaConfig.compileEnhancements = false
    injectedAvaConfig.files = [
      'tests/unit/**/*.spec.ts'
    ]
    injectedAvaConfig.extensions = [
      'ts'
    ]

    // Inject Typescript dependencies
    api.extendPackage({
      devDependencies: {
        'ts-node': injectedPackageDevDeps['ts-node'],
        'tsconfig-paths': injectedPackageDevDeps['tsconfig-paths']
      }
    })
  } else if (hasBabel) {
    injectedAvaConfig.files = [
      'tests/unit/**/*.spec.js'
    ]
  } else if (!hasBabel) {
    injectedAvaConfig.babel = false
    injectedAvaConfig.compileEnhancements = false
    injectedAvaConfig.files = [
      'tests/unit/**/*.spec.js'
    ]
  }

  // Configure ava
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

  // Configure babel.config.js
  if (!hasTS && hasBabel) {
    api.render(files => {
      let config = {}
      try {
        config = require(join(root, 'babel.config.js'))
      } catch (error) {
        api.exitLog('No `babel.config.js` file found, created a new one.',
          'info')
      }
      config.env = config.env || {}
      config.env.test = config.env.test || {}
      config.env.test.plugins = config.env.test.plugins || []
      config.env.test.presets = config.env.test.presets || []
      config.env.test.presets = addBabeListEntry(config.env.test.presets, [
        '@vue/app',
        {
          targets: {
            node: 'current'
          }
        }
      ])
      config.env.test.plugins = addBabeListEntry(
        config.env.test.plugins,
        babelPluginModuleResolver
      )
      files['babel.config.js'] = api.genJSConfig(config)
    })
    api.extendPackage({
      devDependencies: {
        'require-extension-hooks-babel':
          injectedPackageDevDeps['require-extension-hooks-babel'],
        'babel-plugin-module-resolver':
          injectedPackageDevDeps['babel-plugin-module-resolver']
      }
    })
  }

  // Add style loaders
  if (styles && styles.length) {
    api.extendPackage({
      devDependencies: {
        'css-modules-require-hook':
          injectedPackageDevDeps['css-modules-require-hook']
      }
    })
    if (styles.includes('stylus')) {
      api.extendPackage({
        devDependencies: {
          stylus: injectedPackageDevDeps.stylus
        }
      })
    }
  }

  api.render('./template', {
    hasTS,
    hasBabel,
    uiFramework,
    styles
  })

  api.extendPackage({
    devDependencies: {
      '@vue/test-utils':
        injectedPackageDevDeps['@vue/test-utils'],
      ava:
        injectedPackageDevDeps.ava,
      'browser-env':
        injectedPackageDevDeps['browser-env'],
      'require-extension-hooks':
        injectedPackageDevDeps['require-extension-hooks'],
      'require-extension-hooks-vue':
        injectedPackageDevDeps['require-extension-hooks-vue']
    },
    scripts: {
      'test:unit': 'vue-cli-service test:unit'
    }
  })
}
