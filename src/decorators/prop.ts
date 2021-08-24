import { JSONSchema4 } from 'json-schema'
import { buildProperty, getMetadata, wrapSchema } from '../utils'
import { SchemaObject } from '../types'
import {
	JsonSchema4Boolean,
	JsonSchema4Null,
	JsonSchema4Numeric,
	JsonSchema4String,
} from '../jsonschema4'

export type SchemaProp = {
	required: boolean
	schema?:
		| JsonSchema4String
		| JsonSchema4Numeric
		| JsonSchema4Boolean
		| JsonSchema4Null
}

function prop(): ReturnType<typeof prop>

function prop(
	type: StringConstructor,
	prop: { required?: boolean; schema?: JsonSchema4String }
): any

function prop(
	type: NumberConstructor,
	prop: { required?: boolean; schema?: JsonSchema4Numeric }
): any

function prop(
	type: BooleanConstructor,
	prop: { required?: boolean; schema?: JsonSchema4Boolean }
): any

function prop(prop: {
	required?: boolean
	schema?: JsonSchema4String | JsonSchema4Numeric | JsonSchema4Boolean
}): any

/**
 *
 */
function prop(...args: any[]) {
	let required: boolean = true
	let schema: SchemaProp | undefined = undefined

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
			schema?.schema
		)

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}

export default prop
