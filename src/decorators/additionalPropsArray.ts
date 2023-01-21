import { JSONSchema4 } from "json-schema";
import { SchemaObject, UtilsProp } from "../types";
import { use } from "../use";
import { buildProperty, isProperty, wrapSchema } from "../utils";
import { ValidConstructor } from "./prop";

/**
 *
 */
export default function additionalPropsArray(
	type: SchemaObject | ValidConstructor,
	{ required }: UtilsProp | undefined = {
		required: true,
	}
) {
	return function (
		target: SchemaObject | ValidConstructor,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		const wrap = wrapSchema(target);

		if (isProperty(type?.name)) {
			wrap.properties![name] = {
				type: "object",
				additionalProperties: {
					type: "array",
					items: buildProperty(type.name) as JSONSchema4,
				},
			};

			//
		} else {
			wrap.properties![name] = {
				type: "object",
				additionalProperties: {
					type: "object",
					...use(type),
				},
			};
		}

		if (required) {
			const r = wrap.required as Array<string>;
			r.push(name);
		}
	};
}
