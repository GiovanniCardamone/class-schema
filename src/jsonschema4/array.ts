import { JsonSchema4Type } from '.'

export interface JsonSchema4Array {
	type: 'array'
	items?: Array<JsonSchema4Type>

	additionalItems?: boolean

	minItems?: number
	maxItems?: number
	uniqueItems?: boolean

	enum?: Array<string | number | null>
}
