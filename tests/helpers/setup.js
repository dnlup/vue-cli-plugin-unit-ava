import { promisify } from 'util'
import { homedir } from 'os'
import { writeFile } from 'fs'
import { join } from 'path'
import isCI from 'is-ci'

(async () => {
  // If in a CI env manually set user preference to use npm
  // in order to avoid yarn errors when installing
  // see https://github.com/yarnpkg/yarn/issues/2629
  if (isCI) {
    const data = {
      useTaobaoRegistry: false,
      latestVersion: '3.7.0',
      lastChecked: 1556454509806,
      packageManager: 'npm',
      presets: {}
    }
    const file = join(homedir(), '.vuerc')
    await promisify(writeFile)(file, JSON.stringify(data), 'utf8')
  }
})()
