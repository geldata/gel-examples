# Declaring annotations

Use annotations to add descriptions to types and links:

```sdl
type Label {
    annotation description :=
        'Special label to stick on reviews';
    required comments: str;
    review: Review {
        annotation description :=
            'This review needs some attention';
    };
}

type Review {
    content: str;
}
```

Retrieving the annotations can be done via an introspection query:

```edgeql-repl
db> select introspect(Label) {
...     name,
...     annotations: {name, @value},
...     links: {name, annotations: {name, @value}}
... };
{
    schema::ObjectType {
        name: 'default::Label',
        annotations: {
            schema::Annotation {
                name: 'std::description',
                @value: 'Special label to stick on reviews'
            },
        },
        links: {
            schema::Link {
                name: '__type__',
                annotations: {}
            },
            schema::Link {
                name: 'review',
                annotations: {
                    schema::Annotation {
                        name: 'std::description',
                        @value: 'This review needs some attention',
                    },
                },
            },
        },
    },
}
```

Alternatively, the annotations can be viewed by the following REPL command:

```edgeql-repl
db> \d -v Label
type default::Label {
    annotation std::description := 'Special label to stick on reviews';
    required single link __type__: schema::ObjectType {
        readonly := true;
    };
    optional single link review: default::Review {
        annotation std::description := 'This review needs some attention';
    };
    required single property comments: std::str;
    required single property id: std::uuid {
        readonly := true;
        constraint std::exclusive;
    };
};
```

| --- |
| See also |
| Schema > Annotations |
| SDL > Annotations |
| DDL > Annotations |
| Introspection > Object types |

