import { BuiltPathComponent } from './built-path-component'

export interface BuiltPathComponentMaker<
  TArgs extends any[] = any[],
  TComponentValue = unknown
> {
  (...args: TArgs): BuiltPathComponent<TComponentValue>
}

export default BuiltPathComponentMaker
