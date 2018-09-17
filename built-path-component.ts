export interface BuiltPathComponent {
  (s: string): null | undefined | { value?: any; remainingPath: string }
}

export default BuiltPathComponent
