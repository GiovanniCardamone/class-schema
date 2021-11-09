import { JSONSchema4 } from 'json-schema'
import { ValidConstructor } from './decorators/prop'
import { Ctos, CtosSchema } from './utils'

export function use(
	constructor: Ctos | ValidConstructor
): Partial<JSONSchema4> {
	const ctoschema = constructor as unknown as CtosSchema

	if ('__schema' in ctoschema === false) {
		throw new TypeError(`${ctoschema.name}: not a schema class`)
	}

	return JSON.parse(JSON.stringify(ctoschema.__schema))
}

export function useArray(constructor: Ctos): Partial<JSONSchema4> {
	const ctoschema = constructor as unknown as CtosSchema

	if ('__schema' in ctoschema === false) {
		throw new TypeError(`${constructor}: not a schema class`)
	}

	return {
		type: 'array',
		items: JSON.parse(JSON.stringify(ctoschema.__schema)),
	}
}
