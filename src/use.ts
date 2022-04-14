import { JSONSchema4, JSONSchema4Type } from "json-schema";
import { ValidConstructor } from "./decorators/prop";
import { Ctos, CtosSchema } from "./utils";

export function use(
	constructor:
		| Ctos
		| ValidConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| null
): Partial<JSONSchema4> {
	// @ts-expect-error typescript struggle
	const ctoschema:
		| CtosSchema
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| null
		| undefined = constructor;

	if (ctoschema === undefined) {
		throw new Error(`undefined schema for ${constructor}`);
	}

	if (ctoschema === String) {
		return { type: "string" };
	}

	if (ctoschema === Number) {
		return { type: "number" };
	}

	if (ctoschema === Boolean) {
		return { type: "boolean" };
	}

	if (ctoschema === null) {
		return { type: "null" };
	}

	if ("__schema" in ctoschema === false) {
		throw new TypeError(`${ctoschema.name}: not a schema class`);
	}

	return JSON.parse(JSON.stringify((ctoschema as CtosSchema).__schema));
}

export function useArray(
	constructor:
		| Ctos
		| ValidConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| null
): Partial<JSONSchema4> {
	const ctoschema = constructor as unknown as CtosSchema;

	// @ts-expect-error typescript struggle
	if ([String, Number, Boolean, null].includes(constructor)) {
		return {
			type: "array",
			items: use(constructor),
		};
	}

	if ("__schema" in ctoschema === false) {
		throw new TypeError(`${constructor}: not a schema class`);
	}

	return {
		type: "array",
		items: JSON.parse(JSON.stringify(ctoschema.__schema)),
	};
}

export function useEnum(
	values: Array<JSONSchema4Type> | ReadonlyArray<JSONSchema4Type>
): Partial<JSONSchema4> {
	return { enum: [...values] };
}
