# Modules

Each branch has a schema consisting of several modules, each with a unique name. Modules can be used to organize large schemas into logical units. In practice, though, most users put their entire schema inside a single module called default.

```sdl
module default {
  # declare types here
}
```

## Name resolution

When you define a module that references schema objects from another module, you must use a fully-qualified name in the form other_module_name::object_name:

```sdl
module A {
  type User extending B::AbstractUser;
}

module B {
  abstract type AbstractUser {
    required name: str;
  }
}
```

## Reserved module names

The following module names are reserved by Gel and contain pre-defined types, utility functions, and operators:

## Modules are containers

They can contain types, functions, and other modules. Here’s an example of an empty module:

```sdl
module my_module {}
```

And here’s an example of a module with a type:

```sdl
module my_module {
  type User {
    required name: str;
  }
}
```

## Nested modules

```sdl
module dracula {
  type Person {
    required name: str;
    multi places_visited: City;
    strength: int16;
  }

  module combat {
    function fight(
      one: dracula::Person,
      two: dracula::Person
    ) -> str
      using (
        (one.name ?? 'Fighter 1') ++ ' wins!'
        IF (one.strength ?? 0) > (two.strength ?? 0)
        ELSE (two.name ?? 'Fighter 2') ++ ' wins!'
      );
  }
}
```

You can chain together module names in a fully-qualified name to traverse a tree of nested modules. For example, to call the fight function in the nested module example above, you would use dracula::combat::fight(<arguments>).

## Declaring modules

This section describes the syntax to declare a module in your schema.

## DDL commands

This section describes the low-level DDL commands for creating and dropping modules. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

