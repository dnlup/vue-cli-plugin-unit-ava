[![Build Status](https://travis-ci.com/dnlup/vue-cli-plugin-unit-ava.svg?token=zu3SxXGFaq3y1hcTQfC6&branch=master)](https://travis-ci.com/dnlup/vue-cli-plugin-unit-ava)

<img src="ava.png" height=60>

# @dnlup/vue-cli-plugin-unit-ava

> unit-ava plugin for vue-cli

## Injected commands

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

## Installing in an Already Created Project

```bash
vue add @dnlup/unit-ava
```

## Notes
Compilation of tests files is done with webpack and the artifacts are saved in the `dist_tests` directory in the project root (this directory is added to your `.gitignore`).

## Contributing

* Make your changes
* Add them
  ```bash
  git add <your files>
  ```
* Commit (uses [commitizen](https://github.com/commitizen/cz-cli))
  ```bash
  npm run cm
  ```
