import { JSONSchema4 } from 'json-schema'

export type SchemaObject = any

export interface Prop {
	required?: boolean
	nullable?: boolean
	property?: JSONSchema4
}
