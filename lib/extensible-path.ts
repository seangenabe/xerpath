import ExtensiblePathRunner from './extensible-path-runner'
import ExtensiblePathComponentMaker from './extensible-path-component-maker'
import BuiltPath from './built-path'

export interface ExtensiblePath<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker>
> {
  (r: ExtensiblePathRunner & TContext): BuiltPath
}

export default ExtensiblePath

export function concat(...paths: string[]): string
export function concat<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
>(...paths: (string | ExtensiblePath<TContext>)[]): ExtensiblePath<TContext>
export function concat<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
>(
  ...paths: (string | ExtensiblePath<TContext>)[]
): ExtensiblePath<TContext> | string {
  if (paths.every(path => typeof path === 'string')) {
    return paths.join('')
  }
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
  ret.toString = () => {
    const buf: string[] = []
    for (let path of paths) {
      if (typeof path === 'string') {
        buf.push(path)
      } else {
        buf.push(path.toString())
      }
    }
    return buf.join('')
  }
  return ret
}
