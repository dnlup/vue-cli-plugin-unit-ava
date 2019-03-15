/**
 * This module exports the `RewriteSourceMap` webpack plugin.
 * @module vue-cli-plugin-unit-ava/webpack
 */

const { rewriteSourceMapFile, rewriteInlineSourceMap } = require('./util')

/**
 * Adjust source map `sources` field to have the file being transpiled (which is the test file)
 * as the first element so that `ava` can correctly find the destination path to save snapshots.
 */
class RewriteSourceMap {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('RewriteSourceMap', async (compilation, callback) => {
      for (let i = 0; i < compilation.chunks.length; i++) {
        const chunk = compilation.chunks[i]
        const files = chunk.files.filter(file => /\.js(\.map)?$/.test(file))
        for (let file of files) {
          try {
            if (/\.js$/.test(file)) {
              await rewriteInlineSourceMap({ compilation, file, chunk })
            } else if (/\.js\.map$/.test(file)) {
              await rewriteSourceMapFile({ compilation, file, chunk })
            }
          } catch (error) {
            console.error(error)
            compilation.errors.push(error)
          }
        }
      }
      callback()
    })
  }
}

module.exports = RewriteSourceMap
