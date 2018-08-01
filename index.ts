import ExtensiblePath, {
  concat as concatExtensiblePath
} from './lib/extensible-path'
import ExtensiblePathComponent from './lib/extensible-path-component'
import ExtensiblePathComponentMaker from './lib/extensible-path-component-maker'
import ExtensiblePathRunner, {
  createExtensiblePathRunner
} from './lib/extensible-path-runner'
import BuiltPath, { concat as concatBuiltPath } from './lib/built-path'
type Path<
  TContext extends Record<keyof TContext, ExtensiblePathComponentMaker>
> = string | ExtensiblePath<TContext>

export {
  BuiltPath,
  concatBuiltPath,
  concatExtensiblePath,
  createExtensiblePathRunner,
  ExtensiblePath,
  ExtensiblePathComponent,
  ExtensiblePathComponentMaker,
  ExtensiblePathRunner,
  Path
}
