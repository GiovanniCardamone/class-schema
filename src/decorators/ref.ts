import { Prop, SchemaObject } from '../types'
import { wrapSchema } from '../utils'

import { use } from '../use'

/**
 *
 */
export default function ref(
	type: SchemaObject,
	{ required, nullable, property }: Prop | undefined = {
		required: true,
		nullable: false,
		property: undefined,
	}
) {
	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)
		// const meta = getMetadata(target, name)

		required = required !== undefined ? required : true
		nullable = nullable !== undefined ? nullable : false

		if (nullable) {
			wrap.properties![name] = {
				anyOf: [use(type), { type: 'null' }],
			}
		} else {
			// add current prop
			wrap.properties![name] = use(type)
		}

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}
