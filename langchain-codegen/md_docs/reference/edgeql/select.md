# Select

The select command retrieves or computes a set of values. We’ve already seen simple queries that select primitive values.

```edgeql-repl
db> select 'hello world';
{'hello world'}
db> select [1, 2, 3];
{[1, 2, 3]}
db> select {1, 2, 3};
{1, 2, 3}
```

With the help of a with block, we can add filters, ordering, and pagination clauses.

```edgeql-repl
db> with x := {1, 2, 3, 4, 5}
... select x
... filter x >= 3;
{3, 4, 5}
db> with x := {1, 2, 3, 4, 5}
... select x
... order by x desc;
{5, 4, 3, 2, 1}
db> with x := {1, 2, 3, 4, 5}
... select x
... offset 1 limit 3;
{2, 3, 4}
```

These queries can also be rewritten to use inline aliases, like so:

```edgeql-repl
db> select x := {1, 2, 3, 4, 5}
... filter x >= 3;
```

## Selecting objects

However most queries are selecting objects that live in the database. For demonstration purposes, the queries below assume the following schema:

```sdl
module default {
  abstract type Person {
    required name: str { constraint exclusive };
  }

  type Hero extending Person {
    secret_identity: str;
    multi villains := .<nemesis[is Villain];
  }

  type Villain extending Person {
    nemesis: Hero;
  }

  type Movie {
    required title: str { constraint exclusive };
    required release_year: int64;
    multi characters: Person;
  }
}
```

And the following inserts:

```edgeql-repl
db> insert Hero {
...   name := "Spider-Man",
...   secret_identity := "Peter Parker"
... };
{default::Hero {id: 6be1c9c6...}}

db> insert Hero {
...   name := "Iron Man",
...   secret_identity := "Tony Stark"
... };
{default::Hero {id: 6bf7115a... }}

db> for n in { "Sandman", "Electro", "Green Goblin", "Doc Ock" }
...   union (
...     insert Villain {
...     name := n,
...     nemesis := (select Hero filter .name = "Spider-Man")
...  });
{
  default::Villain {id: 6c22bdf0...},
  default::Villain {id: 6c22c3d6...},
  default::Villain {id: 6c22c46c...},
  default::Villain {id: 6c22c502...},
}

db> insert Villain {
...   name := "Obadiah Stane",
...   nemesis := (select Hero filter .name = "Iron Man")
... };
{default::Villain {id: 6c42c4ec...}}

db> insert Movie {
...  title := "Spider-Man: No Way Home",
...  release_year := 2021,
...  characters := (select Person filter .name in
...    { "Spider-Man", "Sandman", "Electro", "Green Goblin", "Doc Ock" })
...  };
{default::Movie {id: 6c60c28a...}}

db> insert Movie {
...  title := "Iron Man",
...  release_year := 2008,
...  characters := (select Person filter .name in
...   { "Iron Man", "Obadiah Stane" })
...  };
{default::Movie {id: 6d1f430e...}}
```

Let’s start by selecting all Villain objects in the database. In this example, there are only five. Remember, Villain is a reference to the set of all Villain objects.

```edgeql-repl
db> select Villain;
{
  default::Villain {id: 6c22bdf0...},
  default::Villain {id: 6c22c3d6...},
  default::Villain {id: 6c22c46c...},
  default::Villain {id: 6c22c502...},
  default::Villain {id: 6c42c4ec...},
}
```

For the sake of readability, the id values have been truncated.

By default, this only returns the id of each object. If serialized to JSON, this result would look like this:

```default
[
  {"id": "6c22bdf0-5c03-11ee-99ff-dfaea4d947ce"},
  {"id": "6c22c3d6-5c03-11ee-99ff-734255881e5d"},
  {"id": "6c22c46c-5c03-11ee-99ff-c79f24cf638b"},
  {"id": "6c22c502-5c03-11ee-99ff-cbacc3918129"},
  {"id": "6c42c4ec-5c03-11ee-99ff-872c9906a467"}
]
```

## Shapes

To specify which properties to select, we attach a shape to Villain. A shape can be attached to any object type expression in EdgeQL.

