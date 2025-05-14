# Tuples

A tuple type is a heterogeneous sequence of other types. Tuples can be either named or unnamed (the default).

## Constructing tuples

A tuple constructor is an expression that consists of a sequence of comma-separated expressions enclosed in parentheses.  It produces a tuple value:

```edgeql-synopsis
"(" <expr> [, ... ] ")"
```

Declare a named tuple:

```edgeql-synopsis
"(" <identifier> := <expr> [, ... ] ")"
```

All elements in a named tuple must have a name.

A tuple constructor automatically creates a corresponding tuple type.

## Accessing elements

An element of a tuple can be referenced in the form:

```edgeql-synopsis
<expr>.<element-index>
```

Here, <expr> is any expression that has a tuple type, and <element-index> is either the zero-based index of the element or the name of an element in a named tuple.

Examples:

```edgeql-repl
db> select (1, 'Gel').0;
{1}

db> select (number := 1, name := 'Gel').name;
{"Gel"}

db> select (number := 1, name := 'Gel').1;
{"Gel"}
```

## Nesting tuples

Tuples can be nested:

```edgeql-repl
db> select (nested_tuple := (1, 2)).nested_tuple.0;
{1}
```

Referencing a non-existent tuple element will result in an error:

```edgeql-repl
db> select (1, 2).5;
EdgeQLError: 5 is not a member of a tuple

---- query context ----

    line 1
        > select (1, 2).3;
```

## Type syntax

A tuple type can be explicitly declared in an expression or schema declaration using the following syntax:

```edgeql-synopsis
tuple "<" <element-type>, [<element-type>, ...] ">"
```

A named tuple:

```edgeql-synopsis
tuple "<" <element-name> : <element-type> [, ... ] ">"
```

Any type can be used as a tuple element type.

Here’s an example of using this syntax in a schema definition:

```sdl
type GameElement {
    required name: str;
    required position: tuple<x: int64, y: int64>;
}
```

Here’s a few examples of using tuple types in EdgeQL queries:

```edgeql-repl
db> select <tuple<int64, str>>('1', 3);
{(1, '3')}
db> select <tuple<x: int64, y: int64>>(1, 2);
{(x := 1, y := 2)}
db> select (1, '3') is (tuple<int64, str>);
{true}
db> select ([1, 2], 'a') is (tuple<array<int64>, str>);
{true}
```

Type: type
Domain: eql
Summary: A tuple type is a heterogeneous sequence of other types.
Signature: type tuple


A tuple type is a heterogeneous sequence of other types.

Tuple elements can optionally have names, in which case the tuple is called a named tuple.

Any type can be used as a tuple element type.

A tuple type is created implicitly when a tuple constructor is used:

```edgeql-repl
db> select ('foo', 42);
{('foo', 42)}
```

Two tuples are equal if all of their elements are equal and in the same order.  Note that element names in named tuples are not significant for comparison:

```edgeql-repl
db> select (1, 2, 3) = (a := 1, b := 2, c := 3);
{true}
```

The syntax of a tuple type declaration can be found in this section.

