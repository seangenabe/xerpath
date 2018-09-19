import { BuiltPathComponentMaker } from './built-path-component-maker'

export type ContextType<TSelf> = {
  [Key in keyof TSelf]: BuiltPathComponentMaker
}
