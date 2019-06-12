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
    name: 'loadStyles',
    type: 'list',
    message: 'Do you want to load styles?',
    choices: [
      'No',
      'Yes'
    ],
    default: 'No'
  },
  {
    name: 'styles',
    type: 'checkbox',
    message: 'Which ones?',
    choices: [
      'css',
      'stylus'
    ],
    default: ['css'],
    when: ({ loadStyles }) => loadStyles === 'Yes'
  }
  // {
  //   name: 'cssProcessors',
  //   type: 'list',
  //   message: 'Do you want to use a CSS processor',
  //   choices: [
  //     'No',
  //     'Sass',
  //     'Less',
  //     'Stylus'
  //   ],
  //   default: 'No' // ,
  //   // when: ({ uiFramework }) => uiFramework === 'No'
  // }
]
