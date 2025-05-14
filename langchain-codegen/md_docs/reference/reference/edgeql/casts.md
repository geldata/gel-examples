# Casts

There are different ways that casts appear in EdgeQL.

## Explicit Casts

A type cast expression converts the specified value to another value of the specified type:

```edgeql-synopsis
"<" <type> ">" <expression>
```

The <type> must be a valid type expression denoting a non-abstract scalar or a container type.

For example, the following expression casts an integer value into a string:

```edgeql-repl
db> select <str>10;
{"10"}
```

See the type cast operator section for more information on type casting rules.

You can cast a UUID into an object:

```edgeql-repl
db> select <Hero><uuid>'01d9cc22-b776-11ed-8bef-73f84c7e91e7';
{default::Hero {id: 01d9cc22-b776-11ed-8bef-73f84c7e91e7}}
```

If you try to cast a UUID that no object of the type has as its id property, you’ll get an error:

```edgeql-repl
db> select <Hero><uuid>'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
gel error: CardinalityViolationError: 'default::Hero' with id 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' does not exist
```

## Assignment Casts

Assignment casts happen when inserting new objects. Numeric types will often be automatically cast into the specific type corresponding to the property they are assigned to. This is to avoid extra typing when dealing with numeric value using fewer bits:

```edgeql
# Automatically cast a literal 42 (which is int64
# by default) into an int16 value.
insert MyObject {
    int16_val := 42
};
```

If assignment casting is supported for a given pair of types, explicit casting of those types is also supported.

## Implicit Casts

Implicit casts happen automatically whenever the value type doesn’t match the expected type in an expression. This is mostly supported for numeric casts that don’t incur any potential information loss (in form of truncation), so typically from a less precise type, to a more precise one. The int64 to float64 is a notable exception, which can suffer from truncation of significant digits for very large integer values. There are a few scenarios when implicit casts can occur:

If implicit casting is supported for a given pair of types, assignment and explicit casting of those types is also supported.

## Casting Table

The UUID-to-object cast is only available since EdgeDB 3.0+.

| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| from to | json | str | float32 | float64 | int16 | int32 | int64 | bigint | decimal | bool | bytes | uuid | datetime | duration | local_date | local_datetime | local_time | relative_duration | date_duration | enum | object |
| json |  | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> | <> |  |
| str | <> |  | <> | <> | <> | <> | <> | <> | <> | <> |  | <> | <> | <> | <> | <> | <> | <> | <> | := |  |
| float32 | <> | <> |  | impl | <>* | <>* | <>* | <>* | <> |  |  |  |  |  |  |  |  |  |  |  |  |
| float64 | <> | <> | := |  | <>* | <>* | <>* | <>* | <> |  |  |  |  |  |  |  |  |  |  |  |  |
| int16 | <> | <> | impl | impl |  | impl | impl | impl | impl |  |  |  |  |  |  |  |  |  |  |  |  |
| int32 | <> | <> |  | impl | <> |  | impl | impl | impl |  |  |  |  |  |  |  |  |  |  |  |  |
| int64 | <> | <> | := | impl | := | := |  | impl | impl |  |  |  |  |  |  |  |  |  |  |  |  |
| bigint |  |  |  |  |  |  |  |  | impl |  |  |  |  |  |  |  |  |  |  |  |  |
| decimal | <> | <> | <> | <> | <> | <> | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |
| bool | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| bytes | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| uuid | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | <> |
| datetime | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| duration | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | <> |  |  |  |
| local_date | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  | impl |  |  |  |  |  |
| local_datetime | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  | <> |  | <> |  |  |  |  |
| local_time | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| relative_duration | <> | <> |  |  |  |  |  |  |  |  |  |  |  | <> |  |  |  |  | <> |  |  |
| date_duration | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | impl |  |  |  |
| enum | <> | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| object | <> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

