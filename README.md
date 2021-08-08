# class-schema

[![CI](https://github.com/GiovanniCardamone/class-schema/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/GiovanniCardamone/class-schema/actions/workflows/npm-ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/GiovanniCardamone/class-schema/badge.svg?branch=main)](https://coveralls.io/github/GiovanniCardamone/class-schema?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/class-schema/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/class-schema)
[![NPM version](https://img.shields.io/npm/v/class-schema.svg?style=plastic)](https://www.npmjs.com/package/class-schema)
[![NPM downloads](https://img.shields.io/npm/dm/class-schema.svg?style=plastic)](https://www.npmjs.com/package/class-schema)

Javascript / Typescript utility to convert class into Json Schema

## Documentation

[Documentation](https://giovannicardam.one/class-schema)

## Installation

```bash
  npm install class-schema
```

also the package `reflect-metadata` is required

```bash
  npm install reflect-metadata
```

## Usage

`experimentalDecorators` and `emitDecoratorMetadata` flags must be enabled in typescript compiler

> file: tsconfig.json

```json
{
  "compilerOptions": {
    // others config in your project
    "target": "esnext" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */,
    "experimentalDecorators": true /* Enables experimental support for ES7 decorators. */,
    "emitDecoratorMetadata": true /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

in the index of your project `reflect-metadata` must be imported before any Usage

> file: index.ts

```typescript
import 'reflect-metadata'
```

```typescript
import { use, schema, prop, ref, enums } from 'class-schema'

const vowels = ['a', 'e', 'i', 'o', 'u', 'y']
type Vowels = typeof vowels[number]

@schema()
class MyObject {
  @enums(vowels)
  myEnum: Vowels
}

@schema()
class MySchema {
  @prop()
  myProp: number

  @array()
  @prop(Number)
  myPropArray: number[]

  @ref(MyObject)
  myObject: MyObject
}
```

> to get javascript object that represent jsonschema of class `use(MySchema)`

```json5
// output of `JSON.stringify(use(MySchema))
{
  type: 'object',
  properties: {
    myProp: {
      type: 'number',
    },
    myPropArray: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    myObject: {
      type: 'object',
      properties: {
        myEnum: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['a', 'e', 'i', 'o', 'u', 'y'],
          },
        },
      },
      required: ['myEnum'],
    },
  },
  required: ['myProp', 'myPropArray', 'myObject'],
}
```

## License

[MIT](https://github.com/GiovanniCardamone/class-schema/blob/main/LICENSE)
