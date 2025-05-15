# Constraints

Constraints give users fine-grained control to ensure data consistency. They can be defined on properties, links, object types, and custom scalars.

## Standard constraints

Gel includes a number of standard ready-to-use constraints:

| --- | --- |
| exclusive | Enforce uniqueness (disallow duplicate values) |
| expression | Custom constraint expression (followed by keyword on) |
| one_of | A list of allowable values |
| max_value | Maximum value numerically/lexicographically |
| max_ex_value | Maximum value numerically/lexicographically (exclusive range) |
| min_value | Minimum value numerically/lexicographically |
| min_ex_value | Minimum value numerically/lexicographically (exclusive range) |
| max_len_value | Maximum length (str only) |
| min_len_value | Minimum length (str only) |
| regexp | Regex constraint (str only) |

## Constraints on properties

Example: enforce all User objects to have a unique username no longer than 25 characters:

```sdl
type User {
  required username: str {
    # usernames must be unique
    constraint exclusive;

    # max length (built-in)
    constraint max_len_value(25);
  };
}
```

## Constraints on object types

Constraints can be defined on object types. This is useful when the constraint logic must reference multiple links or properties.

Example: enforce that the magnitude of ConstrainedVector objects is no more than 5

```sdl
type ConstrainedVector {
  required x: float64;
  required y: float64;

  constraint expression on (
    (.x ^ 2 + .y ^ 2) ^ 0.5 <= 5
    # or, long form: `(__subject__.x + __subject__.y) ^ 0.5 <= 5`
  );
}
```

The expression constraint is used here to define custom constraint logic. Inside constraints, the keyword __subject__ can be used to reference the value being constrained.

Note that inside an object type declaration, you can omit __subject__ and simply refer to properties with the leading dot notation (e.g. .property).

Also note that the constraint expression are fairly restricted. Due to how constraints are implemented, you can only reference single (non-multi) properties and links defined on the object type: # Not valid! type User { required username: str; multi friends: User;  # ❌ constraints cannot contain paths with more than one hop constraint expression on ('bob' in .friends.username); }

## Abstract constraints

You can re-use constraints across multiple object types by declaring them as abstract constraints. Example:

```sdl
abstract constraint min_value(min: anytype) {
    errmessage :=
      'Minimum allowed value for {__subject__} is {min}.';

    using (__subject__ >= min);
}

# use it like this:

scalar type posint64 extending int64 {
    constraint min_value(0);
}

# or like this:

type User {
  required age: int16 {
    constraint min_value(12);
  };
}
```

## Computed constraints

Constraints can be defined on computed properties:

```sdl
type User {
  required username: str;
  required clean_username := str_trim(str_lower(.username));

  constraint exclusive on (.clean_username);
}
```

## Composite constraints

To define a composite constraint, create an exclusive constraint on a tuple of properties or links.

```sdl
type User {
  username: str;
}

type BlogPost {
  title: str;

  author: User;

  constraint exclusive on ((.title, .author));
}
```

## Partial constraints

Constraints on object types can be made partial, so that they are not enforced when the specified except condition is met.

```sdl
type User {
  required username: str;
  deleted: bool;

  # Usernames must be unique unless marked deleted
  constraint exclusive on (.username) except (.deleted);
}
```

## Constraints on links

You can constrain links such that a given object can only be linked once by using exclusive:

```sdl
type User {
  required name: str;

  # Make sure none of the "owned" items belong
  # to any other user.
  multi owns: Item {
    constraint exclusive;
  }
}
```

## Link property constraints

You can also add constraints for link properties:

```sdl
type User {
  name: str;

  multi friends: User {
    strength: float64;

    constraint expression on (
      @strength >= 0
    );
  }
}
```

## Link’s “@source” and “@target”

You can create a composite exclusive constraint on the object linking/linked and a link property by using @source or @target respectively. Here’s a schema for a library book management app that tracks books and who has checked them out:

```sdl
type Book {
  required title: str;
}

type User {
  name: str;
  multi checked_out: Book {
    date: cal::local_date;

    # Ensures a given Book can be checked out
    # only once on a given day.
    constraint exclusive on ((@target, @date));
  }
}
```

Here, the constraint ensures that no book can be checked out to two Users on the same @date.

In this example demonstrating @source, we’ve created a schema to track player picks in a color-based memory game:

```sdl
type Player {
  required name: str;

  multi picks: Color {
    order: int16;

    constraint exclusive on ((@source, @order));
  }
}

type Color {
  required name: str;
}
```

This constraint ensures that a single Player cannot pick two Colors at the same @order.

## Constraints on custom scalars

Custom scalar types can be constrained.

```sdl
scalar type username extending str {
  constraint regexp(r'^[A-Za-z0-9_]{4,20}$');
}
```

Note: you can’t use exclusive constraints on custom scalar types, as the concept of exclusivity is only defined in the context of a given object type.

Use expression constraints to declare custom constraints using arbitrary EdgeQL expressions. The example below uses the built-in str_trim() function.

```sdl
scalar type title extending str {
  constraint expression on (
    __subject__ = str_trim(__subject__)
  );
}
```

## Constraints and inheritance

If you define a constraint on a type and then extend that type, the constraint will not be applied individually to each extending type. Instead, it will apply globally across all the types that inherited the constraint.

```sdl
type User {
  required name: str {
    constraint exclusive;
  }
}
type Administrator extending User;
type Moderator extending User;
```

```edgeql-repl
gel> insert Administrator {
....  name := 'Jan'
.... };
{default::Administrator {id: 7aeaa146-f5a5-11ed-a598-53ddff476532}}

gel> insert Moderator {
....  name := 'Jan'
.... };
gel error: ConstraintViolationError: name violates exclusivity constraint
  Detail: value of property 'name' of object type 'default::Moderator'
  violates exclusivity constraint

gel> insert User {
....  name := 'Jan'
.... };
gel error: ConstraintViolationError: name violates exclusivity constraint
  Detail: value of property 'name' of object type 'default::User'
  violates exclusivity constraint
```

As this example demonstrates, if an object of one extending type has a value for a property that is exclusive, an object of a different extending type cannot have the same value.

If that’s not what you want, you can instead delegate the constraint to the inheriting types by prepending the delegated keyword to the constraint. The constraint would then be applied just as if it were declared individually on each of the inheriting types.

```sdl
type User {
  required name: str {
    delegated constraint exclusive;
  }
}
type Administrator extending User;
type Moderator extending User;
```

```edgeql-repl
gel> insert Administrator {
....  name := 'Jan'
.... };
{default::Administrator {id: 7aeaa146-f5a5-11ed-a598-53ddff476532}}

gel> insert User {
....  name := 'Jan'
.... };
{default::User {id: a6e3fdaf-c44b-4080-b39f-6a07496de66b}}

gel> insert Moderator {
....  name := 'Jan'
.... };
{default::Moderator {id: d3012a3f-0f16-40a8-8884-7203f393b63d}}

gel> insert Moderator {
....  name := 'Jan'
.... };
gel error: ConstraintViolationError: name violates exclusivity constraint
  Detail: value of property 'name' of object type 'default::Moderator'
  violates exclusivity constraint
```

With the addition of delegated to the constraints, the inserts were successful for each of the types. We did not hit a constraint violation until we tried to insert a second Moderator object with the same name as the existing one.

## Declaring constraints

This section describes the syntax to declare constraints in your schema.

## DDL commands

This section describes the low-level DDL commands for creating and dropping constraints and abstract constraints. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

