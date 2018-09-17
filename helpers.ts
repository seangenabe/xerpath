export function flatten<T>(items: ReadonlyArray<ConcatArray<T> | T>) {
  return ([] as T[]).concat(...items)
}
