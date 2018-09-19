import {
  BuiltPathComponent,
  BuiltPathComponentMaker,
  concatPath,
  createPathRunner,
  PathRunner
} from './'
import Path, { PathSingle } from './path'

const word = () => {
  const component = (s: string) => {
    const result = /^[\s$]+/.exec(s)
    if (result == null) {
      const ret = {
        value: '',
        remainingPath: s
      }
      return ret
    }
    return {
      value: result[0],
      remainingPath: s.slice(result[0].length)
    }
  }
  assertIsType<BuiltPathComponent<string>>(component)
  return component
}

const rest = () => (s: string) => ({
  value: s,
  remainingPath: ''
})

interface MyContext {
  word: typeof word
  rest: typeof rest
}
const contextRaw: MyContext = {
  word,
  rest
}
const context = createPathRunner<MyContext>(contextRaw)

'BuiltPathComponentMaker'
{
  assertIsType<BuiltPathComponentMaker<[], string>>(word)

  const argTest = (one: number, two: symbol, three: string[]) => (
    s: string
  ) => ({ value: Symbol(), remainingPath: '' })
  assertIsType<BuiltPathComponentMaker<[number, symbol, string[]], symbol>>(
    argTest
  )
}

'context type'
{
  assertIsType<PathRunner & MyContext>(context)
}

'Path'
{
  const path1: PathSingle<MyContext> = r => r`xxx${r.word()}`
  assertIsType<Path>(path1)
  const path2 = 'aaaa'
  const pathW = concatPath(path1, path2)
  assertIsType<Path>(pathW)

  const router1 = (path: Path<MyContext>) => {
    const ret = ([] as (PathSingle<MyContext> | string)[])
      .concat(path)
      .map(x => {
        if (typeof x === 'string') {
          return x
        } else {
          assertIsType<PathSingle<MyContext>>(x)
          const ret = x(context)
          assertIsType<ReadonlyArray<string | BuiltPathComponent>>(ret)
          return ret
        }
      })
    return ret
  }
  assertIsType<Readonly<string | BuiltPathComponent<any>>>(router1)
}

function assertIsType<T>(arg: T): void {}
