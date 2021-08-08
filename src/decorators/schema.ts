import { JSONSchema4 } from 'json-schema'
import { Ctos, CtosSchema } from '../utils'

export default function schema(props?: JSONSchema4) {
	return function <T extends Ctos>(constructor: T): void {
		const ctosSchema = constructor as unknown as CtosSchema
		const parentSchema = constructor.__proto__.__schema

		ctosSchema.__schema = {
			...props,
			type: 'object',
			...ctosSchema?.__schema,
		}

		if (parentSchema) {
			ctosSchema.__schema = {
				...ctosSchema.__schema,
				required: [
					...parentSchema.required,
					...(ctosSchema.__schema.required as string[]),
				],
				properties: {
					...parentSchema.properties,
					...ctosSchema.__schema.properties,
				},
			}
		}
	}
}
