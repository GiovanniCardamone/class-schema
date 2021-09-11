import { Prop, SchemaObject } from '../types'
import { wrapSchema } from '../utils'

/**
 *
 */
export default function enums(
	items: Array<string | number>,
	{ required, property }: Prop | undefined = {
		required: true,
		property: undefined,
	}
) {
	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)

		wrap.properties![name] = {
			enum: items,
			// type: 'array',
			// items: {
			// 	type: typeof items[0] as 'string' | 'number',
			// 	enum: items,
			// },
		}

		if (required) {
			const r = wrap.required as Array<string>

			if (!r.includes(name)) {
				r.push(name)
			}
		}
	}
}
