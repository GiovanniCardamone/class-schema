import { JSONSchema4 } from 'json-schema'
import { Ctos, CtosSchema } from './utils'

export default function use(constructor: Ctos): Partial<JSONSchema4> {
	const ctoschema = constructor as unknown as CtosSchema

	if ('__schema' in ctoschema === false) {
		console.log({ constructor, proto: constructor.prototype })
		throw new TypeError('not a schema class')
	}

	return JSON.parse(JSON.stringify(ctoschema.__schema))
}
