import { BuiltPathComponentMaker } from './built-path-component-maker'

export type ContextType<T> = { [Key in keyof T]: BuiltPathComponentMaker }
