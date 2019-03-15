/**
 * A set of utilities functions to manipulate source maps during webpack compilation.
 * @module vue-cli-plugin-unit-ava/webpack/util
 */

const convert = require('convert-source-map')
const sourcemap = require('source-map')

/**
 * @external SourceMapConsumer
 * @see {@link https://github.com/mozilla/source-map#sourcemapconsumer}
 */

/**
 * @external Chunk
 * @see {@link https://webpack.js.org/contribute/plugin-patterns/#exploring-assets-chunks-modules-and-dependencies}
 */

/**
 * @external Compilation
 * @see {@link https://webpack.js.org/contribute/plugin-patterns/#exploring-assets-chunks-modules-and-dependencies}
 */

/**
 * Modify `sources`, `sourcesContent`, `mappings` positioning the `chunk.name` file (which is the test file)
 * as the first element of the lists
 * @param  {SourceMapConsumer} consumer
 * @param  {Chunk} chunk
 */
function adjustSourceMap ({ consumer, chunk }) {
  const generator = new sourcemap.SourceMapGenerator({
    file: consumer.file,
    sourceRoot: consumer.sourceRoot
  })
  const sourcesMapEntries = []
  let testFileMapEntry = null
  const mappings = []
  consumer.eachMapping(mapping => {
    mappings.push(mapping)
  })
  for (const [index, value] of consumer.sources.entries()) {
    if (value.includes(chunk.name)) {
      testFileMapEntry = {
        source: value,
        sourceContent: consumer.sourcesContent[index],
        mappings: mappings.filter(mapping => mapping.source === consumer.sources[index])
      }
    } else {
      sourcesMapEntries.push({
        source: value,
        sourceContent: consumer.sourcesContent[index],
        mappings: mappings.filter(mapping => mapping.source === consumer.sources[index])
      })
    }
  }

  sourcesMapEntries.unshift(testFileMapEntry)

  for (const entry of sourcesMapEntries) {
    for (const mapping of entry.mappings) {
      generator.addMapping({
        original: {
          line: mapping.originalLine,
          column: mapping.originalColumn
        },
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        },
        source: mapping.source,
        name: mapping.name
      })
    }
    generator.setSourceContent(entry.source, entry.sourceContent)
  }
  return generator
}

/**
 * Rewrite the source map file
 * @param  {Compilation} compilation
 * @param  {String} file  the source map file
 * @param  {Chunk} chunk
 */
exports.rewriteSourceMapFile = async function rewriteSourceMapFile ({ compilation, file, chunk } = {}) {
  const mapSource = compilation.assets[file].source()
  const consumer = await new sourcemap.SourceMapConsumer(mapSource)
  const index = consumer.sources.findIndex(source => source.includes(chunk.name))
  if (!(index > 0)) return
  const generator = adjustSourceMap({ consumer, chunk })
  compilation.assets[file]._value = generator.toString()
  consumer.destroy()
}

/**
 * Rewrite the source map inline
 * @param  {Compilation} compilation
 * @param  {String} file the file with inline source map
 * @param  {Chunk} chunk
 */
exports.rewriteInlineSourceMap = async function ({ compilation, file, chunk } = {}) {
  let converted
  try {
    converted = convert.fromComment(compilation.assets[file].source())
  } catch (error) {
    return
  }
  const mapSource = converted.toJSON()
  const consumer = await new sourcemap.SourceMapConsumer(mapSource)
  const index = consumer.sources.findIndex(source => source.includes(chunk.name))
  if (!(index > 0)) return
  const generator = adjustSourceMap({ consumer, chunk })
  const adjusted = convert.fromJSON(generator.toString())
  compilation.assets[file].children[1] = '\n' + adjusted.toComment()
  consumer.destroy()
}
