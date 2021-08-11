import { JsonSchema4Array } from './array'
import { JsonSchema4Boolean } from './boolean'
import { JsonSchema4Null } from './null'
import { JsonSchema4Numeric } from './numeric'
import { JsonSchema4Object } from './object'
import { JsonSchema4String } from './string'

export type JsonSchema4Type =
	| JsonSchema4String
	| JsonSchema4Numeric
	| JsonSchema4Object
	| JsonSchema4Array
	| JsonSchema4Boolean
	| JsonSchema4Null

export interface JsonSchema4AllOf {
	allOf: Array<JsonSchema4Type>
}

export interface JsonSchema4AnyOf {
	anyOf: Array<JsonSchema4Type>
}

export interface JsonSchema4OneOf {
	oneOf: Array<JsonSchema4Type>
}

export interface JsonSchema4Not {
	not: JsonSchema4Type
}

export {
	JsonSchema4Array,
	JsonSchema4Boolean,
	JsonSchema4Null,
	JsonSchema4Numeric,
	JsonSchema4Object,
	JsonSchema4String,
}
