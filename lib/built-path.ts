import ExtensiblePathComponent from './extensible-path-component'

type BuiltPath = Iterable<string | ExtensiblePathComponent>
export default BuiltPath

export function concat(...paths: string[]): string
export function concat(...paths: (string | BuiltPath)[]): BuiltPath
export function concat(...paths: (string | BuiltPath)[]): BuiltPath | string {
  if (paths.every(path => typeof path === 'string')) {
    return paths.join('')
  }
  return (function*() {
    for (let path of paths) {
      if (typeof path === 'string') {
        yield path
      } else {
        yield* path
      }
    }
  })()
}
