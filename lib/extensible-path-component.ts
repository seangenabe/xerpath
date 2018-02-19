export default interface ExtensiblePathComponent {
  (s: string): null | undefined | { value?: any; remainingPath: string }
}
