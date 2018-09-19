import { BuiltPath } from './built-path'
import { ContextType } from './context-type'
import { PathRunner } from './path-runner'
import { flatten } from './helpers'

export interface PathSingle<TContext extends ContextType<TContext> = any> {
  (r: PathRunner & TContext): BuiltPath
}

type MaybeReadonlyArray<T> = ReadonlyArray<T> | T

export type Path<
  TContext extends ContextType<TContext> = any
> = MaybeReadonlyArray<PathSingle<TContext> | string>

export default Path

export function concat(...paths: string[]): string
export function concat<TContext extends ContextType<TContext>>(
  ...paths: (string | Path<TContext>)[]
): Path<TContext>
export function concat<TContext extends ContextType<TContext>>(
  ...paths: (string | Path<TContext>)[]
): Path<TContext> | string {
  if (paths.every(path => typeof path === 'string')) {
    return paths.join('')
  }
  const ret = flatten(paths)
  ret.toString = () => ret.map(x => x.toString()).join('')
  return ret
}
