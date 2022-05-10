import { JSONSchema4 } from "json-schema";
import { AnyProp, SchemaProp } from "./decorators/prop";
import { JsonSchema4String } from "./jsonschema4";

export interface Ctos {
	new (...args: any[]): any;
}

export interface CtosSchema extends Ctos {
	__schema: JSONSchema4;
	__proto__?: CtosSchema;
}

export interface Meta {
	name: "Number" | "String" | "Boolean" | "Date" | "Object" | "Array";
}

/**
 *
 */
export function wrapSchema(target: Ctos): CtosSchema["__schema"] {
	const classSchema: CtosSchema =
		"__schema" in target
			? (target as CtosSchema)
			: (target.constructor as CtosSchema);

	// console.log('target', target)
	// console.log('classSchema', classSchema.__schema)
	// console.log('constructor', target.constructor)
	// console.log('parent', target.constructor.__proto__.constructor)
	const extend = target.constructor.prototype.__proto__.constructor !== Object;

	if (
		extend &&
		(classSchema.__schema === undefined || "type" in classSchema.__schema)
	) {
		classSchema.__schema = {
			properties: {},
			required: [],
		};
	}

	if (extend === false && "__schema" in classSchema === false) {
		classSchema.__schema = {
			properties: {},
			required: [],
		};
	}

	return classSchema.__schema;
}

export function getMetadata(target: Ctos, name: string): Meta {
	try {
		return Reflect.getMetadata("design:type", target, name);
	} catch (error) {
		throw new TypeError(
			`unable to retrive metadata for ${target.constructor.name}::${name}. ${error}`
		);
	}
}

export function isProperty(type: string) {
	return ["Number", "String", "Boolean", "Date"].includes(type);
}

/**
 *
 */
export function buildProperty(
	type: Meta["name"],
	props?: SchemaProp["schema"]
) {
	switch (type) {
		case "Number":
			return composeProperty("number", props);
		case "String":
			return composeProperty("string", props);
		case "Boolean":
			return composeProperty("boolean", props);
		case "Date":
			return composeProperty("string", {
				...props,
				format: "date-time",
				datetime: "ISO8601",
			} as JsonSchema4String & AnyProp);
		default:
			return composeProperty("object", props);
	}
}

export function composeProperty(
	type: JSONSchema4["type"],
	props?: SchemaProp["schema"]
) {
	return {
		type,
		...props,
	};
}
