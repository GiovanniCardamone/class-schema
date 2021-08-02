import { JSONSchema4 } from 'json-schema'
import 'reflect-metadata'
import { Ctos } from './schema'
import use from './use'

type SchemaObject = any

interface CtosSchema extends Ctos {
	__schema: JSONSchema4
}

interface Meta {
	name: 'Number' | 'String' | 'Boolean' | 'Date' | 'Object' | 'Array'
}

interface Prop {
	required?: boolean
	property?: JSONSchema4
}

type FnType = StringConstructor | NumberConstructor | BooleanConstructor
export function prop(type: FnType, props: Prop): any
export function prop(type: FnType): any
export function prop(props: Prop): any
export function prop(): any

export function prop(...args: any[]) {
	let required: boolean = true
	let property: Prop | undefined = undefined

	if (args.length) {
		var type = typeof args[0] === 'function' ? args[0] : undefined
		if (typeof args[0] !== 'function') {
			required = 'required' in args[0] ? args[0].required : required
			property = 'property' in args[0] ? args[0].property : property
		} else if (args[1] !== undefined) {
			required = 'required' in args[1] ? args[1].required : required
			property = 'property' in args[1] ? args[1].property : property
		}

		// console.log({ required, property, arg0: args[0] })
	}

	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)
		const meta = getMetadata(target, name)

		// console.log({ name, mtype: meta.name, type, required, property })

		if (meta.name === 'Array' && type === undefined) {
			throw new TypeError(
				`in ${target.constructor.name}::${name} unable to recognize type array. use example: @prop(String, schemaItemProps)`
			)
		}

		// add current prop
		wrap.__schema.properties![name] = buildProperty(
			type !== undefined ? type.name : meta.name,
			property?.property
		)

		if (required) {
			const r = wrap.__schema.required as Array<string>
			r.push(name)
		}
	}
}

export function enums(
	items: string[],
	{ required, property }: Prop | undefined = {
		required: true,
		property: undefined,
	}
) {
	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)

		wrap.__schema.properties![name] = {
			type: 'array',
			items: {
				type: 'string',
				enum: items,
			},
		}

		if (required) {
			const r = wrap.__schema.required as Array<string>
			r.push(name)
		}
	}
}

export function ref(
	type: SchemaObject,
	{ required, property }: Prop | undefined = {
		required: true,
		property: undefined,
	}
) {
	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target)
		// const meta = getMetadata(target, name)

		// add current prop
		wrap.__schema.properties![name] = use(type)

		if (required) {
			const r = wrap.__schema.required as Array<string>
			r.push(name)
		}
	}
}

export function array(arrayProps?: JSONSchema4) {
	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		//
		const wrap = wrapSchema(target)

		if (
			wrap.__schema.properties !== undefined &&
			name in wrap.__schema.properties === false
		) {
			throw new TypeError('@array() must be used with other @props method')
		}

		wrap.__schema.properties![name] = {
			type: 'array',
			items: wrap.__schema.properties![name],
		}
	}
}

// export function anyOf() {

// }

function wrapSchema(target: Ctos): CtosSchema {
	const classSchema = target as CtosSchema

	if ('__schema' in target === false) {
		classSchema.__schema = {
			properties: {},
			required: [],
		}
	}

	return classSchema
}

function getMetadata(target: Ctos, name: string): Meta {
	try {
		return Reflect.getMetadata('design:type', target, name)
	} catch (error) {
		throw new TypeError(
			`unable to retrive metadata for ${target.constructor.name}::${name}. ${error}`
		)
	}
}

function buildProperty(type: Meta['name'], props?: JSONSchema4) {
	switch (type) {
		case 'Number':
			return composeProperty('number', props)
		case 'String':
			return composeProperty('string', props)
		case 'Boolean':
			return composeProperty('boolean', props)
		case 'Date':
			return composeProperty('string', { ...props, format: 'date-time' })
		default:
			console.log({ type })
			return composeProperty('object', props)
	}
}

function composeProperty(type: JSONSchema4['type'], props?: JSONSchema4) {
	return {
		type,
		...props,
	}
}
