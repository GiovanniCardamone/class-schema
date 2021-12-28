import { JSONSchema4 } from 'json-schema'
import { buildProperty, getMetadata, wrapSchema } from '../utils'
import { SchemaObject } from '../types'
import {
	JsonSchema4Boolean,
	JsonSchema4Null,
	JsonSchema4Numeric,
	JsonSchema4String,
} from '../jsonschema4'

export type AnyProp = {
	[key: string]: any
}

export type SchemaProp = {
	required: boolean
	schema?:
		| (JsonSchema4String & AnyProp)
		| (JsonSchema4Numeric & AnyProp)
		| (JsonSchema4Boolean & AnyProp)
		| JsonSchema4Null
}

export type ValidConstructor =
	| StringConstructor
	| NumberConstructor
	| BooleanConstructor
	| DateConstructor

function prop(): ReturnType<typeof prop>

function prop(
	type: StringConstructor,
	prop?: { required?: boolean; schema?: JsonSchema4String & AnyProp }
): any

function prop(
	type: NumberConstructor,
	prop?: { required?: boolean; schema?: JsonSchema4Numeric & AnyProp }
): any

function prop(
	type: BooleanConstructor,
	prop?: { required?: boolean; schema?: JsonSchema4Boolean & AnyProp }
): any

function prop(
	type: DateConstructor,
	prop?: { required?: boolean; schema?: AnyProp }
): any

// function prop(prop?: {
// 	required?: boolean
// 	schema?: JsonSchema4String | JsonSchema4Numeric | JsonSchema4Boolean
// }): any

/**
 *
 */
function prop(...args: any[]) {
	let required: SchemaProp['required'] = true
	let schema: SchemaProp['schema'] | undefined = undefined

	if (args?.length) {
		var type = typeof args[0] === 'function' ? args[0] : undefined

		if (typeof args[0] !== 'function' && typeof args[0] === 'object') {
			required = 'required' in args[0] ? args[0].required : required
			schema = 'schema' in args[0] ? args[0].schema : schema
		} else if (args[1] !== undefined && typeof args[1] === 'object') {
			required = 'required' in args[1] ? args[1].required : required
			schema = 'schema' in args[1] ? args[1].schema : schema
		}
	}

	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)

		const meta = getMetadata(target, name)

		if (meta.name === 'Array' && type === undefined) {
			throw new TypeError(
				`in ${target.constructor.name}::${name} unable to recognize type array. use example: @prop(String, schemaItemProps)`
			)
		}

		// add current prop
		wrap.properties![name] = buildProperty(
			type !== undefined ? type.name : meta.name,
			schema
		) as JSONSchema4

		if (required) {
			const r = wrap.required as Array<string>
			if (r.includes(name) === false) {
				r.push(name)
			}
		}
	}
}

export default prop
