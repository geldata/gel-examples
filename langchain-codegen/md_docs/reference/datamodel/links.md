# Links

Links define a relationship between two object types in Gel.

Links in Gel are incredibly powerful and flexible. They can be used to model relationships of any cardinality, can be traversed in both directions, can be polymorphic, can have constraints, and many other things.

## Links are directional

Links are directional: they have a source (the type on which they are declared) and a target (the type they point to).

E.g. the following schema defines a link from Person to Person and a link from Company to Person:

```sdl
type Person {
  link best_friend: Person;
}

type Company {
  multi link employees: Person;
}
```

The employees link’s source is Company and its target is Person.

The link keyword is optional, and can be omitted.

## Link cardinality

All links have a cardinality: either single or multi. The default is single (a “to-one” link). Use the multi keyword to declare a “to-many” link:

```sdl
type Person {
  multi friends: Person;
}
```

## Required links

All links are either optional or required; the default is optional. Use the required keyword to declare a required link. A required link must point to at least one target instance, and if the cardinality of the required link is single, it must point to exactly one target instance. In this scenario, every Person must have exactly one best_friend:

```sdl
type Person {
  required best_friend: Person;
}
```

Links with cardinality multi can also be required; required multi links must point to at least one target object:

```sdl
type Person {
  name: str;
}

type GroupChat {
  required multi members: Person;
}
```

Attempting to create a GroupChat with no members would fail.

## Exclusive constraints

You can add an exclusive constraint to a link to guarantee that no other instances can link to the same target(s):

```sdl
type Person {
  name: str;
}

type GroupChat {
  required multi members: Person {
    constraint exclusive;
  }
}
```

With exclusive on GroupChat.members, two GroupChat objects cannot link to the same Person; put differently, no Person can be a member of multiple GroupChat objects.

## Backlinks

In Gel you can traverse links in reverse to find objects that link to the object. You can do that directly in your query. E.g. for this example schema:

```sdl
type Author {
  name: str;
}

type Article {
  title: str;
  multi authors: Author;
}
```

You can find all articles by “John Doe” by traversing the authors link in reverse:

```edgeql
select Author {
  articles := .<authors[is Article]
}
filter .name = "John Doe";
```

While the .<authors[is Article] exppression looks complicated, the syntax is easy to read once you understand the structure of it:

If there’s a backlink that you will be traversing often, you can declare it as a computed link:

```sdl-diff
  type Author {
    name: str;
+   articles := .<authors[is Article];
  }
```

Last point to note: backlinks work in reverse to find objects that link to the object, and therefore assume multi as a default. Use the single keyword to declare a “to-one” backlink computed link:

```sdl
type CompanyEmployee {
  single company := .<employees[is Company];
}
```

## Default values

Links can declare a default value in the form of an EdgeQL expression, which will be executed upon insertion. In this example, new people are automatically assigned three random friends:

```sdl
type Person {
  required name: str;
  multi friends: Person {
    default := (select Person order by random() limit 3);
  }
}
```

## Modeling relations

By combining link cardinality and exclusivity constraints, we can model every kind of relationship: one-to-one, one-to-many, many-to-one, and many-to-many.

| --- | --- | --- |
| Relation type | Cardinality | Exclusive |
| One-to-one | single | Yes |
| One-to-many | multi | Yes |
| Many-to-one | single | No |
| Many-to-many | multi | No |

## Link properties

Like object types, links in Gel can contain properties. Link properties can store metadata about the link, such as the date a link was created or the strength of the relationship:

```sdl
type Person {
  name: str;
  multi family_members: Person {
    relationship: str;
  }
}
```

Link properties can only be primitive data (scalars, enums, arrays, or tuples) — not links to other objects. Also note that link properties cannot be made required. They are always optional by design.

Link properties are especially useful with many-to-many relationships, where the link itself is a distinct concept with its own data. For relations like one-to-one or one-to-many, it’s often clearer to store data in the object type itself instead of in a link property.

Read more about link properties in the dedicated link properties article.

## Deletion policies

Links can declare their own deletion policy for when the target or source is deleted.

## Polymorphic links

Links can be polymorphic, i.e., have an abstract target. In the example below, we have an abstract type Person with concrete subtypes Hero and Villain:

```sdl
abstract type Person {
  name: str;
}

type Hero extending Person {
  # additional fields
}

type Villain extending Person {
  # additional fields
}
```

A polymorphic link can target any non-abstract subtype:

```sdl
type Movie {
  title: str;
  multi characters: Person;
}
```

When querying a polymorphic link, you can filter by a specific subtype, cast the link to a subtype, etc. See Polymorphic Queries for details.

## Abstract links

It’s possible to define abstract links that aren’t tied to a particular source or target, and then extend them in concrete object types. This can help eliminate repetitive declarations:

```sdl
abstract link link_with_strength {
  strength: float64;
  index on (__subject__@strength);
}

type Person {
  multi friends: Person {
    extending link_with_strength;
  };
}
```

## Overloading

When an inherited link is modified (by adding more constraints or changing its target type, etc.), the overloaded keyword is required. This prevents unintentional overloading due to name clashes:

```sdl
abstract type Friendly {
  # this type can have "friends"
  multi friends: Friendly;
}

type User extending Friendly {
  # overload the link target to to be specifically User
  overloaded multi friends: User;

  # ... other links and properties
}
```

## Declaring links

This section describes the syntax to use links in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping links. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

