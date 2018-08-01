# xerpath

Extensible path specification for router providers using tagged template literals.


## Rationale

Almost every JavaScript router (HTTP or otherwise) out there has implemented their own syntax for route paths, which results in additional syntax parsing. The syntax for every router depends wildly on which router you're using.

This package / set of TypeScript typings / conventions aims to eliminate parsing of custom syntax altogether using nothing but template literals.


## What it looks like

An example of how a consumer might use xerpath-inspired routing:

```typescript
const path = r => r`foo/${r.param('a')}/bar`
myRouter.route(path, () => 'hello world')
```

Where `path` is the path to be provided by consumers to the provider's router.

Yes, consumers would only need to pass a function. This way they would not need to know the implementation details (e.g. `r`; `r.param`) that takes place in the provider's end. This will eliminate the need for the context to be provided to the consumer.

Of course `path` can also be a normal string, it's up to the `myRouter.route` function to process.

> What if I don't want to accept functions and just provide the context to the consumer?

No problem, again it's up to the `myRouter.route` function to process.


## Usage

As this is just a specification, there is _almost no code_ that comes from this module. (But we do have TypeScript typings!)

Ultimately, this specification is defined by the TypeScript typings.

```typescript
import {
  BuiltPath,
  concatBuiltPath, // code
  concatExtensiblePath, // code
  createExtensiblePathRunner, // code
  ExtensiblePath,
  ExtensiblePathComponent,
  ExtensiblePathComponentMaker,
  ExtensiblePathRunner
} from 'xerpath'
```


### Providing a context

The provider may provide a context that has string properties and `ExtensibleComponentMaker` values, which are assigned directly to the runner. This enables the consumer to use them and generate path components.

When using TypeScript, the context may then be declared as an interface and used with the extensible path. If the type argument is passed to the path as the type parameter `TContext`, this will give the runner variable the intersection type `ExtensiblePathRunner & TContext`. (Note that `TContext` defaults to `any`.)

```typescript
interface MyContext {
  word(): ExtensiblePathComponent
}
function word() {
  /* ... */
}

let r: ExtensiblePathRunner & MyContext
r = createExtensiblePathRunner<MyContext>({ word })

function route(path: ExtensiblePath<MyContext>) {
  /* ... */
}

// r.word would be strongly typed here.
// This enables consumers who are using TypeScript to validate types
// or check the documentation of this function.
route(r => r`orange ${r.word()} apple`)
```


### Consuming the path

To build a path, simply call the path with the runner/context.


### Concatenate extensible paths and built paths

As extensible paths are just glorified strings, we can concatenate them together. Helper functions to concatenate extensible paths as well as built paths are provided.


### Assigning path component makers to the context

E.g.

```javascript
let r = createExtensiblePathRunner({
  // A path component that matches up to the next space.
  word() {
    return s => {
      if (s.length === 0) {
        return { match: false }
      }
      const res = /([^\s]*)(.*)/
      return { match: true, value: res[1], remainingPath: res[2] }
    }
  },
  // A path component that matches a regular expression.
  regex(regex) {
    return s => {
      const res = regex.exec(s)
      if (res == null) {
        return { match: false }
      }
      return {
        match: true,
        value: res[0],
        remainingPath: s.substr(res[0].length)
      }
    }
  }
})
```


## API


### `lib/extensible-path`


#### ExtensiblePath

```typescript
export interface ExtensiblePath<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker>
> {
  (r: ExtensiblePathRunner & TContext): BuiltPath
}
```

This is a path passed by the consumer to the provider. This is a function taking in the route context and returning a route.

E.g.

```typescript
r => r`foo/${r.param('a')}/bar`
```

For providing a context, see [§ Providing a context](#providing-a-context)


#### concat

```typescript
export function concat(...paths: string[]): string
export function concat<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
>(...paths: (string | ExtensiblePath<TContext>)[]): ExtensiblePath<TContext>
```

Helper function to concatenate `ExtensiblePath`s.


### `lib/extensible-path-component-maker`


#### ExtensiblePathComponentMaker

```typescript
export interface ExtensiblePathComponentMaker {
  (...args: any[]): ExtensiblePathComponent
}
```

E.g.

```typescript
param
```

This is a function provided by the provider to the consumer by way of the context. In the example above, `param` is the name (just the name) of the component maker.

For example, an HTTP router might provide a `param` function for a single parameter within a slash, and a `star` function for multiple parameters spanning multiple slashes.

The signature of the component maker is a function which takes arguments from the consumer and returns an extensible path component. For example, a `param` component maker might take a HTTP route parameter name.


### `lib/extensible-path-component`


#### ExtensiblePathComponent

```typescript
export interface ExtensiblePathComponent {
  (s: string): null | undefined | { value?: any; remainingPath: string }
}
```

This is an individual custom path component returned from an `ExtensiblePathComponentMaker` function.

E.g. The result of:

```typescript
r.param('a')
```

The path component is the result of the component maker being run and is defined by the provider. The path component itself is just a function that takes a string, and attempts to match it.

An object with the property `match` is returned that indicates whether a match is found.

If a match is found, the object will additionally contain the properties:

- `value` - Provider-defined value of the match. (E.g. a component maker `param` for an HTTP router might return a string up to a slash)
- `remainingPath` - Remaining part of the string path after matching. (E.g. as in the example above, an HTTP router might return the rest of the string after the slash.) If there are no more characters remaning in the string, return the empty string.


### `lib/extensible-path-runner`


#### ExtensiblePathRunner

```typescript
export interface ExtensiblePathRunner {
  (
    strings: TemplateStringsArray,
    ...values: ExtensiblePathComponent[]
  ): BuiltPath
}
```

E.g.

```typescript
r
```

The runner is defined by the provider as a function that acts as the tag for the path. The runner is passed as an argument to the consumer-provided route. The runner doubles as the context for consumer routes. ([§ Providing a context](#providing-a-context))

The runner must return an iterable collection of strings and `ExtensiblePathComponent`s, in the order in which they appeared in the string. A `createExtensiblePathRunner` function is provided that does this.

Note: The iterable may contain empty strings and should be handled by the provider's route function.


#### createExtensiblePathRunner

```typescript
export function createExtensiblePathRunner(): ExtensiblePathRunner
export function createExtensiblePathRunner<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker> = any
>(context?: TContext): ExtensiblePathRunner & TContext
```

See [§ Providing a context](#providing-a-context).


### `lib/built-path`


#### BuiltPath

```typescript
export type BuiltPath = Iterable<string | ExtensiblePathComponent>
```

A route. The result of running the extensible path runner against an `ExtensiblePath`.

E.g. the result of:

```typescript
r`foo/${r.param('a')}/bar`
```


#### concat

```typescript
export function concat(...paths: string[]): string 
export function concat(...paths: (string | BuiltPath)[]): BuiltPath
```
