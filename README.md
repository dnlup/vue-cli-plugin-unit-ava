[![Build Status](https://travis-ci.com/dnlup/vue-cli-plugin-unit-ava.svg?token=zu3SxXGFaq3y1hcTQfC6&branch=master)](https://travis-ci.com/dnlup/vue-cli-plugin-unit-ava) [![Greenkeeper badge](https://badges.greenkeeper.io/dnlup/vue-cli-plugin-unit-ava.svg?token=afd39f2e241ccb41748b27d5b16c32d4a8922b23319dbd178352c5a12aa4c967&ts=1552668377939)](https://greenkeeper.io/)

<img src="ava.png" height=60>

# @dnlup/vue-cli-plugin-unit-ava

> unit-ava plugin for vue-cli

###### Note
This plugin is still in development so any feedback is greatly appreciated.

## Table of contents
* [Injected commands](#injected-commands)
* [Installing in an Already Created Project](#installing-in-an-already-created-project)
* [How it works](#how-it-works)
  * [ava configuration](#ava-configuration)
  * [webpack configuration](#webpack-configuration)
  * [Running tests](#running-tests)
  * [Why all of this?](#why-all-of-this?)
* [Contributing](#contributing)

### Injected commands

- **`vue-cli-service test:unit`**

  Run unit tests with [ava](https://github.com/avajs/ava)

  **Note the tests are run inside Node.js with browser environment simulated with JSDOM.**

  ```
  Usage: vue-cli-service test:unit [options] [<file|directory|glob> ...]

  Options:

    --watch, -w              Re-run tests when tests and source files change
    --match, -m              Only run tests with matching title (Can be repeated)
    --update-snapshots, -u   Update snapshots
    --fail-fast              Stop after first test failure
    --timeout, -T            Set global timeout
    --serial, -s             Run tests serially
    --concurrency, -c        Max number of test files running at the same time (Default: CPU cores)
    --verbose, -v            Enable verbose output
    --tap, -t                Generate TAP output
    --color                  Force color output
    --no-color               Disable color output
  ```

  Default files matches are: any files in `tests/unit` that end in `.spec.(ts|js)`.

  All [command line options](https://github.com/avajs/ava/blob/master/docs/05-command-line.md) are supported, the only one that should not work is `--reset-cache` since `ava` doesn't compile the test files, `webpack` does.

### Installing in an Already Created Project

```bash
vue add @dnlup/unit-ava
```

Once installed, calling `ava` directly will not work anymore, see [how to run tests](#running-tests).

### How it works
This plugin aims to setup an environment where test files are compiled with `webpack` and the tests are run with ava using the compiled files. I had to make some assumptions to configure `ava` to work out of the box with the `webpack` setup enforced in `vue` projects.

#### ava configuration
This is the configuration that will be generated for `ava` in `package.json`:

```json
{
  "ava": {
    "files": [
      "dist_tests/tests/**/*.js"
    ],
    "sources": [
      "!**/*.{js,jsx,ts,vue}"
    ],
    "babel": false,
    "compileEnhancements": false,
    "require": "./node_modules/@dnlup/vue-cli-plugin-unit-ava/setup.js"
  }  
}
```

for a reference of all the options see https://github.com/avajs/ava/blob/master/docs/06-configuration.md#options).

##### `files`
This setup `ava` to run tests on the compiled files which are saved by `webpack` in the `dist_tests` folder in the root of your project. ***This value should not be changed at the moment since the output path of `webpack` is hard-coded***. This will have to change of course.

##### `sources`
This is required to make the `--watch` option work properly. I am excluding every file except the compiled ones, otherwise on a file change the test will run multiple times. ***This value should not be changed***.

##### `babel`
This is required to prevent `ava` to compile test files. ***This value should not be changed***.

##### `compileEnhancements`
This disable `power-assert` but you should be able to safely enable it.

##### `require`
This is ***required to setup `jsdom`*** in tests. The purpose of this file is ***not to setup node require hooks*** as suggested in [this recipe](https://github.com/avajs/ava/blob/master/docs/recipes/vue.md), so if you are using a setup file just for that you can safely let the plugin override your setting. If instead you still have to use your own setup file for other reasons, you can create a file like the following:

```js
require('@dnlup/vue-cli-plugin-ava/setup')

//...your code....//
```

and change the value of this field to point to your custom file.

#### webpack configuration
I am modifying the `entry`, `output` and `plugins` field of the confifuration.

##### `entry`
```js
{
  entry: {
    'tests/unit/<your_test_file>': '<file-path>'
  }
}
```
Every test file is an entry that has as key its path (without the extension). This way `webpack` will generate a directory structure identical to the one of the source files.

##### `output`
```js
{
  output: {
    path: join(api.resolve(''), 'dist_tests'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]'
  }
}
```
* `path`

  hardcoded to `dist_tests` directory in the root of your project

* `devtoolModuleFilenameTemplate` and `devtoolFallbackModuleFilenameTemplate`

  setup to `[absolute-resource-path]` so that in devtools will not appear `webpack://` but the actual file path

##### `plugins`
A custom plugin named `RewriteSourceMap` is added to rewrite the source-maps to have each source test file as the first element of the `sources` list field of the generated source-map. This will allow `ava` to use the correct path for saving snapshots.

#### `.gitignore`
The `dist_tests` folder is added to your `.gitignore` file.

#### `package.json` scripts
The `test:unit` script is added to your `scripts` section of the `package.json` file.
See [injected commands](#injected-commands).

#### Runing tests
In this configuration you have to call `vue-cli-service test:unit` to run tests. So if for example you want to run tests only on a specific file you would run:

```bash
$ npm run test:unit -- <your file>
```
or
```bash
$ npx vue-cli-service test:unit <your file>
```

See [injected commands](#injected-commands).

Calling `ava` directly would not work anymore.

#### Why all of this?
I went for this setup because I think that in a `vue` project it is better to let webpack compile everything: you have already all your loaders that are working in `dev` mode.
Using `require hooks` for simple cases should be equivalent, but if you start using packages that add other loaders to the webpack config things might get more complicated. I think [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start) could be a good example. I am open to suggestion anyway, so feel free to chime in and propose alternatives. My end goal is having a `ava` plugin to run unit tests :smile: with `@vue/cli`.

### Contributing

* Make your changes
* Add them
  ```bash
  git add <your files>
  ```
* Commit (uses [commitizen](https://github.com/commitizen/cz-cli))
  ```bash
  npm run cm
  ```
