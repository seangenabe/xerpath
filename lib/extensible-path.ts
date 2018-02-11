import ExtensiblePathContext from './extensible-path-context'
import BuiltPath from './built-path'

export interface ExtensiblePath {
  (r: ExtensiblePathContext): BuiltPath
}

export default ExtensiblePath

export function concat(...paths: (string | ExtensiblePath)[]): ExtensiblePath {
  const ret: ExtensiblePath = (r: ExtensiblePathContext): BuiltPath => {
    const builtPath = (function*() {
      for (let path of paths) {
        if (typeof path === 'string') {
          yield path
        } else {
          yield* path(r)
        }
      }
    })()
    return builtPath
  }
  return ret
}
