import { Prop, SchemaObject } from '../types'
import { wrapSchema } from '../utils'

import use from '../use'

/**
 *
 */
export default function additionalProps(
	type: SchemaObject,
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
		// const meta = getMetadata(target, name)

		// add current prop
		wrap.properties![name] = {
			type: 'object',
			additionalProperties: {
				type: 'object',
				...use(type),
			},
		}

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}
