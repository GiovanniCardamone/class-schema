# class-schema

![Logo](media/images/banner.png)

<div align="center">

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge&logo=Typescript)

[![CI](https://github.com/GiovanniCardamone/class-schema/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/GiovanniCardamone/class-schema/actions/workflows/npm-ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/GiovanniCardamone/class-schema/badge.svg?branch=main)](https://coveralls.io/github/GiovanniCardamone/class-schema?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/class-schema/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/class-schema)
[![NPM version](https://img.shields.io/npm/v/class-schema.svg?style=plastic)](https://www.npmjs.com/package/class-schema)
[![NPM downloads](https://img.shields.io/npm/dm/class-schema.svg?style=plastic)](https://www.npmjs.com/package/class-schema)

</div>

class-schema is a library intended to extract from javascript class, the corrispondent [JSON Schema](https://json-schema.org/), usually, the schema is written by hand or throught some tool that create the schema.
but, with this library you can extract the schema directly from the class you defined, so you have a single source of truth of the schema [SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth) that is your class.

## :package: Installation

```bash
  npm install class-schema
```

## :rocket: Usage

to use `class-schema` you also need the package `reflect-metadata`

```bash
  npm install reflect-metadata
```

than you need to enable `experimentalDecorators` and `emitDecoratorMetadata` in your `tsconfig.json` if you are using typescript

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

in the index of your project you have to import `reflect-metadata`

```typescript
import 'reflect-metadata'
```

and you are ready to go!

## :chart_with_upwards_trend: Examples

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

## :toolbox: Summary

### :arrow_forward: use

## :books: Documentation

[Full Documentation](https://giovannicardam.one/class-schema)

## :label: License

[MIT](https://github.com/GiovanniCardamone/class-schema/blob/main/LICENSE)
