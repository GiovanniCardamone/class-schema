import { SchemaObject, UtilsProp } from '../types'
import { wrapSchema } from '../utils'

export function oneOf(
	targets: SchemaObject[] | Readonly<SchemaObject[]>,
	{ required, nullable }: UtilsProp | undefined = {
		required: true,
		nullable: false,
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
		const wraps = targets.map(wrapSchema)

		if (nullable) {
			wrap.properties![name] = {
				anyOf: [
					{
						oneOf: wraps,
					},
					{ type: 'null' },
				],
			}
		} else {
			wrap.properties![name] = {
				oneOf: wraps,
			}
		}

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}

export function allOf(
	targets: SchemaObject[] | Readonly<SchemaObject[]>,
	{ required, nullable }: UtilsProp | undefined = {
		required: true,
		nullable: false,
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
		const wraps = targets.map(wrapSchema)

		if (nullable) {
			wrap.properties![name] = {
				anyOf: [
					{
						allOf: wraps,
					},
					{ type: 'null' },
				],
			}
		} else {
			wrap.properties![name] = {
				allOf: wraps,
			}
		}

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}

export function anyOf(
	targets: SchemaObject[] | Readonly<SchemaObject[]>,
	{ required, nullable }: UtilsProp | undefined = {
		required: true,
		nullable: false,
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
		const wraps = targets.map(wrapSchema)

		if (nullable) {
			wrap.properties![name] = {
				anyOf: [...wraps, { type: 'null' }],
			}
		} else {
			wrap.properties![name] = {
				anyOf: wraps,
			}
		}

		if (required) {
			const r = wrap.required as Array<string>
			r.push(name)
		}
	}
}
