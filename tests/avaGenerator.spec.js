import test from 'ava'
import generateWithPlugin from '@vue/cli-test-utils/generateWithPlugin'
import { devDependencies } from '../package.json'

async function generator (t, input) {
  const { pkg, files } = await generateWithPlugin(input)
  // Remove all line breaks from file contents to avoid
  // snapshot errors on different platforms.
  for (const id in files) {
    files[id] = files[id].replace(/\r?\n|\r/g, '')
  }
  const packages = [
    '@vue/test-utils',
    'ava',
    'babel-plugin-module-resolver',
    'browser-env',
    'css-modules-require-hook',
    'require-extension-hooks-babel',
    'require-extension-hooks-vue',
    'stylus'
  ]
  for (let key of packages) {
    pkg.devDependencies[key] &&
    t.is(pkg.devDependencies[key], devDependencies[key])
  }
  t.snapshot(Object.keys(pkg.devDependencies))
  t.snapshot(pkg.scripts)
  const {
    'package.json': pjson,
    ...assets
  } = files
  t.snapshot(assets)
}

for (const avaConfigLocation of ['package.json', 'ava.config.js']) {
  // Plain JS setup
  test(`Base Generator (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation
    }
  })
  test(`Base Generator + css (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      styles: ['css']
    }
  })
  test(`Base Generator + stylus (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      styles: ['stylus']
    }
  })
  test(`Base Generator + css + stylus (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      styles: ['css', 'stylus']
    }
  })
  test(`Base Generator + Veuetify (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      uiFramework: 'Vuetify'
    }
  })
  test(`Base Generator + Vuetify + css (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      uiFramework: 'Vuetify',
      styles: ['css']
    }
  })
  test(`Base Generator + Vuetify + stylus (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      uiFramework: 'Vuetify',
      styles: ['stylus']
    }
  })
  test(`Base Generator + Vuetify + css + stylus (${avaConfigLocation})`, generator, {
    id: 'unit-ava',
    apply: require('../generator'),
    options: {
      avaConfigLocation: avaConfigLocation,
      uiFramework: 'Vuetify',
      styles: ['css', 'stylus']
    }
  })

  // Babel setup
  test(`Base Generator + Babel (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation
      }
    }
  ])
  test(`Base Generator + Babel + css (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css']
      }
    }
  ])
  test(`Base Generator + Babel + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['stylus']
      }
    }])
  test(`Base Generator + Babel + css + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css', 'stylus']
      }
    }
  ])
  test(`Base Generator + Babel + Veuetify (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify'
      }
    }
  ])
  test(`Base Generator + Babel + Vuetify + css (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify',
        styles: ['css']
      }
    }
  ])
  test(`Base Generator + Babel + Vuetify + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify',
        styles: ['stylus']
      }
    }
  ])
  test(`Base Generator + Babel + Vuetify + css + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify',
        styles: ['css', 'stylus']
      }
    }
  ])
  // TypeScript setup
  test(`Base Generator + TypeScript (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation
      }
    }
  ])
  test(`Base Generator + TypeScript + css (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css']
      }
    }
  ])
  test(`Base Generator + TypeScript + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['stylus']
      }
    }])
  test(`Base Generator + TypeScript + css + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css', 'stylus']
      }
    }
  ])
  test(`Base Generator + TypeScript + Veuetify (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify'
      }
    }
  ])
  test(`Base Generator + TypeScript + Vuetify + css (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify',
        styles: ['css']
      }
    }
  ])
  test(`Base Generator + TypeScript + Vuetify + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify',
        styles: ['stylus']
      }
    }
  ])
  test(`Base Generator + TypeScript + Vuetify + css + stylus (${avaConfigLocation})`, generator, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: require('../generator'),
      options: {
        avaConfigLocation: avaConfigLocation,
        uiFramework: 'Vuetify',
        styles: ['css', 'stylus']
      }
    }
  ])
}
