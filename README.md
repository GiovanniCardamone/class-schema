
# class-schema

Javascript / Typescript utility to convert class into Json Schema

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

## Documentation

[Documentation](https://giovannicardam.one/class-schema)

## License

[MIT](https://github.com/GiovanniCardamone/class-schema/blob/main/LICENSE)
