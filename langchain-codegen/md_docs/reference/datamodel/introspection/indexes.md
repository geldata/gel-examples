# Indexes

This section describes introspection of indexes.

Introspection of the schema::Index:

```edgeql-repl
db> with module schema
... select ObjectType {
...     name,
...     links: {
...         name,
...     },
...     properties: {
...         name,
...     }
... }
... filter .name = 'schema::Index';
{
    Object {
        name: 'schema::Index',
        links: {Object { name: '__type__' }},
        properties: {
            Object { name: 'expr' },
            Object { name: 'id' },
            Object { name: 'name' }
        }
    }
}
```

Consider the following schema:

```sdl
abstract type Addressable {
    property address: str;
}

type User extending Addressable {
    # define some properties and a link
    required property name: str;

    multi link friends: User;

    # define an index for User based on name
    index on (.name);
}
```

Introspection of User.name index:

```edgeql-repl
db> with module schema
... select Index {
...     expr,
... }
... filter .expr like '%.name';
{
    Object {
        expr: '.name'
    }
}
```

For introspection of the index within the context of its host type see object type introspection.

| --- |
| See also |
| Schema > Indexes |
| SDL > Indexes |
| DDL > Indexes |

