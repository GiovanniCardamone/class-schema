import { expect } from 'chai'
import 'reflect-metadata'
import { prop, ref, array, enums } from '../src/property'
import schema from '../src/schema'
import use from '../src/use'

describe('schema', () => {
	//
	it('use schema should fail on non-schema class', (done) => {
		expect(() => {
			class TestSchema0 {}
			use(TestSchema0)
		}).to.throw(TypeError)

		done()
	})

	//
	it('basic schema with title', (done) => {
		@schema({ title: 'TestSchema1' })
		class TestSchema1 {}

		expect(use(TestSchema1)).to.deep.contains({
			type: 'object',
			title: 'TestSchema1',
		})

		done()
	})

	//
	it('basic schema with property', (done) => {
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
	it('basic schema with optional property', (done) => {
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
	it('basic schema with multiple property', (done) => {
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
	it('basic schema with custom object property', (done) => {
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
	it('basic schema with multiple nested custom object property', (done) => {
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
	it('basic schema with custom array object property', (done) => {
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
	it('basic schema with object property with array props', (done) => {
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
	it('basic schema with object property with array object', (done) => {
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
	it('enum property', (done) => {
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
	it('date prop', (done) => {
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
})
