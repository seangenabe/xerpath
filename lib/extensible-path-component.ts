export default interface ExtensiblePathComponent {
  (s: string):
    | { match: false }
    | { match: true; value?: any; remainingPath: string }
}
