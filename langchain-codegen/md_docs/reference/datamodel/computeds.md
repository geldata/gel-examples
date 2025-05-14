# Computeds

Object types can contain computed properties and links. Computed properties and links are not persisted in the database. Instead, they are evaluated on the fly whenever that field is queried. Computed properties must be declared with the property keyword and computed links must be declared with the link keyword in EdgeDB versions prior to 4.0.

```sdl
type Person {
  name: str;
  all_caps_name := str_upper(__source__.name);
}
```

Computed fields are associated with an EdgeQL expression. This expression can be an arbitrary EdgeQL query. This expression is evaluated whenever the field is referenced in a query.

Computed fields don’t need to be pre-defined in your schema; you can drop them into individual queries as well. They behave in exactly the same way. For more information, see the EdgeQL > Select > Computeds.

## Leading dot notation

The example above used the special keyword __source__ to refer to the current object; it’s analogous to this or self  in many object-oriented languages.

However, explicitly using __source__ is optional here; inside the scope of an object type declaration, you can omit it entirely and use the .<name> shorthand.

```sdl
type Person {
  first_name: str;
  last_name: str;
  full_name := .first_name ++ ' ' ++ .last_name;
}
```

## Type and cardinality inference

The type and cardinality of a computed field is inferred from the expression. There’s no need for the modifier keywords you use for non-computed fields (like multi and required). However, it’s common to specify them anyway; it makes the schema more readable and acts as a sanity check: if the provided EdgeQL expression disagrees with the modifiers, an error will be thrown the next time you try to create a migration.

```sdl
type Person {
  first_name: str;

  # this is invalid, because first_name is not a required property
  required first_name_upper := str_upper(.first_name);
}
```

## Common use cases

