export type JsonSchema4StringFormat =
	| 'date-tyme'
	| 'email'
	| 'hostname'
	| 'ipv4'
	| 'ipv6'
	| 'url'

export interface JsonSchema4String {
	type: 'string'

	minLength?: number
	maxLength?: number

	pattern?: string

	format?: JsonSchema4StringFormat
}
