require('browser-env')()
const webpackConfig = require.resolve('@vue/cli-service/webpack.config.js')
const hooks = require('require-extension-hooks')
const css = require('css-modules-require-hook')
const Vue = require('vue')
<%_ if (uiFramework === 'Vuetify') { _%>
const Vuetify = require('vuetify')
const stylus = require('stylus')
<%_ } _%>
<%_ if (hasTS) { _%>
const tsNode = require('ts-node')

const ts = tsNode.register({
  compilerOptions: {
    /**
     * @see https://github.com/TypeStrong/ts-node/issues/313#issuecomment-343698812
     * @type {String}
     */
    module: 'commonjs'
  },
  transpileOnly: true
})
<%_ } _%>

// Fix TypeError from prettier
window.Date = Date

// Setup Vue.js to remove production tip
Vue.config.productionTip = false

<%_ if (hasTS) { _%>
hooks('ts').push(({filename, content}) => {
  content = ts.compile(content, filename)
  return {
     content,
     filename
  }
})

require('tsconfig-paths/register')
<%_ } _%>

// Setup vue files to be processed by `require-extension-hooks-vue`
hooks('vue').plugin('vue').push()
<%_ if (!hasTS) { _%>
// Setup vue and js files to be processed by `require-extension-hooks-babel`
hooks(['vue', 'js']).exclude(({ filename }) => {
  return filename.match(/\/node_modules\//) ||
    filename.includes(webpackConfig) ||
    filename.includes('vue.config.js') ||
    filename.match(/helpers\/setup\.js/)
}).plugin('babel').push()
<%_ } _%>

// Setup css to be processed by `css-require-extension-hook`
css({})

// Setup mocking of static assets
hooks([
  '.png',
  '.jpg',
  '.jpeg',
  '.woff',
  '.ico',
  '.ico',
  '.svg'
]).push(() => '')

<%_ if (uiFramework === 'Vuetify') { _%>
// Setup styl files to be processed by `css-require-extension-hook`
css({
  extensions: ['.styl'],
  preprocessCss: (css, filename) => {
    return stylus(css).set('filename', filename).render()
  }
})

require('vuetify/src/stylus/app.styl')

Vue.use(Vuetify, {
  iconfont: 'md'
})
<%_ } _%>
