export interface BuiltPathComponent<TValue = any> {
  (s: string): null | undefined | { value?: TValue; remainingPath: string }
}

export default BuiltPathComponent
