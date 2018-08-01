export interface ExtensiblePathComponent {
  (s: string): null | undefined | { value?: any; remainingPath: string }
}

export default ExtensiblePathComponent
