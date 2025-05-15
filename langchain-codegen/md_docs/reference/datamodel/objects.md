# Object Types

Object types are the primary components of a Gel schema. They are analogous to SQL tables or ORM models, and consist of properties and links.

## Properties

Properties are used to attach primitive/scalar data to an object type. For the full documentation on properties, see Properties.

```sdl
type Person {
  email: str;
}
```

Using in a query:

```edgeql
select Person {
  email
};
```

## Links

Links are used to define relationships between object types. For the full documentation on links, see Links.

```sdl
type Person {
  email: str;
  best_friend: Person;
}
```

Using in a query:

```edgeql
select Person {
  email,
  best_friend: {
    email
  }
};
```

## ID

There’s no need to manually declare a primary key on your object types. All object types automatically contain a property id of type UUID that’s required, globally unique, readonly, and has an index on it. The id is assigned upon creation and cannot be changed.

Using in a query:

```edgeql
select Person { id };
select Person { email } filter .id = <uuid>'123e4567-e89b-...';
```

## Abstract types

Object types can either be abstract or non-abstract. By default all object types are non-abstract. You can’t create or store instances of abstract types (a.k.a. mixins), but they’re a useful way to share functionality and structure among other object types.

```sdl
abstract type HasName {
  first_name: str;
  last_name: str;
}
```

## Inheritance

Object types can extend other object types. The extending type (AKA the subtype) inherits all links, properties, indexes, constraints, etc. from its supertypes.

```sdl
abstract type HasName {
  first_name: str;
  last_name: str;
}

type Person extending HasName {
  email: str;
  best_friend: Person;
}
```

Using in a query:

```edgeql
select Person {
  first_name,
  email,
  best_friend: {
    last_name
  }
};
```

## Multiple Inheritance

Object types can extend more than one type — that’s called multiple inheritance. This mechanism allows building complex object types out of combinations of more basic types.

Gel’s multiple inheritance should not be confused with the multiple inheritance of C++ or Python, where the complexity usually arises from fine-grained mixing of logic. Gel’s multiple inheritance is structural and allows for natural composition.

```sdl-diff
   abstract type HasName {
     first_name: str;
     last_name: str;
   }

+  abstract type HasEmail {
+    email: str;
+  }

-  type Person extending HasName {
+  type Person extending HasName, HasEmail {
-    email: str;
     best_friend: Person;
  }
```

If multiple supertypes share links or properties, those properties must be of the same type and cardinality.

## Defining object types

This section describes the syntax to declare object types in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping object types. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

