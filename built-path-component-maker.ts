import { BuiltPathComponent } from './built-path-component'

export interface BuiltPathComponentMaker<TArgs extends any[] = any[]> {
  (...args: TArgs): BuiltPathComponent
}

export default BuiltPathComponentMaker
