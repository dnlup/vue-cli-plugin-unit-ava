const create = require('@vue/cli-test-utils/createTestProject')

export default async function (t, input = {}) {
  const { plugins = {}, invokeOpts = [] } = input
  const project = await create(t.context.project, {
    plugins
  }, t.context.DATA_DIR)
  const opts = invokeOpts.join(' ')
  await project.run(`npm i -D ${t.context.ROOT}`)
  await project.run(`vue invoke @dnlup/unit-ava ${opts}`)
  await project.run(`${t.context.cliService} test:unit`)
  t.pass()
}
