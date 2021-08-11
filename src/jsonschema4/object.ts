import { JsonSchema4Type } from '.'

export interface JsonSchema4Object {
	type: 'object'
	properties: Record<string, JsonSchema4Type>
}
