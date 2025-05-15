# Deleting data

The types used in these queries are defined here.

Delete all reviews from a specific user:

```edgeql
delete Review
filter .author.name = 'trouble2020'
```

Alternative way to delete all reviews from a specific user:

```edgeql
delete (
    select User
    filter .name = 'troll2020'
).<author[is Review]
```

| --- |
| See also |
| EdgeQL > Delete |
| Reference > Commands > Delete |

