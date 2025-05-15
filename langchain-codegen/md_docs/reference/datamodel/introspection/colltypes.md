# Collection types

This section describes introspection of collection types.

## Array

Introspection of the schema::Array:

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
... filter .name = 'schema::Array';
{
    Object {
        name: 'schema::Array',
        links: {
            Object { name: '__type__' },
            Object { name: 'element_type' }
        },
        properties: {
            Object { name: 'id' },
            Object { name: 'name' }
        }
    }
}
```

For a type with an array property, consider the following:

```sdl
type User {
    required property name: str;
    property favorites: array<str>;
}
```

Introspection of the User with emphasis on properties:

```edgeql-repl
db> with module schema
... select ObjectType {
...     name,
...     properties: {
...         name,
...         target: {
...             name,
...             [is Array].element_type: { name },
...         },
...     },
... }
... filter .name = 'default::User';
{
    Object {
        name: 'default::User',
        properties: {
            Object {
                name: 'favorites',
                target: Object {
                    name: 'array',
                    element_type: Object { name: 'std::str' }
                }
            },
            ...
        }
    }
}
```

## Tuple

Introspection of the schema::Tuple:

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
... filter .name = 'schema::Tuple';
{
    Object {
        name: 'schema::Tuple',
        links: {
            Object { name: '__type__' },
            Object { name: 'element_types' }
        },
        properties: {
            Object { name: 'id' },
            Object { name: 'name' }
        }
    }
}
```

For example, below is an introspection of the return type of the sys::get_version() function:

```edgeql-repl
db> with module schema
... select `Function` {
...     return_type[is Tuple]: {
...         element_types: {
...             name,
...             type: { name }
...         } order by .num
...     }
... }
... filter .name = 'sys::get_version';
{
    Object {
        return_type: Object {
            element_types: {
                Object {
                    name: 'major',
                    type: Object {
                        name: 'std::int64'
                    }
                },
                Object {
                    name: 'minor',
                    type: Object {
                        name: 'std::int64'
                    }
                },
                Object {
                    name: 'stage',
                    type: Object {
                        name: 'sys::VersionStage'
                    }
                },
                Object {
                    name: 'stage_no',
                    type: Object {
                        name: 'std::int64'
                    }
                },
                Object {
                    name: 'local',
                    type: Object { name: 'array' }
                }
            }
        }
    }
}
```

