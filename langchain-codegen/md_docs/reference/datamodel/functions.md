# Functions

This page documents how to define custom functions, however Gel provides a large library of built-in functions and operators. These are documented in Standard Library.

## User-defined Functions

Gel allows you to define custom functions. For example, consider a function that adds an exclamation mark '!' at the end of the string:

```sdl
function exclamation(word: str) -> str
  using (word ++ '!');
```

This function accepts a str as an argument and produces a str as output as well.

```edgeql-repl
test> select exclamation({'Hello', 'World'});
{'Hello!', 'World!'}
```

## Sets as arguments

Calling a user-defined function on a set will always apply it as *element-wise*.

```sdl
function magnitude(x: float64) -> float64
  using (
    math::sqrt(sum(x * x))
  );
```

```edgeql-repl
db> select magnitude({3, 4});
{3, 4}
```

In order to pass in multiple arguments at once, arguments should be packed into arrays:

```sdl
function magnitude(xs: array<float64>) -> float64
  using (
    with x := array_unpack(xs)
    select math::sqrt(sum(x * x))
  );
```

```edgeql-repl
db> select magnitude([3, 4]);
{5}
```

Multiple packed arrays can be passed into such a function, which will then be applied element-wise.

```edgeql-repl
db> select magnitude({[3, 4], [5, 12]});
{5, 13}
```

## Modifying Functions

User-defined functions can contain DML (i.e., insert, update, delete) to make changes to existing data. These functions have a modifying volatility.

```sdl
function add_user(name: str) -> User
  using (
    insert User {
      name := name,
      joined_at := std::datetime_current(),
    }
  );
```

```edgeql-repl
db> select add_user('Jan') {name, joined_at};
{default::User {name: 'Jan', joined_at: <datetime>'2024-12-11T11:49:47Z'}}
```

Unlike other functions, the arguments of modifying functions must have a cardinality of One.

```edgeql-repl
db> select add_user({'Feb','Mar'});
gel error: QueryError: possibly more than one element passed into
modifying function
db> select add_user(<str>{});
gel error: QueryError: possibly an empty set passed as non-optional
argument into modifying function
```

Optional arguments can still accept empty sets. For example, if add_user was defined as:

```sdl
function add_user(name: str, joined_at: optional datetime) -> User
  using (
    insert User {
      name := name,
      joined_at := joined_at ?? std::datetime_current(),
    }
  );
```

then the following queries are valid:

```edgeql-repl
db> select add_user('Apr', <datetime>{}) {name, joined_at};
{default::User {name: 'Apr', joined_at: <datetime>'2024-12-11T11:50:51Z'}}
db> select add_user('May', <datetime>'2024-12-11T12:00:00-07:00') {name, joined_at};
{default::User {name: 'May', joined_at: <datetime>'2024-12-11T12:00:00Z'}}
```

In order to insert or update a multi parameter, the desired arguments should be aggregated into an array as described above:

```sdl
function add_user(name: str, nicknames: array<str>) -> User
  using (
    insert User {
      name := name,
      nicknames := array_unpack(nicknames),
    }
  );
```

## Declaring functions

This section describes the syntax to declare a function in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping functions. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

