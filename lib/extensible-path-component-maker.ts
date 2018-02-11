import ExtensiblePathComponent from './extensible-path-component'

interface ExtensiblePathComponentMaker {
  (): ExtensiblePathComponent
  <T1 = any>(arg1: T1): ExtensiblePathComponent
  <T1 = any, T2 = any>(arg1: T1, arg2: T2): ExtensiblePathComponent
  <T1 = any, T2 = any, T3 = any>(
    arg1: T1,
    arg2: T2,
    arg3: T3
  ): ExtensiblePathComponent
  <TArgs = any>(...args: TArgs[]): ExtensiblePathComponent
}

export default ExtensiblePathComponentMaker
