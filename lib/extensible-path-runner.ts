import ExtensiblePathComponent from './extensible-path-component'
import BuiltPath from './built-path'
import ExtensiblePathComponentMaker from './extensible-path-component-maker'

export default interface ExtensiblePathRunner {
  (
    strings: TemplateStringsArray,
    ...values: ExtensiblePathComponent[]
  ): BuiltPath
}

function createExtensiblePathRunner(): ExtensiblePathRunner
function createExtensiblePathRunner<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
>(context?: TContext): ExtensiblePathRunner & TContext {
  const ret1: ExtensiblePathRunner = function*(
    strings: TemplateStringsArray,
    ...values: ExtensiblePathComponent[]
  ) {
    for (let i = 0, len = strings.length, lenny = len - 1; i < len; i++) {
      yield strings[i]
      if (i < lenny) {
        yield values[i]
      }
    }
  }
  const ret2: ExtensiblePathRunner & TContext = Object.assign(ret1, (context ||
    {}) as TContext)
  return ret2
}
export { createExtensiblePathRunner }