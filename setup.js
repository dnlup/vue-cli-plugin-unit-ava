/**
 * This module should run before ava starts testing.
 * It fixes `Date` not being present in the global scope.
 * @module vue-cli-plugin-unit-ava/setup
 * @see https://github.com/vuejs/vue-test-utils/issues/936
 */
require('jsdom-global')(undefined, { pretendToBeVisual: true, url: 'http://localhost' })

// Setting `performance` as global until 'https://github.com/vuejs/vue/commit/653c74e64e5ccd66cda94c77577984f8afa8386d' is merged.
// Otherwise this error will pop up:
//    https://github.com/vuejs/vue/issues/9698
global.performance = window.performance

window.Date = Date
