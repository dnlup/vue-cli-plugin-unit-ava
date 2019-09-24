import test from 'ava'
import generatorMacro from '../helpers/generator'
import generator from '../../generator'

for (const avaConfigLocation of ['package.json', 'ava.config.js']) {
  // Plain JS setup
  test(`no babel (${avaConfigLocation})`, generatorMacro, {
    id: 'unit-ava',
    apply: generator,
    options: {
      avaConfigLocation: avaConfigLocation
    }
  })
  test(`no babel + css (${avaConfigLocation})`, generatorMacro, {
    id: 'unit-ava',
    apply: generator,
    options: {
      avaConfigLocation: avaConfigLocation,
      styles: ['css']
    }
  })
  test(`no babel + stylus (${avaConfigLocation})`, generatorMacro, {
    id: 'unit-ava',
    apply: generator,
    options: {
      avaConfigLocation: avaConfigLocation,
      styles: ['stylus']
    }
  })
  test(`no babel + css + stylus (${avaConfigLocation})`, generatorMacro, {
    id: 'unit-ava',
    apply: generator,
    options: {
      avaConfigLocation: avaConfigLocation,
      styles: ['css', 'stylus']
    }
  })

  // Babel setup
  test(`babel (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation
      }
    }
  ])
  test(`babel + css (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css']
      }
    }
  ])
  test(`babel + stylus (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['stylus']
      }
    }])
  test(`babel + css + stylus (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the babel plugin
    {
      id: 'babel',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css', 'stylus']
      }
    }
  ])

  // TypeScript setup
  test(`typeScript (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation
      }
    }
  ])
  test(`typeScript + css (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css']
      }
    }
  ])
  test(`typeScript + stylus (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['stylus']
      }
    }])
  test(`typeScript + css + stylus (${avaConfigLocation})`, generatorMacro, [
    // mock the presence of the typescript plugin
    {
      id: 'typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'unit-ava',
      apply: generator,
      options: {
        avaConfigLocation: avaConfigLocation,
        styles: ['css', 'stylus']
      }
    }
  ])
}
