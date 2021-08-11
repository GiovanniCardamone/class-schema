# class-schema

Javascript / Typescript class to JsonSchema

## Retrive Schema

## Decorators

### schema

`@schema` decorator is used to annotate a class as a schema

```typescript
import { schema } from 'class-schema'

@schema()
class MySchema {}
```

```json
{
  "type": "object"
}
```

---

JSON schema attributes can be added throught decorator

```typescript
import { schema } from 'class-schema'

@schema({ title: 'MySchema', description: 'just an object' })
class MySchema {}
```

```json
{
  "title": "MySchema",
  "description": "just an object",
  "type": "object"
}
```

---

### prop

`@prop` decorator is used to annotate prop of schema

```typescript
import { schema, prop } from 'class-schema'

@schema()
class MySchema {
  @prop()
  myProp!: string
}
```

```json
{
  "type": "object",
  "required": ["myProp"],
  "properties": {
    "myProp": {
      "type": "string"
    }
  }
}
```

---

optional prop can be setted using `@prop` parameter

```typescript
import { schema, prop } from 'class-schema'

@schema({ required: false })
class MySchema {
  @prop()
  myProp!: string
}
```

```json
{
  "type": "object",
  "required": [],
  "properties": {
    "myProp": {
      "type": "string"
    }
  }
}
```

---

JSON schema attributes can be added throught decorator

```typescript
import { schema, prop } from 'class-schema'

@schema()
class MySchema {
  @prop({ properties: { description: 'just a string' } })
  myProp!: string
}
```

```json
{
  "type": "object",
  "required": ["myProp"],
  "properties": {
    "myProp": {
      "description": "just a string",
      "type": "string"
    }
  }
}
```

---

### ref

---

### enums

---

## Inheritance

---
