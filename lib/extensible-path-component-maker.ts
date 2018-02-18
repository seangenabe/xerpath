import ExtensiblePathComponent from './extensible-path-component'

interface ExtensiblePathComponentMaker {
  (...args: any[]): ExtensiblePathComponent
}

export default ExtensiblePathComponentMaker
