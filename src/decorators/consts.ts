import { UtilsProp, SchemaObject } from '../types'
import { wrapSchema } from '../utils'

/**
 *
 */
export default function consts(
	item: string | number,
	options: UtilsProp<string | number> | undefined = {
		required: true,
	}
) {
	const required = options.required !== undefined ? options.required : true
	const nullable = options.nullable !== undefined ? options.nullable : false
	// const defaultv = options.default !== undefined ? options.default : undefined

	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)

		if (nullable) {
			wrap.properties![name] = {
				anyOf: [
					{
						type: 'string',
						const: item as string | number,
						default: options.default,
					},
					{
						type: 'null',
					},
				],
			}
		} else {
			wrap.properties![name] = {
				type: 'string',
				const: item as string | number,
				default: options.default,
			}
		}

		if (required) {
			const r = wrap.required as Array<string>

			if (!r.includes(name)) {
				r.push(name)
			}
		}
	}
}
