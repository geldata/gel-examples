# Cheatsheet

The types used as examples in these queries are defined in our “Object types” cheatsheet.

In order to set up GraphQL access to the database, add the following to the schema:

```sdl
using extension graphql;
```

Then create a new migration and apply it using gel migration create and gel migrate, respectively.

Select all users in the system:

```graphql
{
    User {
        id
        name
        image
    }
}
```

Select a movie by title and release year with associated actors ordered by last name:

```graphql
{
    Movie(
        filter: {
            title: {eq: "Dune"},
            year: {eq: 2020}
        }
    ) {
        id
        title
        year
        description

        directors {
            id
            full_name
        }

        actors(order: {last_name: {dir: ASC}}) {
            id
            full_name
        }
    }
}
```

Select movies with Keanu Reeves:

```graphql
{
    Movie(
        filter: {
            actors: {full_name: {eq: "Keanu Reeves"}}
        }
    ) {
        id
        title
        year
        description
    }
}
```

Select a movie by title and year with top 3 most recent reviews (this uses MovieAlias in order to access reviews):

```graphql
{
    MovieAlias(
        filter: {
            title: {eq: "Dune"},
            year: {eq: 2020}
        }
    ) {
        id
        title
        year
        description
        reviews(
            order: {creation_time: {dir: DESC}},
            first: 3
        ) {
            id
            body
            rating
            creation_time
            author {
                id
                name
            }
        }
    }
}
```

Use MovieAlias in order to find movies that have no reviews:

```graphql
{
    MovieAlias(
        filter: {
            reviews: {exists: false},
        }
    ) {
        id
        title
        year
        description
    }
}
```

Use a GraphQL mutation to add a user:

```graphql
mutation add_user {
    insert_User(
        data: {name: "Atreides", image: "atreides.jpg"}
    ) {
        id
    }
}
```

Use a GraphQL mutation to add a review by an existing user:

```graphql
mutation add_review {
    insert_Review(
        data: {
            # Since the movie already exists,
            # we select it using the same filter
            # mechanism as for queries.
            movie: {
                filter: {title: {eq: "Dune"}, year: {eq: 2020}},
                first: 1
            },
            body: "Yay!",
            rating: 5,
            # Similarly to the movie we select
            # the existing user.
            author: {
                filter: {name: {eq: "Atreides"}},
                first: 1
            }
        }
    ) {
        id
        body
    }
}
```

Use a GraphQL mutation to add an actress to a movie:

```graphql
mutation add_actor {
    update_Movie(
        # Specify which movie needs to be updated.
        filter: {title: {eq: "Dune"}, year: {eq: 2020}},
        # Specify the movie data to be updated.
        data: {
            actors: {
                add: [{
                    filter: {
                        full_name: {eq: "Charlotte Rampling"}
                    }
                }]
            }
        }
    ) {
        id
        actors {
            id
        }
    }
}
```

