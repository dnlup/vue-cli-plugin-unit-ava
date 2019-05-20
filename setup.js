/**
 * This module should run before ava starts testing.
 * It fixes `Date` not being present in the global scope.
 * @module vue-cli-plugin-unit-ava/setup
 * @see https://github.com/vuejs/vue-test-utils/issues/936
 */
require('browser-env')()
const webpackConfig = require.resolve('@vue/cli-service/webpack.config.js')
const hooks = require('require-extension-hooks')
const Vue = require('vue')

// Fix TypeError from prettier
window.Date = Date

// Setup Vue.js to remove production tip
Vue.config.productionTip = false

// Setup vue files to be processed by `require-extension-hooks-vue`
hooks('vue').plugin('vue').push()
// Setup vue and js files to be processed by `require-extension-hooks-babel`
hooks(['vue', 'js']).exclude(({ filename }) => {
  return filename.match(/\/node_modules\//) || filename.includes(webpackConfig)
}).plugin('babel').push()
