const inquirer = require('inquirer')
const execa = require('execa')

;(async () => {
  let code = 0
  try {
    const { NPM_OTP, CONVENTIONAL_GITHUB_RELEASER_TOKEN } = await inquirer.prompt([
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
      },
      {
        type: 'password',
        name: 'NPM_OTP',
        message: 'npm OTP code',
        filter (input) {
          return input.trim()
        },
        validate (input, answers) {
          return input && input.length > 0 ? true : 'Cannot be emtpy'
        }
      }
    ])

    await execa('npm', ['publish', '--otp', NPM_OTP])
    await execa('conventional-github-releaser', [
      '-p', 'angular', '-t', CONVENTIONAL_GITHUB_RELEASER_TOKEN
    ])
  } catch (error) {
    code = 1
    console.error(error)
  } finally {
    process.exit(code)
  }
})()
