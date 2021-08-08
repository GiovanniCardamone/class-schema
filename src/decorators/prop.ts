import { JSONSchema4 } from 'json-schema'
import 'reflect-metadata'
import { buildProperty, getMetadata, wrapSchema } from '../utils'
import { Prop, SchemaObject } from '../types'

type FnType = StringConstructor | NumberConstructor | BooleanConstructor
export function prop(type: FnType, props: Prop): any
export function prop(type: FnType): any
export function prop(props: Prop): any
export function prop(): any

/**
 *
 */
export default function prop(...args: any[]) {
	let required: boolean = true
	let property: Prop | undefined = undefined

	if (args.length) {
		var type = typeof args[0] === 'function' ? args[0] : undefined
		if (typeof args[0] !== 'function') {
			required = 'required' in args[0] ? args[0].required : required
			property = 'property' in args[0] ? args[0].property : property
		} else if (args[1] !== undefined) {
			required = 'required' in args[1] ? args[1].required : required
			property = 'property' in args[1] ? args[1].property : property
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
			property?.property
		)

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}
