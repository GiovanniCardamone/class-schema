import { JSONSchema4 } from 'json-schema'

interface Ctos {
	new (...args: any[]): any
}

export default function use(schemaClass: Ctos): Partial<JSONSchema4> {
	if ('__schema' in schemaClass.prototype === false) {
		throw new TypeError('not a schema class')
	}

	return schemaClass.prototype.__schema
}
