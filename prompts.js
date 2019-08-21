module.exports = [
  {
    name: 'avaConfigLocation',
    type: 'list',
    message: 'Where do you want to store ava configuration?',
    choices: [
      'ava.config.js',
      'package.json'
    ],
    default: 'ava.config.js'
  },
  {
    name: 'uiFramework',
    type: 'list',
    message: 'Do you want to use a UI Framework?',
    choices: [
      'No',
      'Vuetify'
    ],
    default: 'No'
  },
  {
    name: 'styles',
    type: 'checkbox',
    message: 'Select the type of style files you would like to load, if any',
    choices: [
      'css',
      'stylus'
    ],
    default: []
  }
]
