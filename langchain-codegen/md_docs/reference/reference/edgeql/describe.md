# Describe

describe – provide human-readable description of a schema or a schema object

```edgeql-synopsis
describe schema [ as {ddl | sdl | test [ verbose ]} ];

describe <schema-type> <name> [ as {ddl | sdl | text [ verbose ]} ];

# where <schema-type> is one of

  object
  annotation
  constraint
  function
  link
  module
  property
  scalar type
  type
```

## Description

describe generates a human-readable description of a schema object.

The output of a describe command is a str , although it cannot be used as an expression in queries.

There are three output formats to choose from:

When the describe command is used with the schema the result is a definition of the entire database schema. Only the as ddl option is available for schema description.

The describe command can specify the type of schema object that it should generate the description of:

## Examples

Consider the following schema:

```sdl
abstract type Named {
    required name: str {
        delegated constraint exclusive;
    }
}

type User extending Named {
    required email: str {
        annotation title := 'Contact email';
    }
}
```

Here are some examples of a describe command:

```edgeql-repl
db> describe object User;
{
    "create type default::User extending default::Named {
    create required single property email -> std::str {
        create annotation std::title := 'Contact email';
    };
};"
}
db> describe object User as sdl;
{
    "type default::User extending default::Named {
    required single property email -> std::str {
        annotation std::title := 'Contact email';
    };
};"
}
db> describe object User as text;
{
    'type default::User extending default::Named {
    required single link __type__ -> schema::Type {
        readonly := true;
    };
    required single property email -> std::str;
    required single property id -> std::uuid {
        readonly := true;
    };
    required single property name -> std::str;
};'
}
db> describe object User as text verbose;
{
    "type default::User extending default::Named {
    required single link __type__ -> schema::Type {
        readonly := true;
    };
    required single property email -> std::str {
        annotation std::title := 'Contact email';
    };
    required single property id -> std::uuid {
        readonly := true;
        constraint std::exclusive;
    };
    required single property name -> std::str {
        constraint std::exclusive;
    };
};"
}
db> describe schema;
{
    "create module default if not exists;
create abstract type default::Named {
    create required single property name -> std::str {
        create delegated constraint std::exclusive;
    };
};
create type default::User extending default::Named {
    create required single property email -> std::str {
        create annotation std::title := 'Contact email';
    };
};"
}
```

The describe command also warns you if there are standard library matches that are masked by some user-defined object. Consider the following schema:

```sdl
module default {
    function len(v: tuple<float64, float64>) -> float64 using (
        select (v.0 ^ 2 + v.1 ^ 2) ^ 0.5
    );
}
```

So within the default module the user-defined function len (computing the length of a vector) masks the built-ins:

```edgeql-repl
db> describe function len as text;
{
  'function default::len(v: tuple<std::float64, std::float64>) ->
std::float64 using (select
    (((v.0 ^ 2) + (v.1 ^ 2)) ^ 0.5)
);

# The following builtins are masked by the above:

# function std::len(array: array<anytype>) ->  std::int64 {
#     volatility := \'Immutable\';
#     annotation std::description := \'A polymorphic function to calculate
a "length" of its first argument.\';
#     using sql $$
#     SELECT cardinality("array")::bigint
#     $$
# ;};
# function std::len(bytes: std::bytes) ->  std::int64 {
#     volatility := \'Immutable\';
#     annotation std::description := \'A polymorphic function to calculate
a "length" of its first argument.\';
#     using sql $$
#     SELECT length("bytes")::bigint
#     $$
# ;};
# function std::len(str: std::str) ->  std::int64 {
#     volatility := \'Immutable\';
#     annotation std::description := \'A polymorphic function to calculate
a "length" of its first argument.\';
#     using sql $$
#     SELECT char_length("str")::bigint
#     $$
# ;};',
}
```

