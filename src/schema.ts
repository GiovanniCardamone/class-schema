import { JSONSchema4 } from 'json-schema'

export interface Ctos {
	new (...args: any[]): any
}

export default function schema(props?: JSONSchema4) {
	return function <T extends Ctos>(constructor: T): void {
		constructor.prototype.__schema = {
			...props,
			type: 'object',
			...constructor.prototype.__schema
		}
	}
}

