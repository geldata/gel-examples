# Basics

For the purposes of this section, we will consider a default module containing the following schema:

```sdl
type Author {
    name: str;
}

type Book {
    # to make the examples simpler only the title is
    # a required property
    required title: str;
    synopsis: str;
    author: Author;
    isbn: str {
        constraint max_len_value(10);
    }
}
```

From the schema above, Gel will expose to GraphQL:

In addition to this, the Query will have two fields — Author, and Book — to query these types respectively.

## Queries

Consider this example:

| GraphQL | EdgeQL equivalent |
| --- | --- |
| {     Book {         title         synopsis         author {             name         }     } } | select     Book {         title,         synopsis,         author: {             name         }     }; |

The top-level field of the GraphQL query must be a valid name of an object type or an expression alias of something returning an object type. Nested fields must be valid links or properties.

There are some specific conventions as to how arguments in GraphQL queries are used to allow filtering, ordering, and paginating data.

