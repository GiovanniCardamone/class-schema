import { UtilsProp, SchemaObject } from '../types'
import { wrapSchema } from '../utils'

/**
 *
 */
export default function enums(
	items: Array<string | number> | Readonly<Array<string | number>>,
	{ required, nullable }: UtilsProp | undefined = {
		required: true,
	}
) {
	required = required !== undefined ? required : true
	nullable = nullable !== undefined ? nullable : false

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
						enum: items as Array<string | number>,
					},
					{
						type: 'null',
					},
				],
			}
		} else {
			wrap.properties![name] = {
				enum: items as Array<string | number>,
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