```edgeql-repl
db> select Villain { id, name };
{
  default::Villain {id: 6c22bdf0..., name: 'Sandman'},
  default::Villain {id: 6c22c3d6..., name: 'Electro'},
  default::Villain {id: 6c22c46c..., name: 'Green Goblin'},
  default::Villain {id: 6c22c502..., name: 'Doc Ock'},
  default::Villain {id: 6c42c4ec..., name: 'Obadiah Stane'},
}
```

## Filtering

To filter the set of selected objects, use a filter <expr> clause. The <expr> that follows the filter keyword can be any boolean expression.

To reference the name property of the Villain objects being selected, we use Villain.name.

```edgeql-repl
db> select Villain {id, name}
... filter Villain.name = "Doc Ock";
{default::Villain {id: 6c22c502..., name: 'Doc Ock'}}
```

This query contains two occurrences of Villain. The first (outer) is passed as the argument to select and refers to the set of all Villain objects. However the inner occurrence is inside the scope of the select statement and refers to the object being selected.

However, this looks a little clunky, so EdgeQL provides a shorthand: just drop Villain entirely and simply use .name. Since we are selecting a set of Villains, it’s clear from context that .name must refer to a link/property of the Villain type. In other words, we are in the scope of the Villain type.

```edgeql-repl
db> select Villain {name}
... filter .name = "Doc Ock";
{default::Villain {name: 'Doc Ock'}}
```

## Ordering

Order the result of a query with an order by clause.

```edgeql-repl
db> select Villain { name }
... order by .name;
{
  default::Villain {name: 'Doc Ock'},
  default::Villain {name: 'Electro'},
  default::Villain {name: 'Green Goblin'},
  default::Villain {name: 'Obadiah Stane'},
  default::Villain {name: 'Sandman'},
}
```

The expression provided to order by may be any singleton expression, primitive or otherwise.

In Gel all values are orderable. Objects are compared using their id; tuples and arrays are compared element-by-element from left to right. By extension, the generic comparison operators =, <, >, etc. can be used with any two expressions of the same type.

You can also order by multiple expressions and specify the direction with an asc (default) or desc modifier.

When ordering by multiple expressions, arrays, or tuples, the leftmost expression/element is compared. If these elements are the same, the next element is used to “break the tie”, and so on. If all elements are the same, the order is not well defined.

```edgeql-repl
db> select Movie { title, release_year }
... order by
...   .release_year desc then
...   str_trim(.title) desc;
{
  default::Movie {title: 'Spider-Man: No Way Home', release_year: 2021},
  ...
  default::Movie {title: 'Iron Man', release_year: 2008},
}
```

When ordering by multiple expressions, each expression is separated with the then keyword. For a full reference on ordering, including how empty values are handled, see Reference > Commands > Select.

## Pagination

Gel supports limit and offset clauses. These are typically used in conjunction with order by to maintain a consistent ordering across pagination queries.

```edgeql-repl
db> select Villain { name }
... order by .name
... offset 2
... limit 2;
{
  default::Villain {name: 'Obadiah Stane'},
  default::Villain {name: 'Sandman'},
}
```

The expressions passed to limit and offset can be any singleton int64 expression. This query fetches all Villains except the last (sorted by name).

```edgeql-repl
db> select Villain {name}
... order by .name
... limit count(Villain) - 1;
{
  default::Villain {name: 'Doc Ock'},
  default::Villain {name: 'Electro'},
  default::Villain {name: 'Green Goblin'},
  default::Villain {name: 'Obadiah Stane'}, # no Sandman
}
```

You may pass the empty set to limit or offset. Passing the empty set is effectively the same as excluding limit or offset from your query (i.e., no limit or no offset). This is useful if you need to parameterize limit and/or offset but may still need to execute your query without providing one or the other.

```edgeql-repl
db> select Villain {name}
... order by .name
... offset <optional int64>$offset
... limit <optional int64>$limit;
Parameter <int64>$offset (Ctrl+D for empty set `{}`):
Parameter <int64>$limit (Ctrl+D for empty set `{}`):
{
  default::Villain {name: 'Doc Ock'},
  default::Villain {name: 'Electro'},
  ...
}
```

If you parameterize limit and offset and want to reserve the option to pass the empty set, make sure those parameters are optional as shown in the example above.

## Computed fields

Shapes can contain computed fields. These are EdgeQL expressions that are computed on the fly during the execution of the query. As with other clauses, we can use leading dot notation (e.g. .name) to refer to the properties and links of the object type currently in scope.

