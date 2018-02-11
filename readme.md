# xerpath

Extensible path specification for router providers using tagged template literals.

## Rationale

Almost every JavaScript router (HTTP or otherwise) out there has implemented their own syntax for route paths, which results in additional syntax parsing. The syntax for every router depends wildly on which router you're using.

This package / set of TypeScript typings aims to eliminate parsing of custom syntax altogether.

## What it looks like

An example of how a consumer might use this:

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
  createExtensiblePathContext, // code
  ExtensiblePath,
  ExtensiblePathComponent,
  ExtensiblePathComponentMaker,
  ExtensiblePathContext
} from 'xerpath'
```

### ExtensiblePath

This is the path passed by the user. This is a route function:

E.g.

```typescript
r => r`foo/${r.param('a')}/bar`
```

### ExtensiblePathComponentMaker

E.g.

```typescript
param
```

This is a function provided by the route provider to the consumer by way of the context. In the example above, `param` is the name (just the name) of the component maker.

For example, an HTTP router might provide a `param` function for a single parameter within a slash, and a `star` function for multiple parameters spanning multiple slashes.

The signature of the component maker is a function which takes arguments from the consumer and returns an extensible path component. For example, a `param` component maker might take a HTTP route parameter name.

### ExtensiblePathComponent

This is an individual custom path component defined by the consumer.

E.g. The result of:

```typescript
r.param('a')
```

The path component is the result of the component maker being run and is defined by the provider. The path component itself is just a function that takes a string, and attempts to match it.

An object with the property `match` is returned that indicates whether a match is found.

If a match is found, the object will additionally contain the properties:

* `value` - Provider-defined value of the match. (E.g. a component maker `param` for an HTTP router might return a string up to a slash)
* `remainingPath` - Remaining part of the string path after matching. (E.g. as in the example above, an HTTP router might return the rest of the string after the slash.)

### ExtensiblePathContext

E.g.

```typescript
r
```

The context is defined by the provider as a function that acts as the tag for the path. It also acts as a key-value store for the component makers the provider defines.

The context must return an iterable collection of strings and `ExtensiblePathComponent`s, in the order in which they appeared in the string. A `createExtensiblePathContext` function is provided that does this.

Note: The iterable may contain empty strings and should be handled by the provider's route function.

### Concatenate extensible paths and built paths

As extensible paths are just glorified strings, we can concatenate them together. Functions to concatenate extensible paths as well as built paths are provided.

### Assigning path makers to the context

E.g.

```typescript
r = createExtensiblePathContext()
// A path component that matches up to the next space.
r.word = () => s => {
  if (s.length === 0) {
    return { match: false }
  }
  const res = /([^\s]*)(.*)/
  return { match: true, value: res[1], remainingPath: res[2] }
}

// A path component that matches a regular expression.
r.regex = regex => s => {
  const res = regex.exec(s)
  if (res == null) {
    return { match: false }
  }
  return { match: true, value: res[0], remainingPath: s.substr(res[0].length) }
}
```

### Consuming the path

To build a path, simply call the path with the context.
