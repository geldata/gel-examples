# Schema

This page is intended as a rapid-fire overview of Gel’s schema definition language (SDL) so you can hit the ground running with Gel. Refer to the linked pages for more in-depth documentation!

## Scalar types

Gel implements a rigorous type system containing the following primitive types.

| --- | --- |
| Strings | str |
| Booleans | bool |
| Numbers | int16 int32 int64 float32 float64 bigint decimal |
| UUID | uuid |
| JSON | json |
| Dates and times | datetime cal::local_datetime cal::local_date cal::local_time |
| Durations | duration cal::relative_duration cal::date_duration |
| Binary data | bytes |
| Auto-incrementing counters | sequence |
| Enums | enum<x, y, z> |

These primitives can be combined into arrays, tuples, and ranges.

| --- | --- |
| Arrays | array<str> |
| Tuples (unnamed) | tuple<str, int64, bool> |
| Tuples (named) | tuple<name: str, age: int64, is_awesome: bool> |
| Ranges | range<float64> |

Collectively, primitive and collection types comprise Gel’s scalar type system.

## Object types

Object types are analogous to tables in SQL. They can contain properties, which can correspond to any scalar types, and links, which can correspond to any object types.

## Properties

Declare a property by naming it and setting its type.

```sdl
type Movie {
  title: str;
}
```

The property keyword can be omitted for non-computed properties.

See Schema > Object types.

## Links

Object types can have links to other object types.

```sdl
type Movie {
  required title: str;
  director: Person;
}

type Person {
  required name: str;
}
```

The link keyword can be omitted for non-computed links since Gel v3.

Use the required and multi keywords to specify the cardinality of the relation.

```sdl
type Movie {
  required title: str;

  cinematographer: Person;             # zero or one
  required director: Person;           # exactly one
  multi writers: Person;               # zero or more
  required multi actors: Person;       # one or more
}

type Person {
  required name: str;
}
```

To define a one-to-one relation, use an exclusive constraint.

```sdl
type Movie {
  required title: str;
  required stats: MovieStats {
    constraint exclusive;
  };
}

type MovieStats {
  required budget: int64;
  required box_office: int64;
}
```

See Schema > Links.

## Constraints

Constraints can also be defined at the object level.

```sdl
type BlogPost {
  title: str;
  author: User;

  constraint exclusive on ((.title, .author));
}
```

Constraints can contain exceptions; these are called partial constraints.

```sdl
type BlogPost {
  title: str;
  published: bool;

  constraint exclusive on (.title) except (not .published);
}
```

## Indexes

Use index on to define indexes on an object type.

```sdl
type Movie {
  required title: str;
  required release_year: int64;

  index on (.title);                        # simple index
  index on ((.title, .release_year));       # composite index
  index on (str_trim(str_lower(.title)));   # computed index
}
```

The id property, all links, and all properties with exclusive constraints are automatically indexed.

See Schema > Indexes.

## Schema mixins

Object types can be declared as abstract. Non-abstract types can extend abstract types.

```sdl
abstract type Content {
  required title: str;
}

type Movie extending Content {
  required release_year: int64;
}

type TVShow extending Content {
  required num_seasons: int64;
}
```

Multiple inheritance is supported.

```sdl
abstract type HasTitle {
  required title: str;
}

abstract type HasReleaseYear {
  required release_year: int64;
}

type Movie extending HasTitle, HasReleaseYear {
  sequel_to: Movie;
}
```

See Schema > Object types > Inheritance.

## Polymorphism

Links can correspond to abstract types. These are known as polymorphic links.

```sdl
abstract type Content {
  required title: str;
}

type Movie extending Content {
  required release_year: int64;
}

type TVShow extending Content {
  required num_seasons: int64;
}

type Franchise {
  required name: str;
  multi entries: Content;
}
```

See Schema > Links > Polymorphism and EdgeQL > Select > Polymorphic queries.