```edgeql-repl
db> select Villain {
...   name,
...   name_upper := str_upper(.name)
... };
{
  default::Villain {
    id: 6c22bdf0...,
    name: 'Sandman',
    name_upper: 'SANDMAN',
  },
  ...
}
```

As with nested filters, the current scope changes inside nested shapes.

```edgeql-repl
db> select Villain {
...   id,
...   name,
...   name_upper := str_upper(.name),
...   nemesis: {
...     secret_identity,
...     real_name_upper := str_upper(.secret_identity)
...   }
... };
{
  default::Villain {
    id: 6c22bdf0...,
    name: 'Sandman',
    name_upper: 'SANDMAN',
    nemesis: default::Hero {
      secret_identity: 'Peter Parker',
      real_name_upper: 'PETER PARKER',
    },
  },
  ...
}
```

## Backlinks

Fetching backlinks is a common use case for computed fields. To demonstrate this, let’s fetch a list of all movies starring a particular Hero.

```edgeql-repl
db> select Hero {
...   name,
...   movies := .<characters[is Movie] { title }
... } filter .name = "Iron Man";
{
  default::Hero {
    name: 'Iron Man',
    movies: {
      default::Movie {title: 'Iron Man'}
    },
  },
}
```

The computed backlink movies is a combination of the backlink operator .< and a type intersection [is Movie]. For a full reference on backlink syntax, see EdgeQL > Paths.

Instead of re-declaring backlinks inside every query where they’re needed, it’s common to add them directly into your schema as computed links.

```sdl-diff
  abstract type Person {
    required name: str {
      constraint exclusive;
    };
+   multi movies := .<characters[is Movie]
  }
```

In the example above, the Person.movies is a multi link. Including these keywords is optional, since Gel can infer this from the assigned expression .<characters[is Movie]. However, it’s a good practice to include the explicit keywords to make the schema more readable and “sanity check” the cardinality.

This simplifies future queries; Person.movies can now be traversed in shapes just like a non-computed link.

```edgeql
select Hero {
  name,
  movies: { title }
} filter .name = "Iron Man";
```

## Subqueries

There’s no limit to the complexity of computed expressions. EdgeQL is designed to be fully composable; entire queries can be embedded inside each other. Below, we use a subquery to select all movies containing a villain’s nemesis.

```edgeql-repl
db> select Villain {
...   name,
...   nemesis_name := .nemesis.name,
...   movies_with_nemesis := (
...     select Movie { title }
...     filter Villain.nemesis in .characters
...   )
... };
{
  default::Villain {
    name: 'Sandman',
    nemesis_name: 'Spider-Man',
    movies_with_nemesis: {
      default::Movie {title: 'Spider-Man: No Way Home'}
    }
  },
  ...
}
```

## Polymorphic queries

All queries thus far have referenced concrete object types: Hero and Villain. However, both of these types extend the abstract type Person, from which they inherit the name property.

## Free objects

To select several values simultaneously, you can “bundle” them into a “free object”. Free objects are a set of key-value pairs that can contain any expression. Here, the term “free” is used to indicate that the object in question is not an instance of a particular object type; instead, it’s constructed ad hoc inside the query.

```edgeql-repl
db> select {
...   my_string := "This is a string",
...   my_number := 42,
...   several_numbers := {1, 2, 3},
...   all_heroes := Hero { name }
... };
{
  {
    my_string: 'This is a string',
    my_number: 42,
    several_numbers: {1, 2, 3},
    all_heroes: {
      default::Hero {name: 'Spider-Man'},
      default::Hero {name: 'Iron Man'},
    },
  },
}
```

Note that the result is a singleton but each key corresponds to a set of values, which may have any cardinality.

## With block

All top-level EdgeQL statements (select, insert, update, and delete) can be prefixed with a with block. These blocks let you declare standalone expressions that can be used in your query.

```edgeql-repl
db> with hero_name := "Iron Man"
... select Hero { secret_identity }
... filter .name = hero_name;
{default::Hero {secret_identity: 'Tony Stark'}}
```

For full documentation on with, see EdgeQL > With.

| --- |
| See also |
| Reference > Commands > Select |
| Cheatsheets > Selecting data |

