# With

All top-level EdgeQL statements (select, insert, update, and delete) can be prefixed by a with block. These blocks contain declarations of standalone expressions that can be used in your query.

```edgeql-repl
db> with my_str := "hello world"
... select str_title(my_str);
{'Hello World'}
```

The with clause can contain more than one variable. Earlier variables can be referenced by later ones. Taken together, it becomes possible to write “script-like” queries that execute several statements in sequence.

```edgeql-repl
db> with a := 5,
...   b := 2,
...   c := a ^ b
... select c;
{25}
```

## Subqueries

There’s no limit to the complexity of computed expressions. EdgeQL is fully composable; queries can simply be embedded inside each other. The following query fetches a list of all movies featuring at least one of the original six Avengers.

```edgeql-repl
db> with avengers := (select Hero filter .name in {
...     'Iron Man',
...     'Black Widow',
...     'Captain America',
...     'Thor',
...     'Hawkeye',
...     'The Hulk'
...   })
... select Movie {title}
... filter avengers in .characters;
{

  default::Movie {title: 'Iron Man'},
  default::Movie {title: 'The Incredible Hulk'},
  default::Movie {title: 'Iron Man 2'},
  default::Movie {title: 'Thor'},
  default::Movie {title: 'Captain America: The First Avenger'},
  ...
}
```

## Query parameters

A common use case for with clauses is the initialization of query parameters.

```edgeql
with user_id := <uuid>$user_id
select User { name }
filter .id = user_id;
```

For a full reference on using query parameters, see EdgeQL > Parameters.

## Module alias

Another use of with is to provide aliases for modules. This can be useful for long queries which reuse many objects or functions from the same module.

```edgeql
with http as module std::net::http
select http::ScheduledRequest
filter .method = http::Method.POST;
```

If the aliased module does not exist at the top level, but does exists as a part of the std module, that will be used automatically.

```edgeql
with http as module net::http # <- omitting std
select http::ScheduledRequest
filter .method = http::Method.POST;
```

## Module selection

By default, the active module is default, so all schema objects inside this module can be referenced by their short name, e.g. User, BlogPost, etc. To reference objects in other modules, we must use fully-qualified names (default::Hero).

However, with clauses also provide a mechanism for changing the active module on a per-query basis.

```edgeql-repl
db> with module schema
... select ObjectType;
```

This with module clause changes the default module to schema, so we can refer to schema::ObjectType (a built-in Gel type) as simply ObjectType.

As with module aliases, if the active module does not exist at the top level, but does exist as part of the std module, that will be used automatically.

```edgeql-repl
db> with module math select abs(-1);
{1}
```

| --- |
| See also |
| Reference > Commands > With |

