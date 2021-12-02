import { JSONSchema4 } from 'json-schema'
import { Ctos, CtosSchema } from '../utils'

interface Additional {
	examples: Record<string, any>
}

export default function schema(props?: JSONSchema4, additional?: Additional) {
	return function <T extends Ctos>(constructor: T): void {
		const ctosSchema = constructor as unknown as CtosSchema
		const parentSchema = ctosSchema?.__proto__?.__schema

		ctosSchema.__schema = {
			...props,
			type: 'object',
			...ctosSchema?.__schema,
		}

		if (parentSchema) {
			ctosSchema.__schema = {
				...ctosSchema.__schema,
				required: [
					...new Set([
						...(parentSchema.required as string[]),
						...(ctosSchema.__schema.required as string[]),
					]),
				],
				properties: {
					...parentSchema.properties,
					...ctosSchema.__schema.properties,
				},
			}
		}
	}
}
