import { JSONSchema4 } from 'json-schema'

export type SchemaObject = any

export interface UtilsProp<T = unknown> {
	required?: boolean
	nullable?: boolean
	default?: T
}
