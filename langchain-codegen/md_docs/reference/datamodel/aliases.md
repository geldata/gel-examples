# Aliases

You can think of aliases as a way to give schema names to arbitrary EdgeQL expressions. You can later refer to aliases in queries and in other aliases.

Aliases are functionally equivalent to expression aliases defined in EdgeQL statements in with block, but are available to all queries using the schema and can be introspected.

Like computed properties, the aliased expression is evaluated on the fly whenever the alias is referenced.

## Scalar alias

```sdl
# in your schema:
alias digits := {0,1,2,3,4,5,6,7,8,9};
```

Later, in some query:

```edgeql
select count(digits);
```

## Object type alias

The name of a given object type (e.g. User) is itself a pointer to the set of all User objects. After declaring the alias below, you can use User and UserAlias interchangeably:

```sdl
alias UserAlias := User;
```

## Object type alias with computeds

Object type aliases can include a shape that declares additional computed properties or links:

```sdl
type Post {
  required title: str;
}

alias PostWithTrimmedTitle := Post {
  trimmed_title := str_trim(.title)
}
```

Later, in some query:

```edgeql
select PostWithTrimmedTitle {
  trimmed_title
};
```

## Arbitrary expressions

Aliases can correspond to any arbitrary EdgeQL expression, including entire queries.

```sdl
# Tuple alias
alias Color := ("Purple", 128, 0, 128);

# Named tuple alias
alias GameInfo := (
  name := "Li Europan Lingues",
  country := "Iceland",
  date_published := 2023,
  creators := (
    (name := "Bob Bobson", age := 20),
    (name := "Trina Trinadóttir", age := 25),
  ),
);

type BlogPost {
  required title: str;
  required is_published: bool;
}

# Query alias
alias PublishedPosts := (
  select BlogPost
  filter .is_published = true
);
```

All aliases are reflected in the database’s built-in GraphQL schema.

## Defining aliases

## DDL commands

This section describes the low-level DDL commands for creating and dropping aliases. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

