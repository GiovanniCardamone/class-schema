import 'reflect-metadata'
import { Ctos } from './utils'

export * from './use'
export * from './decorators'
export * from './of'

// @ts-expect-error new exists
export class NullSchema implements Ctos {}

// @ts-expect-error statically assigned
NullSchema.__schema = { type: 'null' }

// @ts-expect-error new exists
export class EmptySchema implements Ctos {}

// @ts-expect-error statically assigned
EmptySchema.__schema = { type: 'object', required: [], properties: {} }
