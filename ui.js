/**
 * @module vue-cli-plugin-unit-ava/ui
 * @see {@link https://cli.vuejs.org/dev-guide/plugin-dev.html#ui-integration}
 */

/**
 * @external uiApi
 * @see {@link https://cli.vuejs.org/dev-guide/ui-api.html}
 */

/**
 * UI integration function
 * @param  {uiAPi} api
 */
module.exports = api => {
  api.describeTask({
    match: /vue-cli-service test:unit/,
    description: 'org.dnlup.ava.tasks.test.description',
    link: 'https://github.com/dnlup/vue-cli-plugin-unit-ava',
    prompts: [
      {
        name: 'watch',
        type: 'confirm',
        default: false,
        description: 'org.dnlup.ava.tasks.test.watch'
      },
      {
        name: 'update',
        type: 'confirm',
        default: false,
        description: 'org.dnlup.ava.tasks.test.update'
      }
    ],
    onBeforeRun: ({ answers, args }) => {
      if (answers.watch) args.push('--watch')
      if (answers.update) args.push('--update-snapshots')
    }
  })
}
