import { BuiltPathComponent } from './built-path-component'
import { flatten } from './helpers'

export type BuiltPath = ReadonlyArray<string | BuiltPathComponent>
export default BuiltPath

export function concat(...paths: string[]): string
export function concat(...paths: (string | BuiltPath)[]): BuiltPath
export function concat(...paths: (string | BuiltPath)[]): BuiltPath | string {
  return flatten(paths)
}
