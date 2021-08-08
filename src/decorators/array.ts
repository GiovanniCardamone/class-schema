import { JSONSchema4 } from 'json-schema'
import { SchemaObject } from '../types'
import { wrapSchema } from '../utils'

/**
 *
 */
export default function array(arrayProps?: JSONSchema4) {
	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		//
		const wrap = wrapSchema(target)

		if (wrap.properties !== undefined && name in wrap.properties === false) {
			throw new TypeError('@array() must be used with other @props method')
		}

		wrap.properties![name] = {
			type: 'array',
			items: wrap.properties![name],
		}
	}
}
