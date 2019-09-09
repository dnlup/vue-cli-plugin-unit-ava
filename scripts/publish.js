const inquirer = require('inquirer')
const execa = require('execa')

inquirer.prompt([
  {
    type: 'password',
    name: 'NPM_AUTH_TOKEN',
    message: 'npm token',
    filter (input) {
      return input.trim()
    },
    validate (input, answers) {
      return input && input.length > 0 ? true : 'Cannot be emtpy'
    }
  },
  {
    type: 'password',
    name: 'CONVENTIONAL_GITHUB_RELEASER_TOKEN',
    message: 'GitHub Token (for GitHub Releases)',
    filter (input) {
      return input.trim()
    },
    validate (input, answers) {
      return input && input.length > 0 ? true : 'Cannot be emtpy'
    }
  }
]).then(async answers => {
  const { NPM_AUTH_TOKEN, CONVENTIONAL_GITHUB_RELEASER_TOKEN } = answers
  await execa('npm', ['publish'], {
    env: {
      NPM_AUTH_TOKEN
    }
  })
  await execa('conventional-github-releaser', ['-p', 'angular'], {
    env: {
      CONVENTIONAL_GITHUB_RELEASER_TOKEN
    }
  })
})
