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

```json5
{
  "compilerOptions": {
    // others config in your project
    "experimentalDecorators": true, /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true, /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

in the index of your project `reflect-metadata` must be imported before any Usage

> file: index.ts

```typescript
import 'reflect-metadata'
```

```typescript
import { use, schema, prop } from 'class-schema'

@schema()
class MySchema {

  @prop()
  myProp: number
}

console.log(use(MySchema))

//  {
//    type: 'object',
//    required: ['myProp'],
//    properties: {
//      myProp: {
//        type: 'number'
//      }
//  }
```

## License

[MIT](https://github.com/GiovanniCardamone/class-schema/blob/main/LICENSE)
