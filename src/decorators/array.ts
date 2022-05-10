import { SchemaObject, UtilsProp, ArrayUtilsProp } from "../types";
import { wrapSchema } from "../utils";

/**
 *
 */
export default function array(
	{
		required,
		nullable,
		min,
		max,
		unique,
	}: (UtilsProp & ArrayUtilsProp) | undefined = {
		required: true,
		nullable: false,
	}
) {
	required = required !== undefined ? required : true;
	nullable = nullable !== undefined ? nullable : false;

	return function (
		target: SchemaObject,
		name: string
		// descriptor: PropertyDescriptor
	): void {
		//
		const wrap = wrapSchema(target);

		if (wrap.properties !== undefined && name in wrap.properties === false) {
			throw new TypeError("@array() must be used with other @props method");
		}

		if (nullable) {
			wrap.properties![name] = {
				anyOf: [
					{
						type: "array",
						items: wrap.properties![name],
						...(min !== undefined && { minItems: min }),
						...(max !== undefined && { maxItems: max }),
						...(unique !== undefined && { uniqueItems: unique }),
					},
					{ type: "null" },
				],
			};
		} else {
			wrap.properties![name] = {
				type: "array",
				items: wrap.properties![name],
				title: wrap.title,
				description: wrap.description,
				...(min !== undefined && { minItems: min }),
				...(max !== undefined && { maxItems: max }),
				...(unique !== undefined && { uniqueItems: unique }),
			};
		}
	};
}
