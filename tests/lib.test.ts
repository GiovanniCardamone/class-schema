import { expect } from 'chai'
import 'reflect-metadata'
import { use, schema, prop, ref, array, enums, additionalProps } from '../src'

describe('schema', () => {
	//
	it('use non-schema class => must throw TypeError', (done) => {
		expect(() => {
			class TestSchema0 {}
			use(TestSchema0)
		}).to.throw(TypeError)

		done()
	})

	//
	it('schema with title', (done) => {
		@schema({ title: 'TestSchema1' })
		class TestSchema1 {}

		expect(use(TestSchema1)).to.deep.contains({
			type: 'object',
			title: 'TestSchema1',
		})

		done()
	})

	//
	it('schema with prop', (done) => {
		@schema()
		class TestSchema2 {
			@prop()
			myNumber!: number
		}

		expect(use(TestSchema2)).to.deep.contains({
			type: 'object',
			required: ['myNumber'],
			properties: {
				myNumber: {
					type: 'number',
				},
			},
		})

		done()
	})

	//
	it('schema with optional prop', (done) => {
		@schema()
		class TestSchema3 {
			@prop({ required: false })
			myNumber?: number
		}

		expect(use(TestSchema3)).to.deep.contains({
			type: 'object',
			required: [],
			properties: {
				myNumber: {
					type: 'number',
				},
			},
		})

		done()
	})

	//
	it('schema with multiple prop', (done) => {
		@schema()
		class TestSchema4 {
			@prop({ required: false })
			myNumber?: number

			@prop()
			myString!: string
		}

		expect(use(TestSchema4)).to.deep.contains({
			type: 'object',
			required: ['myString'],
			properties: {
				myString: {
					type: 'string',
				},
				myNumber: {
					type: 'number',
				},
			},
		})

		done()
	})

	//
	it('schema with ref', (done) => {
		@schema()
		class TestSchema5Nested {
			@prop({ required: false })
			myNumber?: number

			@prop()
			myString!: string
		}

		@schema()
		class TestSchema5 {
			@ref(TestSchema5Nested)
			nested!: TestSchema5Nested

			@ref(TestSchema5Nested)
			another!: TestSchema5Nested
		}

		expect(use(TestSchema5)).to.deep.contains({
			type: 'object',
			required: ['nested', 'another'],
			properties: {
				another: {
					type: 'object',
					required: ['myString'],
					properties: {
						myString: {
							type: 'string',
						},
						myNumber: {
							type: 'number',
						},
					},
				},
				nested: {
					type: 'object',
					required: ['myString'],
					properties: {
						myString: {
							type: 'string',
						},
						myNumber: {
							type: 'number',
						},
					},
				},
			},
		})

		done()
	})

	//
	it('schema with ref with ref', (done) => {
		@schema()
		class TestSchema6NestedNested {
			@prop({ required: false })
			myNumber?: number

			@prop()
			myString!: string
		}

		@schema()
		class TestSchema6Nested {
			@ref(TestSchema6NestedNested)
			nested!: TestSchema6NestedNested
		}

		@schema()
		class TestSchema6 {
			@ref(TestSchema6Nested)
			nested!: TestSchema6Nested
		}

		expect(use(TestSchema6)).to.deep.contains({
			type: 'object',
			required: ['nested'],
			properties: {
				nested: {
					type: 'object',
					required: ['nested'],
					properties: {
						nested: {
							type: 'object',
							required: ['myString'],
							properties: {
								myString: {
									type: 'string',
								},
								myNumber: {
									type: 'number',
								},
							},
						},
					},
				},
			},
		})

		done()
	})

	//
	it('schema with array ref', (done) => {
		@schema()
		class TestSchema7Nested {
			@prop({ required: false })
			myNumber?: number

			@prop()
			myString!: string
		}

		@schema()
		class TestSchema7 {
			@array()
			@ref(TestSchema7Nested)
			nested!: TestSchema7Nested[]
		}

		expect(use(TestSchema7)).to.deep.contains({
			type: 'object',
			required: ['nested'],
			properties: {
				nested: {
					type: 'array',
					items: {
						type: 'object',
						required: ['myString'],
						properties: {
							myNumber: {
								type: 'number',
							},
							myString: {
								type: 'string',
							},
						},
					},
				},
			},
		})
		done()
	})

	//
	it('schema with ref with array props', (done) => {
		@schema()
		class TestSchema8Nested {
			@array()
			@prop(Number, { required: false })
			myNumber?: number[]

			@prop()
			myString!: string
		}

		@schema()
		class TestSchema8 {
			@ref(TestSchema8Nested)
			nested!: TestSchema8Nested
		}

		expect(use(TestSchema8)).to.deep.contains({
			type: 'object',
			required: ['nested'],
			properties: {
				nested: {
					type: 'object',
					required: ['myString'],
					properties: {
						myNumber: {
							type: 'array',
							items: {
								type: 'number',
							},
						},
						myString: {
							type: 'string',
						},
					},
				},
			},
		})

		done()
	})

	//
	it('schema with ref with array ref', (done) => {
		@schema()
		class TestSchema9NestedNested {
			@prop({ required: false })
			myNumber?: number

			@prop()
			myString!: string
		}

		@schema()
		class TestSchema9Nested {
			@array()
			@ref(TestSchema9NestedNested)
			myOtherRef!: TestSchema9NestedNested[]
		}

		@schema()
		class TestSchema9 {
			@ref(TestSchema9Nested)
			myRef!: TestSchema9Nested
		}

		expect(use(TestSchema9)).to.deep.contain({
			type: 'object',
			required: ['myRef'],
			properties: {
				myRef: {
					type: 'object',
					required: ['myOtherRef'],
					properties: {
						myOtherRef: {
							type: 'array',
							items: {
								type: 'object',
								required: ['myString'],
								properties: {
									myNumber: {
										type: 'number',
									},
									myString: {
										type: 'string',
									},
								},
							},
						},
					},
				},
			},
		})

		done()
	})

	//
	it('schema with enums', (done) => {
		const ENUM = ['a', 'b', 'c'] // value
		type ENUM_T = typeof ENUM[number] // type
		@schema()
		class TestSchema10 {
			@enums(ENUM)
			myEnum!: ENUM_T
		}

		expect(use(TestSchema10)).to.deep.equals({
			type: 'object',
			required: ['myEnum'],
			properties: {
				myEnum: {
					type: 'array',
					items: {
						type: 'string',
						enum: ENUM,
					},
				},
			},
		})

		done()
	})

	//
	it('schema with prop (date)', (done) => {
		@schema()
		class TestSchema11 {
			@prop()
			myDate!: Date
		}

		expect(use(TestSchema11)).to.deep.equals({
			type: 'object',
			required: ['myDate'],
			properties: {
				myDate: {
					type: 'string',
					format: 'date-time',
				},
			},
		})

		done()
	})

	it('schema with prop array without type => must throw TypeError', (done) => {
		expect(() => {
			@schema()
			class TestSchema12 {
				@array()
				@prop()
				myNumberArray!: number[]
			}
		}).to.throw(TypeError)

		done()
	})

	it('schema with array without prop => must thriw TypeError', (done) => {
		expect(() => {
			@schema()
			class TestSchema13 {
				@array()
				myNumberArray!: number[]
			}
		}).to.throw(TypeError)

		done()
	})

	it('schema with prop (boolean)', (done) => {
		@schema()
		class TestSchema14 {
			@prop()
			myBoolean!: boolean
		}

		expect(use(TestSchema14)).to.be.deep.equals({
			type: 'object',
			required: ['myBoolean'],
			properties: {
				myBoolean: {
					type: 'boolean',
				},
			},
		})

		done()
	})

	it('schema with optional enums', (done) => {
		const e = [1, 2, 3]
		type E = typeof e[number]
		@schema()
		class TestSchema15 {
			@enums(e, { required: false })
			myEnum?: E
		}

		expect(use(TestSchema15)).to.be.deep.equals({
			type: 'object',
			required: [],
			properties: {
				myEnum: {
					type: 'array',
					items: {
						type: 'number',
						enum: e,
					},
				},
			},
		})

		done()
	})

	it('schema with inheritance', (done) => {
		@schema()
		class TestSchema15Base {
			@prop()
			myNumber!: number
		}

		@schema()
		class TestSchema15 extends TestSchema15Base {
			@prop()
			myString!: string
		}

		expect(
			use(TestSchema15Base),
			'base class should have only own items'
		).to.be.deep.equals({
			type: 'object',
			required: ['myNumber'],
			properties: {
				myNumber: {
					type: 'number',
				},
			},
		})

		expect(
			use(TestSchema15),
			'extends have base plus extends'
		).to.be.deep.equals({
			type: 'object',
			required: ['myNumber', 'myString'],
			properties: {
				myNumber: {
					type: 'number',
				},
				myString: {
					type: 'string',
				},
			},
		})

		done()
	})

	it('schema with inheritance with inheritance', (done) => {
		@schema()
		class TestSchema16BaseBase {
			@prop()
			myNumber!: number
		}

		@schema()
		class TestSchema16Base extends TestSchema16BaseBase {
			@prop()
			myString!: string
		}

		@schema()
		class TestSchema16 extends TestSchema16Base {
			@prop()
			myBoolean!: boolean
		}

		expect(
			use(TestSchema16BaseBase),
			'base class should have only own items'
		).to.be.deep.equals({
			type: 'object',
			required: ['myNumber'],
			properties: {
				myNumber: {
					type: 'number',
				},
			},
		})

		expect(
			use(TestSchema16Base),
			'extends have base plus extends'
		).to.be.deep.equals({
			type: 'object',
			required: ['myNumber', 'myString'],
			properties: {
				myNumber: {
					type: 'number',
				},
				myString: {
					type: 'string',
				},
			},
		})

		expect(
			use(TestSchema16),
			'extends have base plus extends plus extends'
		).to.be.deep.equals({
			type: 'object',
			required: ['myNumber', 'myString', 'myBoolean'],
			properties: {
				myNumber: {
					type: 'number',
				},
				myString: {
					type: 'string',
				},
				myBoolean: {
					type: 'boolean',
				},
			},
		})

		done()
	})

	//
	it('schema with prop with properties', (done) => {
		@schema()
		class TestSchema17 {
			@prop()
			myNumber!: number
		}

		expect(use(TestSchema17)).to.deep.contains({
			type: 'object',
			required: ['myNumber'],
			properties: {
				myNumber: {
					type: 'number',
				},
			},
		})

		done()
	})

	//
	it('schema with additional properties', (done) => {
		class TestSchema18AdditionalProps {
			@prop()
			myNumber!: number

			@prop()
			myString!: string
		}

		@schema()
		class TestSchema18 {
			@additionalProps(TestSchema18AdditionalProps)
			myAdditionalProps!: Record<string, TestSchema18AdditionalProps>
		}
		expect(use(TestSchema18)).to.deep.contains({
			type: 'object',
			required: ['myAdditionalProps'],
			properties: {
				myAdditionalProps: {
					type: 'object',
					additionalProperties: {
						myNumber: {
							type: 'number',
						},
						myString: {
							type: 'string',
						},
					},
				},
			},
		})

		done()
	})
})
