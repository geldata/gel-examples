# Triggers

This section describes introspection of triggers.

Introspection of schema::Trigger:

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
... } filter .name = 'schema::Trigger';
{
  schema::ObjectType {
    name: 'schema::Trigger',
    links: {
      schema::Link {name: 'subject'},
      schema::Link {name: '__type__'},
      schema::Link {name: 'ancestors'},
      schema::Link {name: 'bases'},
      schema::Link {name: 'annotations'}
    },
    properties: {
      schema::Property {name: 'inherited_fields'},
      schema::Property {name: 'computed_fields'},
      schema::Property {name: 'builtin'},
      schema::Property {name: 'internal'},
      schema::Property {name: 'name'},
      schema::Property {name: 'id'},
      schema::Property {name: 'abstract'},
      schema::Property {name: 'is_abstract'},
      schema::Property {name: 'final'},
      schema::Property {name: 'is_final'},
      schema::Property {name: 'timing'},
      schema::Property {name: 'kinds'},
      schema::Property {name: 'scope'},
      schema::Property {name: 'expr'},
    },
  },
}
```

Introspection of a trigger named log_insert on the User type:

```edgeql-repl
db> with module schema
... select Trigger {
...   name,
...   kinds,
...   timing,
...   scope,
...   expr,
...   subject: {
...     name
...   }
... } filter .name = 'log_insert';
{
  schema::Trigger {
    name: 'log_insert',
    kinds: {Insert},
    timing: After,
    scope: Each,
    expr: 'insert default::Log { action := \'insert\', target_name := __new__.name }',
    subject: schema::ObjectType {name: 'default::User'},
  },
}
```

| --- |
| See also |
| Schema > Triggers |
| SDL > Triggers |
| DDL > Triggers |

