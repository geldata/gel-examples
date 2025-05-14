# Primitives

Gel has a robust type system consisting of primitive and object types. types. Primitive types are used to declare properties on object types, as query and function arguments, as as well as in other contexts.

## Built-in scalar types

Gel comes with a range of built-in scalar types, such as:

## Custom scalars

You can extend built-in scalars with additional constraints or annotations. Here’s an example of a non-negative custom int64 variant:

```sdl
scalar type posint64 extending int64 {
    constraint min_value(0);
}
```

## Enums

Enum types are created by extending the abstract enum type, e.g.:

```sdl
scalar type Color extending enum<Red, Green, Blue>;

type Shirt {
  color: Color;
}
```

which can be queries with:

```edgeql
select Shirt filter .color = Color.Red;
```

For a full reference on enum types, see the Enum docs.

## Arrays

Arrays store zero or more primitive values of the same type in an ordered list. Arrays cannot contain object types or other arrays, but can contain virtually any other type.

```sdl
type Person {
  str_array: array<str>;
  json_array: array<json>;
  tuple_array: array<tuple<float32, float32>>;

  # INVALID: arrays of object types not allowed:
  # friends: array<Person>

  # INVALID: arrays cannot be nested:
  # nested_array: array<array<str>>

  # VALID: arrays can contain tuples with arrays in them
  nested_array_via_tuple: array<tuple<array<str>>>
}
```

Array syntax in EdgeQL is very intuitive (indexing starts at 0):

```edgeql
select [1, 2, 3];
select [1, 2, 3][1] = 2;  # true
```

For a full reference on array types, see the Array docs.

## Tuples

Like arrays, tuples are ordered sequences of primitive data. Unlike arrays, each element of a tuple can have a distinct type. Tuple elements can be any type, including primitives, objects, arrays, and other tuples.

```sdl
type Person {
  unnamed_tuple: tuple<str, bool, int64>;
  nested_tuple: tuple<tuple<str, tuple<bool, int64>>>;
  tuple_of_arrays: tuple<array<str>, array<int64>>;
}
```

Optionally, you can assign a key to each element of the tuple. Tuples containing explicit keys are known as named tuples. You must assign keys to all elements (or none of them).

```sdl
type BlogPost {
  metadata: tuple<title: str, published: bool, upvotes: int64>;
}
```

Named and unnamed tuples are the same data structure under the hood. You can add, remove, and change keys in a tuple type after it’s been declared. For details, see Tuples.

When you query an unnamed tuple using one of EdgeQL’s client libraries, its value is converted to a list/array. When you fetch a named tuple, it is converted into an object/dictionary/hashmap depending on the language.

## Ranges

Ranges represent some interval of values. The intervals can be bound or unbound on either end. They can also be empty, containing no values. Only some scalar types have corresponding range types:

Example:

```sdl
type DieRoll {
  values: range<int64>;
}
```

For a full reference on ranges, functions and operators see the Range docs.

## Sequences

To represent an auto-incrementing integer property, declare a custom scalar that extends the abstract sequence type. Creating a sequence type initializes a global int64 counter that auto-increments whenever a new object is created. All properties that point to the same sequence type will share the counter.

```sdl
scalar type ticket_number extending sequence;
type Ticket {
  number: ticket_number;
  rendered_number := 'TICKET-\(.number)';
}
```

For a full reference on sequences, see the Sequence docs.

## Declaring scalars

This section describes the syntax to declare a custom scalar type in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping scalar types. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

