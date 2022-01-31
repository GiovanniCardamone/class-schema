export interface JsonSchema4Numeric {
	type: 'integer' | 'number'

	multipleOf?: number

	minimum?: number
	exclusiveMinimum?: number

	maximum?: number
	exclusiveMaximum?: number

	default?: number

	description?: string
}
