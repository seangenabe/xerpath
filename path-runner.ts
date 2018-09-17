import { BuiltPath } from './built-path'
import { BuiltPathComponent } from './built-path-component'
import { ContextType } from './context-type'

export interface PathRunner {
  (strings: TemplateStringsArray, ...values: BuiltPathComponent[]): BuiltPath
}
export default PathRunner

export function createPathRunner(): PathRunner
export function createPathRunner<TContext extends ContextType<TContext>>(
  context?: TContext
): PathRunner & TContext
export function createPathRunner<TContext extends ContextType<TContext>>(
  context?: TContext
): PathRunner & TContext {
  const runnerGenerator = function*(
    strings: TemplateStringsArray,
    values: BuiltPathComponent[]
  ): Iterable<string | BuiltPathComponent> {
    for (let i = 0, len = strings.length, lenny = len - 1; i < len; i++) {
      yield strings[i]
      if (i < lenny) {
        yield values[i]
      }
    }
  }
  const runner: PathRunner = (strings, ...values) => [
    ...runnerGenerator(strings, values)
  ]
  const ret2: PathRunner & TContext = Object.assign(runner, (context ||
    {}) as TContext)
  return ret2
}
