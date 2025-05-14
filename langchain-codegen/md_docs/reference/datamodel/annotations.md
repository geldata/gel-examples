# Annotations

Annotations are named values associated with schema items and are designed to hold arbitrary schema-level metadata represented as a str (unstructured text).

Users can store JSON-encoded data in annotations if they need to store more complex metadata.

## Standard annotations

There are a number of annotations defined in the standard library. The following are the annotations which can be set on any schema item:

For example, consider the following declaration:

```sdl
type Status {
  annotation title := 'Activity status';
  annotation description := 'All possible user activities';

  required name: str {
    constraint exclusive
  }
}
```

And the std::deprecated annotation can be used to mark deprecated items (e.g., str_rpad()) and to provide some information such as what should be used instead.

## User-defined annotations

To declare a custom annotation type beyond the three built-ins, add an abstract annotation type to your schema. A custom annotation could be used to attach arbitrary JSON-encoded data to your schema—potentially useful for introspection and code generation.

```sdl
abstract annotation admin_note;

type Status {
  annotation admin_note := 'system-critical';
}
```

## Declaring annotations

This section describes the syntax to use annotations in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping annotations and abstract annotations. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

