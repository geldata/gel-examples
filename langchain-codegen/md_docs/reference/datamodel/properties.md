# Properties

Properties are used to associate primitive data with an object type or link.

```sdl
type Player {
  property email: str;
  points: int64;
  is_online: bool;
}
```

Properties are associated with a name (e.g. email) and a primitive type (e.g. str).

The term primitive type is an umbrella term that encompasses scalar types like str, arrays and tuples, and more.

Properties can be declared using the property keyword if that improves readability, or it can be ommitted.

## Required properties

Properties can be either optional (the default) or required.

E.g. here we have a User type that’s guaranteed to have an email, but name is optional and can be empty:

```sdl
type User {
  required email: str;
  optional name: str;
}
```

Since optional keyword is the default, we can omit it:

```sdl
type User {
  required email: str;
  name: str;
}
```

## Cardinality

Properties have a cardinality:

For example:

```sdl
type User {

  # "single" keyword isn't necessary here:
  # properties are single by default
  single name: str;

  # an unordered set of strings
  multi nicknames: str;

  # an unordered set of string arrays
  multi set_of_arrays: array<str>;
}
```

## multi vs. arrays

multi properties are stored differently than arrays under the hood. Essentially they are stored in a separate table (owner_id, value).

## Default values

Properties can have a default value. This default can be a static value or an arbitrary EdgeQL expression, which will be evaluated upon insertion.

```sdl
type Player {
  required points: int64 {
    default := 0;
  }

  required latitude: float64 {
    default := (360 * random() - 180);
  }
}
```

## Readonly properties

Properties can be marked as readonly. In the example below, the User.external_id property can be set at the time of creation but not modified thereafter.

```sdl
type User {
  required external_id: uuid {
    readonly := true;
  }
}
```

## Constraints

Properties can be augmented wth constraints. The example below showcases a subset of Gel’s built-in constraints.

```sdl
type BlogPost {
  title: str {
    constraint exclusive; # all post titles must be unique
    constraint min_len_value(8);
    constraint max_len_value(30);
    constraint regexp(r'^[A-Za-z0-9 ]+$');
  }

  status: str {
    constraint one_of('Draft', 'InReview', 'Published');
  }

  upvotes: int64 {
    constraint min_value(0);
    constraint max_value(9999);
  }
}
```

You can constrain properties with arbitrary EdgeQL expressions returning bool. To reference the value of the property, use the special scope keyword __subject__.

```sdl
type BlogPost {
  title: str {
    constraint expression on (
      __subject__ = str_trim(__subject__)
    );
  }
}
```

The constraint above guarantees that BlogPost.title doesn’t contain any leading or trailing whitespace by checking that the raw string is equal to the trimmed version. It uses the built-in str_trim() function.

For a full reference of built-in constraints, see the Constraints reference.

## Annotations

Properties can contain annotations, small human-readable notes. The built-in annotations are title, description, and deprecated. You may also declare custom annotation types.

```sdl
type User {
  email: str {
    annotation title := 'Email address';
  }
}
```

## Abstract properties

Properties can be concrete (the default) or abstract. Abstract properties are declared independent of a source or target, can contain annotations, constraints, indexes, and can be marked as readonly.

```sdl
abstract property email_prop {
  annotation title := 'An email address';
  readonly := true;
}

type Student {
  # inherits annotations and "readonly := true"
  email: str {
    extending email_prop;
  };
}
```

## Overloading properties

Any time we want to amend an inherited property (e.g. to add a constraint), the overloaded keyword must be used. This is to prevent unintentional overloading due to a name clash:

```sdl
abstract type Named {
    optional name: str;
}

type User extending Named {
    # make "name" required
    overloaded required name: str;
}
```

## Declaring properties

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping properties. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

