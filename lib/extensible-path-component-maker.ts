import ExtensiblePathComponent from './extensible-path-component'

export interface ExtensiblePathComponentMaker {
  (...args: any[]): ExtensiblePathComponent
}

export default ExtensiblePathComponentMaker
