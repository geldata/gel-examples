# Enums

Type: type
Domain: eql
Summary: An enumerated type is a data type consisting of an ordered list of values.
Signature: type enum


An enumerated type is a data type consisting of an ordered list of values.

An enum type can be declared in a schema by using the following syntax:

```sdl
scalar type Color extending enum<Red, Green, Blue>;
```

Enum values can then be accessed directly:

```edgeql-repl
db> select Color.Red is Color;
{true}
```

Casting can be used to obtain an enum value in an expression:

```edgeql-repl
db> select 'Red' is Color;
{false}
db> select <Color>'Red' is Color;
{true}
db> select <Color>'Red' = Color.Red;
{true}
```

