# Inheritance

Inheritance is a crucial aspect of schema modeling in Gel. Schema items can extend one or more parent types. When extending, the child (subclass) inherits the definition of its parents (superclass).

You can declare abstract object types, properties, links, constraints, and annotations.

## Object types

Object types can extend other object types. The extending type (AKA the subtype) inherits all links, properties, indexes, constraints, etc. from its supertypes.

```sdl
abstract type Animal {
  species: str;
}

type Dog extending Animal {
  breed: str;
}
```

Both abstract and concrete object types can be extended. Whether to make a type abstract or concrete is a fairly simple decision: if you need to be able to insert objects of the type, make it a concrete type. If objects of the type should never be inserted and it exists only to be extended, make it an abstract one. In the schema below the Animal type is now concrete and can be inserted, which was not the case in the example above. The new CanBark type however is abstract and thus the database will not have any individual CanBark objects.

```sdl
abstract type CanBark {
  required bark_sound: str;
}

type Animal {
  species: str;
}

type Dog extending Animal, CanBark {
  breed: str;
}
```

For details on querying polymorphic data, see EdgeQL > Select > Polymorphic queries.

## Properties

Properties can be concrete (the default) or abstract. Abstract properties are declared independent of a source or target, can contain annotations, and can be marked as readonly.

```sdl
abstract property title_prop {
  annotation title := 'A title.';
  readonly := false;
}
```

## Links

It’s possible to define abstract links that aren’t tied to a particular source or target. Abstract links can be marked as readonly and contain annotations, property declarations, constraints, and indexes.

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

## Constraints

Use abstract to declare reusable, user-defined constraint types.

```sdl
abstract constraint in_range(min: anyreal, max: anyreal) {
  errmessage :=
    'Value must be in range [{min}, {max}].';
  using (min <= __subject__ and __subject__ < max);
}

type Player {
  points: int64 {
    constraint in_range(0, 100);
  }
}
```

## Annotations

EdgeQL supports three annotation types by default: title, description, and deprecated. Use abstract annotation to declare custom user-defined annotation types.

```sdl
abstract annotation admin_note;

type Status {
  annotation admin_note := 'system-critical';
  # more properties
}
```

By default, annotations defined on abstract types, properties, and links will not be inherited by their subtypes. To override this behavior, use the inheritable modifier.

```sdl
abstract inheritable annotation admin_note;
```

