import { resolve, join } from 'path'
import { tmpdir } from 'os'
import id from 'nanoid/generate'

const DATA_DIR = tmpdir()
const ROOT = resolve(__dirname, '../../')

module.exports = () => {
  const project = `project_${id('1234567890abcdef', 10)}`
  const path = join(DATA_DIR, project)
  const cliService = join(
    path,
    'node_modules',
    '@vue',
    'cli-service',
    'bin',
    'vue-cli-service.js'
  )
  return {
    ROOT,
    DATA_DIR,
    project,
    path,
    cliService
  }
}
