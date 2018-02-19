import ExtensiblePathRunner from './extensible-path-runner'
import ExtensiblePathComponentMaker from './extensible-path-component-maker'
import BuiltPath from './built-path'

export interface ExtensiblePath<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
> {
  (r: ExtensiblePathRunner & TContext): BuiltPath
}

export default ExtensiblePath

export function concat<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
>(...paths: (string | ExtensiblePath<TContext>)[]): ExtensiblePath<TContext> {
  const ret: ExtensiblePath<TContext> = (r): BuiltPath => {
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
