import ExtensiblePathComponentMaker from './extensible-path-component-maker'
import ExtensiblePathComponent from './extensible-path-component'
import BuiltPath from './built-path'

export default interface ExtensiblePathContext {
  (
    strings: TemplateStringsArray,
    ...values: ExtensiblePathComponent[]
  ): BuiltPath
  [key: string]: ExtensiblePathComponentMaker
}

export function createExtensiblePathContext(): ExtensiblePathContext {
  const ret: any = function*(
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
  return ret as ExtensiblePathContext
}
