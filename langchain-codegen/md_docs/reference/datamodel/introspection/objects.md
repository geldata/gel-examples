# Object types

This section describes introspection of object types.

Introspection of the schema::ObjectType:

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
... filter .name = 'schema::ObjectType';
{
    Object {
        name: 'schema::ObjectType',
        links: {
            Object { name: '__type__' },
            Object { name: 'annotations' },
            Object { name: 'bases' },
            Object { name: 'constraints' },
            Object { name: 'indexes' },
            Object { name: 'links' },
            Object { name: 'ancestors' },
            Object { name: 'pointers' },
            Object { name: 'properties' }
        },
        properties: {
            Object { name: 'id' },
            Object { name: 'abstract' },
            Object { name: 'name' }
        }
    }
}
```

Consider the following schema:

```sdl
abstract type Addressable {
    address: str;
}

type User extending Addressable {
    # define some properties and a link
    required name: str;

    multi friends: User;

    # define an index for User based on name
    index on (.name);
}
```

Introspection of User:

```edgeql-repl
db> with module schema
... select ObjectType {
...     name,
...     abstract,
...     bases: { name },
...     ancestors: { name },
...     annotations: { name, @value },
...     links: {
...         name,
...         cardinality,
...         required,
...         target: { name },
...     },
...     properties: {
...         name,
...         cardinality,
...         required,
...         target: { name },
...     },
...     constraints: { name },
...     indexes: { expr },
... }
... filter .name = 'default::User';
{
    Object {
        name: 'default::User',
        abstract: false,
        bases: {Object { name: 'default::Addressable' }},
        ancestors: {
            Object { name: 'std::BaseObject' },
            Object { name: 'std::Object' },
            Object { name: 'default::Addressable' }
        },
        annotations: {},
        links: {
            Object {
                name: '__type__',
                cardinality: 'One',
                required: {},
                target: Object { name: 'schema::Type' }
            },
            Object {
                name: 'friends',
                cardinality: 'Many',
                required: false,
                target: Object { name: 'default::User' }
            }
        },
        properties: {
            Object {
                name: 'address',
                cardinality: 'One',
                required: false,
                target: Object { name: 'std::str' }
            },
            Object {
                name: 'id',
                cardinality: 'One',
                required: true,
                target: Object { name: 'std::uuid' }
            },
            Object {
                name: 'name',
                cardinality: 'One',
                required: true,
                target: Object { name: 'std::str' }
            }
        },
        constraints: {},
        indexes: {
            Object {
                expr: '.name'
            }
        }
    }
}
```

| --- |
| See also |
| Schema > Object types |
| SDL > Object types |
| DDL > Object types |
| Cheatsheets > Object types |

