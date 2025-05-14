# Declaring aliases

Define an alias that merges some information from links as computed properties, this is a way of flattening a nested structure:

```sdl
alias ReviewAlias := Review {
    # It will already have all the Review
    # properties and links.
    author_name := .author.name,
    movie_title := .movie.title,
}
```

Define an alias for traversing a backlink, this is especially useful for GraphQL access:

```sdl
alias MovieAlias := Movie {
    # A computed link for accessing all the
    # reviews for this movie.
    reviews := .<movie[is Review]
}
```

Aliases allow to use the full power of EdgeQL (expressions, aggregate functions, backlink navigation) from GraphQL.

The aliases defined above allow you to query MovieAlias with GraphQL.

| --- |
| See also |
| Schema > Aliases |
| SDL > Aliases |
| DDL > Aliases |

