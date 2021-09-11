import { JSONSchema4 } from 'json-schema'
import use from './use'
import { Ctos } from './utils'

export type OfType = {
	allOf?: Partial<JSONSchema4>
	anyOf?: Partial<JSONSchema4>
	oneOf?: Partial<JSONSchema4>
	not?: Partial<JSONSchema4>
}

export function allOf(...constructor: Array<Ctos | OfType>) {
	return {
		allOf: constructor.map((c) => (isCtos(c) ? use(c) : c)),
	}
}

export function anyOf(...constructor: Array<Ctos | OfType>) {
	return {
		anyOf: constructor.map((c) => (isCtos(c) ? use(c) : c)),
	}
}

export function oneOf(...constructor: Array<Ctos | OfType>) {
	return {
		oneOf: constructor.map((c) => (isCtos(c) ? use(c) : c)),
	}
}

export function not(...constructor: Array<Ctos | OfType>) {
	return {
		not: constructor.map((c) => (isCtos(c) ? use(c) : c)),
	}
}

function isCtos(ctos: any): ctos is Ctos {
	return typeof ctos === 'function' && '__schema' in ctos
}
